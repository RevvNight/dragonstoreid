// api/auth.mjs — Vercel Serverless Function (ES Module)
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL              = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ALLOWED_ORIGIN            = process.env.ALLOWED_ORIGIN || "https://dragonstoreid.vercel.app";

const corsHeaders = {
  "Access-Control-Allow-Origin":  ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

// ── Rate limit per IP ─────────────────────────────────────────────────────────
const ipMap = new Map();
function isRateLimited(ip, max = 5) {
  const now = Date.now();
  const win = 60 * 60 * 1000;
  const e   = ipMap.get(ip) || { count: 0, resetAt: now + win };
  if (now > e.resetAt) { e.count = 0; e.resetAt = now + win; }
  e.count++;
  ipMap.set(ip, e);
  return e.count > max;
}

const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
const SUSPICIOUS  = [/(\bSELECT\b|\bDROP\b|\bUNION\b)/i, /<script/i, /javascript:/i];
function isSuspicious(...vals) {
  return vals.some(v => typeof v === "string" && SUSPICIOUS.some(p => p.test(v)));
}

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[AUTH] Missing env vars");
    return res.status(500).json({ error: "Konfigurasi server belum lengkap. Set env vars di Vercel." });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const ua = (req.headers["user-agent"] || "").toLowerCase();
  if (["sqlmap","nikto","nmap","masscan","nuclei"].some(b => ua.includes(b))) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { action, payload } = req.body || {};
  if (!action || !payload) return res.status(400).json({ error: "Bad request" });

  if (isSuspicious(...Object.values(payload).filter(v => typeof v === "string"))) {
    return res.status(400).json({ error: "Input tidak valid." });
  }

  const clientIp = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";

  try {
    switch (action) {

      case "signup": {
        const { username, email, password, redirectTo } = payload;

        if (!username || !email || !password)
          return res.status(400).json({ error: "Semua kolom wajib diisi." });
        if (!USERNAME_RE.test(username))
          return res.status(400).json({ error: "Username hanya huruf, angka, underscore (3-30 karakter)." });
        if (!EMAIL_RE.test(email))
          return res.status(400).json({ error: "Format email tidak valid." });
        if (password.length < 6)
          return res.status(400).json({ error: "Password minimal 6 karakter." });
        if (isRateLimited(clientIp, 5))
          return res.status(429).json({ error: "RATE_LIMIT" });

        const { data: existing } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("email", email.toLowerCase())
          .single();

        if (existing)
          return res.status(409).json({ error: "Email sudah terdaftar." });

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: email.toLowerCase(),
          password,
          email_confirm: false,
          user_metadata: { username },
          options: { emailRedirectTo: redirectTo || `${ALLOWED_ORIGIN}/verify` }
        });

        if (error) {
          if (error.status === 429 || error.message?.toLowerCase().includes("rate"))
            return res.status(429).json({ error: "RATE_LIMIT" });
          return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ success: true, userId: data.user?.id });
      }

      case "resend_verification": {
        const { email, redirectTo } = payload;
        if (!email || !EMAIL_RE.test(email))
          return res.status(400).json({ error: "Format email tidak valid." });
        if (isRateLimited(`resend_${clientIp}`, 3))
          return res.status(429).json({ error: "RATE_LIMIT" });

        const { error } = await supabaseAdmin.auth.resend({
          type: "signup",
          email: email.toLowerCase(),
          options: { emailRedirectTo: redirectTo || `${ALLOWED_ORIGIN}/verify` }
        });

        if (error) {
          if (error.status === 429 || error.message?.toLowerCase().includes("rate"))
            return res.status(429).json({ error: "RATE_LIMIT" });
          return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ success: true });
      }

      default:
        return res.status(400).json({ error: "Action tidak dikenal." });
    }
  } catch (err) {
    console.error("[AUTH ERROR]", err);
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
};
