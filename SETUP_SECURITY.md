# 🔐 Dragon Store — Security Setup Guide (Vercel)

## STEP 1: Setup Environment Variables

### Lokal (development)
Buat file `.env` di root project (JANGAN commit ke Git!):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ALLOWED_ORIGIN=http://localhost:5173
```

### Vercel (production)
1. Buka **Vercel Dashboard → Project → Settings → Environment Variables**
2. Tambah semua variable di atas (ganti `ALLOWED_ORIGIN` jadi domain kamu)
3. **Redeploy** setelah menambah variable

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` JANGAN pernah diisi di variable yang prefix `VITE_`
> Prefix `VITE_` = expose ke browser = BAHAYA

---

## STEP 2: Jalankan RLS SQL

1. Buka **Supabase Dashboard → SQL Editor**
2. Copy-paste isi file `supabase/security_rls.sql`
3. Klik **Run**
4. Pastikan output terakhir menampilkan semua policy aktif

---

## STEP 3: Setup Supabase Auth

Di **Supabase Dashboard → Authentication → URL Configuration**:
- **Site URL:** `https://dragonstoreid.vercel.app`
- **Redirect URLs:** tambahkan `https://dragonstoreid.vercel.app/verify`

---

## STEP 4: Update ID System

Jalankan di SQL Editor:
```sql
create or replace function public.generate_public_id()
returns text language sql as $$
  select lpad(nextval('public.profile_seq')::text, 8, '0');
$$;
```

---

## Checklist Keamanan

- [ ] `.env` tidak di-commit (ada di `.gitignore`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` hanya di Vercel env (tidak ada prefix `VITE_`)
- [ ] RLS aktif di semua table
- [ ] Redirect URL `/verify` terdaftar di Supabase Auth
- [ ] Security headers aktif di `vercel.json`

---

## Cara Kerja Sistem

```
User daftar → /api/auth (Vercel Serverless) → Supabase Admin API
                    ↑
     Service Role Key aman di sini (server only)
     Tidak bisa dilihat dari DevTools / inspect

User login/baca data → Supabase langsung (Anon Key)
                              ↑
                   RLS filter otomatis per user
```
