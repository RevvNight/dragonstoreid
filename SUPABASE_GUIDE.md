# 🐉 Dragon Store + Supabase: Panduan Lengkap

Toko ini pakai **Supabase** sebagai database terpusat. Semua data (akun, like, komentar, notifikasi, profil, status online, ban) **global** — sama persis dilihat dari device mana pun, bukan per-browser.

## Langkah 1: Jalankan skema database

**Kalau ini setup BARU (belum pernah jalankan schema.sql sama sekali):**

1. Buka [supabase.com/dashboard](https://supabase.com/dashboard) → project Dragon Store kamu
2. Sidebar kiri → **SQL Editor** → **New query**
3. Buka file `supabase/schema.sql` di project ini, copy semua isinya, paste ke SQL Editor, klik **Run**

> ⚠️ **Kalau kamu sudah pernah jalankan versi `schema.sql` sebelumnya** dan project Supabase-nya sama, `create table` untuk tabel yang sudah ada akan **error**. Jangan jalankan `schema.sql` lagi — langsung ke poin di bawah ini.

**Kalau project Supabase kamu SUDAH PERNAH disetup sebelumnya (sudah ada data/akun):**

Jalankan `supabase/fix_and_upgrade.sql` saja (SQL Editor → New query → copy isinya → Run). File ini aman dijalankan di project yang sudah berjalan — tidak menghapus data apa pun, hanya menambahkan kolom/tabel/kebijakan baru yang belum ada. Ini juga file yang sama untuk:
- Memperbaiki fitur komentar yang sebelumnya error
- Menambahkan sistem **Seller** (owner bisa angkat member jadi seller)
- Menambahkan sistem **Centang Biru** (verified, independen dari role)
- Menambahkan fitur **Teman** (cari teman, jumlah teman publik, daftar privat)
- Mengetatkan keamanan beberapa kebijakan yang sebelumnya kelonggaran

Boleh dijalankan berkali-kali kalau ragu — semua perintahnya aman diulang (idempotent).

## Langkah 2: Bersihkan akun lama (sekali jalan)

Kalau kamu cuma menambah tabel baru tanpa hapus semua (skip warning di atas), jalankan ini secara terpisah untuk membersihkan akun-akun testing:

1. SQL Editor → **New query**
2. Copy isi `supabase/cleanup_old_accounts.sql`, paste, **Run**
3. Ini menghapus SEMUA akun (termasuk akun owner) — daftar ulang pakai email owner yang sama setelah ini, sistem otomatis mengenalinya lagi sebagai owner. Produk **tidak** ikut terhapus.

## Langkah 3: Aktifkan verifikasi email dengan link klik

Ini sudah perilaku **default** Supabase — gak perlu setting tambahan, tapi pastikan:

1. **Authentication → Providers → Email**: pastikan **"Confirm email" AKTIF** (kalau sebelumnya kamu matikan untuk testing cepat, nyalakan lagi sekarang)
2. **Authentication → URL Configuration**:
   - **Site URL**: isi dengan domain tempat app kamu nanti live (misal `https://dragon-store.netlify.app`). Untuk testing lokal dulu, boleh `http://localhost:5173`
   - **Redirect URLs**: tambahkan domain yang sama (boleh keduanya: localhost untuk testing, domain asli untuk production)
3. Setelah ini, tiap orang daftar akan dikirimi email berisi link "Confirm your email" — begitu diklik, otomatis login dan masuk ke app.

> Kalau **Site URL** salah/belum diisi, link di email akan mengarah ke tempat yang salah. Update ini lagi kalau domain final kamu berubah.

## Langkah 4: Pastikan kredensial sudah benar

File `.env` di root project **sudah diisi otomatis**:
```
VITE_SUPABASE_URL=https://iwknbojvslvnihexsmfo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```
Kalau ganti project Supabase nanti, update dua nilai ini sesuai Settings → API project barumu.

## Langkah 5: Jalankan & test lokal

```bash
npm install
npm run dev
```

Coba: daftar akun baru → cek email → klik link verifikasi → otomatis login. Lalu like produk, kirim komentar, buka profil publik (`/profile/000000001`), cek status online/offline. Buka link yang sama di device lain untuk pastikan semuanya kebaca global.

## Langkah 6: Deploy — set environment variable di hosting

File `.env` **tidak ikut ter-upload ke GitHub**, jadi saat deploy, set manual di dashboard hosting:

**Netlify**: Site settings → Environment variables → tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` → Trigger deploy
**Vercel**: Project Settings → Environment Variables → sama seperti di atas → Redeploy

> Drag & drop folder `dist` tanpa GitHub: env var sudah "terbakar" otomatis saat `npm run build` di komputer kamu, asal `.env` sudah benar sebelum build.

## Ringkasan fitur baru

| Fitur | Cara pakai |
|---|---|
| **Verifikasi email via link** | Otomatis aktif setelah Langkah 3. User klik link di email → langsung login. |
| **Seller** | Owner Panel → tab "👥 Member" → klik "🏷️ Jadikan Seller" pada member. Seller dapat menu "🏷️ Jual" sendiri untuk tambah/edit/hapus produk **miliknya sendiri saja** — dijamin di level database (RLS), bukan cuma disembunyikan di tampilan. |
| **Centang biru (verified)** | Independen dari role — owner Panel → tab "👥 Member" → klik "✅ Beri Centang Biru" pada akun mana pun (seller maupun member biasa). Owner sendiri SELALU otomatis verified, tidak perlu diatur manual dan tidak bisa dicabut. |
| **Cari Teman** | Halaman Profil → tombol "🔍 Cari Teman". Cari berdasarkan username, tambah/hapus dari daftar teman. Jumlah teman tampil publik di profil, tapi daftar siapa-siapanya tetap privat (hanya pemilik akun yang bisa lihat). |
| **Notifikasi "teman menyukai produk"** | Saat seseorang like (❤️) sebuah produk, semua orang yang menjadikan dia teman otomatis dapat notifikasi. |
| **Seller bisa hapus komentar di produknya** | Bukan cuma owner — seller juga bisa hapus komentar siapa pun yang masuk di produk miliknya sendiri. |
| **Notifikasi produk baru** | Otomatis: begitu owner menambah produk baru di Owner Panel, semua member dapat notifikasi. |
| **Kirim notifikasi custom** | Owner Panel → tab "📣 Kirim Notifikasi" → isi judul & deskripsi → pilih Global (semua member) atau masukkan Public ID tertentu (pisah koma/baris baru). |
| **Share produk & profil** | Tombol "🔗 Bagikan" di halaman detail produk dan halaman profil — pakai share sheet HP, atau copy link otomatis di desktop. |
| **Like komentar untuk semua** | Semua user login bisa like komentar siapa pun. |
| **Status Online/Offline** | Otomatis — app update status tiap 60 detik selagi dibuka. Terlihat di tiap profil (titik hijau = online) dan ringkasan total di Owner Panel → tab "👥 Member". |
| **Ban dengan durasi** | Owner Panel → tab "👥 Member" → klik "Ban" pada member → isi durasi (jam) dan alasan → Konfirmasi. Kosongkan durasi untuk ban permanen. |
| **Unban** | Tab "👥 Member" → klik "Unban" pada member yang sedang dibanned. |
| **Auto-hapus akun saat ban habis** | Saat user yang dibanned membuka app lagi setelah durasi habis, akunnya otomatis terhapus permanen — mereka hanya akan melihat pesan bahwa akun sudah dihapus. |
| **Layar khusus saat dibanned** | Selama masih dalam masa ban, user hanya bisa lihat 2 tombol: Logout atau Hubungi Owner (WhatsApp). Tidak bisa akses bagian lain dari app. |
| **Format ID akun baru** | Akun baru yang daftar sekarang mendapat ID bergaya `0~~~1`, `0~~~2`, dst (lihat komentar di `generate_public_id()` pada `schema.sql` untuk cara menyesuaikannya kalau kode ini dipakai lagi untuk toko lain). Akun lama tetap memakai ID format sebelumnya. |

## Catatan penting soal sistem Ban

- Penghapusan otomatis akun yang ban-nya habis **baru terjadi saat akun itu sendiri login/membuka app lagi** — bukan terhapus tepat di detik ban berakhir tanpa aktivitas apa pun. Ini batasan teknis karena penghapusan akun butuh sesi aktif dari akun yang bersangkutan (cara paling aman tanpa membagikan kunci admin Supabase yang sensitif). Praktiknya ini jarang masalah karena user yang dibanned biasanya akan coba login lagi untuk cek status.
- Ban permanen ditandai dengan tanggal jauh (`9999`), bukan benar-benar "selamanya" di level database — tapi efeknya sama karena tidak akan pernah expired secara wajar. Tetap bisa di-unban kapan saja oleh owner.

## Catatan keamanan

- **anon key** di `.env` aman untuk publik — keamanan diatur lewat Row Level Security (RLS), bukan dengan menyembunyikan key ini.
- Aksi admin/seller (kelola produk/kategori, hapus komentar, ban/unban, kirim notifikasi, ubah status seller/verified) dibatasi **di dua lapis**: tampilan aplikasi (tombolnya cuma muncul untuk yang berhak) **dan** kebijakan Row Level Security di database — jadi tetap aman meskipun seseorang mencoba memanggil API Supabase langsung lewat browser dev tools, lewat Postman, dsb, melewati tampilan app sama sekali.
- Seller hanya bisa insert/update/delete produk dengan `seller_id` = dirinya sendiri — dijamin oleh kebijakan database, bukan sekadar disembunyikan di UI.
- Status seller dan centang biru hanya bisa diubah lewat fungsi RPC khusus (`set_seller_status`, `set_verified_status`) yang dijalankan di server Supabase dan memverifikasi ulang bahwa pemanggilnya memang owner — jadi tidak bisa dipalsukan dari sisi client.
- Daftar teman (siapa berteman dengan siapa) tidak pernah bisa dibaca siapa pun selain pemilik akunnya sendiri — bahkan lewat API langsung. Hanya **jumlahnya** yang bisa diambil publik, lewat fungsi khusus yang tidak membuka daftar aslinya.
- Jangan pernah share **service_role key** (kunci Supabase lain yang lebih sensitif) — project ini tidak memakainya sama sekali.

## Reset / lihat data langsung

Untuk melihat/edit/hapus data manual, Supabase Dashboard → **Table Editor** → pilih tabel (`profiles`, `products`, `comments`, dst).
