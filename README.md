# 🐉 Dragon Store

**v1.2.0** · Toko digital (top up game, e-wallet, voucher, dll) — React + Vite + Supabase.

🗄️ **Pertama kali pakai? Mulai dari [`SUPABASE_GUIDE.md`](./SUPABASE_GUIDE.md)** — wajib dibaca sebelum `npm run dev`, karena aplikasi butuh database Supabase untuk login, like, komentar, dll.

📱 **Mau dijadikan APK Android?** Lihat panduan lengkap di [`ANDROID.md`](./ANDROID.md).

## ✨ Update terbaru (v1.2.0)

- **Verifikasi email via link klik** — pendaftaran sekarang mengirim email berisi link konfirmasi; klik link-nya untuk otomatis terverifikasi & login.
- **Status Online/Offline** — terlihat di tiap profil (titik hijau = online), dengan ringkasan total online/offline dari semua member di Owner Panel.
- **Ban dengan durasi & alasan** — Owner Panel → tab Member → atur durasi (jam) dan alasan ban. Selama dibanned, user hanya bisa Logout atau hubungi owner via WhatsApp. Kalau durasi habis tanpa di-unban, akun otomatis terhapus permanen. Owner juga bisa Unban kapan saja.
- **Notifikasi produk baru ke semua member** — otomatis terkirim begitu owner menambah produk baru.
- **Kirim notifikasi custom oleh owner** — judul + deskripsi, target Global (semua member) atau pilih beberapa member lewat Public ID.
- **Tombol Share** — share link produk dan link profil, pakai share sheet HP atau copy-link otomatis di desktop.
- **Like komentar untuk semua client** — sebelumnya hanya owner yang bisa like komentar, sekarang semua user login bisa.

## Update sebelumnya

- **Like, Favorit, & Simpan produk** — semua butuh login. Like memengaruhi urutan produk (paling banyak disukai naik ke atas di Beranda & hasil Cari). Favorit & Simpan muncul sebagai koleksi pribadi di halaman Profil.
- **Komentar produk** — di tiap halaman detail produk (`/produk/:id`), pengunjung yang sudah login bisa berkomentar. Owner bisa menghapus komentar.
- **Profil publik** — tiap user punya halaman publik `/profile/000000001`, `/profile/000000002`, dst (sesuai urutan daftar).
- **Tampilan auto-responsive** — layout otomatis menyesuaikan, nyaman dilihat baik di HP maupun PC/laptop.
- **Siap dibungkus jadi APK Android** via Capacitor (lihat `ANDROID.md`).
- **Routing URL asli** (pakai React Router) — `/dashboard`, `/profil`, `/cari`, `/produk/:id`, dll.
- **Search bisa pakai Product ID**.

## Cara jalanin di komputer kamu

1. Pastikan sudah install **Node.js** (versi 18 ke atas). Cek dengan:
   ```bash
   node --version
   ```
   Kalau belum ada, download di [nodejs.org](https://nodejs.org).

2. Extract folder ini, buka terminal di dalam folder `dragon-store`, lalu jalankan:
   ```bash
   npm install
   ```
   Tunggu sampai selesai (download dependency React & Vite).

3. Jalankan mode development:
   ```bash
   npm run dev
   ```
   Buka link yang muncul di terminal (biasanya `http://localhost:5173`).

4. Coba fitur-fiturnya: daftar akun, login, login sebagai **Owner** (pakai email yang sudah di-set di `src/App.jsx`), tambah produk, dll.

## Cara publish ke Vercel (rekomendasi)

**Via dashboard (tanpa GitHub, paling cepat):**
1. Buka [vercel.com/new](https://vercel.com/new) → login → pilih **"Deploy without Git" / drag & drop folder** (atau pakai [Vercel CLI](https://vercel.com/docs/cli), lihat di bawah).
2. Kalau pakai drag & drop: build dulu di komputer kamu (`npm install && npm run build`), lalu upload folder **`dist`**.
3. **WAJIB**: di Project Settings → Environment Variables, tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (isi dari file `.env`), lalu **redeploy** supaya env var ter-pakai di build.

**Via Vercel CLI (paling gampang kalau sudah install Node):**
```bash
npm install -g vercel
vercel login
vercel          # ikuti prompt, pilih default untuk semua pertanyaan
vercel --prod   # deploy ke production setelah preview-nya OK
```
File `vercel.json` di project ini sudah disiapkan (build command, output folder `dist`, dan rewrite SPA agar refresh halaman seperti `/produk/abc123` tidak 404). Vercel CLI akan menanyakan environment variables saat deploy pertama — isi dengan nilai dari `.env`.

**Via GitHub (auto-deploy tiap push):**
1. Push folder ini ke GitHub (lihat langkah git di bagian Netlify di bawah kalau belum pernah).
2. Buka [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → pilih repo kamu.
3. Vercel otomatis mendeteksi ini project Vite (lewat `vercel.json`) — build command dan output directory sudah otomatis benar.
4. **WAJIB**: Environment Variables → tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
5. Klik **Deploy**.

Setelah ini, tiap `git push` ke branch utama otomatis trigger deploy baru.

## Cara publish ke Netlify — Drag & Drop (paling gampang, tanpa GitHub)

1. **Build dulu project-nya** di komputer kamu — buka terminal di folder ini:
   ```bash
   npm install
   npm run build
   ```
   Ini bikin folder baru bernama **`dist`** yang isinya hasil jadi (HTML/CSS/JS siap pakai).

2. Buka [app.netlify.com/drop](https://app.netlify.com/drop)

3. **Drag folder `dist`** (bukan folder utama, harus folder `dist`-nya saja) ke kotak upload di halaman itu.

4. Tunggu beberapa detik — Netlify langsung kasih link publik, contoh: `random-name-123.netlify.app`

5. (Opsional) Klik **"Site settings" → "Change site name"** kalau mau ganti nama link jadi lebih bagus, misal `dragon-store-id.netlify.app`.

Selesai — gak perlu bikin akun GitHub atau push kode sama sekali untuk cara ini. **Tapi ingat:** environment variable Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) sudah otomatis "terbakar" ke hasil build saat `npm run build`, jadi pastikan `.env` sudah benar SEBELUM langkah build di atas.

## Cara publish ke Netlify — via GitHub (kalau mau auto-update tiap kamu edit kode)

1. Push folder ini ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Dragon Store"
   git branch -M main
   git remote add origin <URL_REPO_GITHUB_KAMU>
   git push -u origin main
   ```
2. Buka [app.netlify.com](https://app.netlify.com) → login → **"Add new site" → "Import an existing project"**
3. Pilih repo GitHub kamu.
4. Netlify otomatis baca file `netlify.toml` yang sudah disiapkan (build command & publish folder sudah otomatis benar — `npm run build` dan folder `dist`).
5. **WAJIB**: Site settings → Environment variables → tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (isi dari file `.env`), karena file `.env` tidak ikut ter-upload ke GitHub.
6. Klik **Deploy site**.

Dengan cara ini, setiap kamu `git push` perubahan baru, Netlify otomatis build & update sitenya sendiri.

## ✅ Soal data: sudah global lewat Supabase

Sejak update terbaru, semua data (akun, produk, like, favorit, simpan, komentar, notifikasi, profil publik) **tersimpan di Supabase** — database terpusat, bukan lagi localStorage browser. Artinya:

- **Data sama untuk semua orang**, dari device apa pun. Like dan komentar yang kamu buat akan langsung terlihat oleh pengunjung lain yang membuka link yang sama.
- **WAJIB jalankan setup Supabase dulu** sebelum pakai — lihat panduan lengkap di [`SUPABASE_GUIDE.md`](./SUPABASE_GUIDE.md): jalankan skema SQL, lalu **set environment variable di dashboard hosting** (Netlify/Vercel) sebelum deploy, karena file `.env` tidak ikut ter-upload ke GitHub.
- Tanpa langkah di atas, aplikasi tidak akan bisa login/like/komentar sama sekali (akan muncul error koneksi ke Supabase).

## Struktur file

```
dragon-store/
├── index.html          # entry HTML
├── package.json        # daftar dependency
├── vite.config.js       # konfigurasi Vite
└── src/
    ├── main.jsx         # mounting React ke DOM
    └── App.jsx          # seluruh logic & UI Dragon Store ID
```
