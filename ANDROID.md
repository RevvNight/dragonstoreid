# 📱 Dragon Store — Jadi APK Android (Capacitor)

Project ini sudah disiapkan dengan **Capacitor**, cara paling umum untuk bungkus web app React jadi APK Android asli (bukan sekadar shortcut browser).

> Catatan: build APK **wajib** dilakukan di komputer kamu sendiri (perlu Android Studio + Android SDK). Tidak bisa di-generate otomatis di sini.

## Yang dibutuhkan di komputer kamu

1. **Node.js** 18+ — [nodejs.org](https://nodejs.org)
2. **Android Studio** — [developer.android.com/studio](https://developer.android.com/studio) (sudah termasuk Android SDK)
3. **Java JDK 17** (biasanya sudah ikut terinstall bareng Android Studio)

## Langkah-langkah

### 1. Install dependency

```bash
npm install
```

### 2. Generate semua ukuran ikon Android dari logo Dragon Store

Logo Dragon Store kamu sudah terpasang di `public/icon.png` (1254×1254, sudah bulat dengan margin aman — pas buat adaptive icon Android).

Untuk generate semua ukuran ikon yang dibutuhkan Android (termasuk adaptive icon & splash screen):
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --iconBackgroundColor '#0A0A0F' --iconBackgroundColorDark '#0A0A0F'
```
Tool ini otomatis baca `public/icon.png` dan generate semua ukuran ikon yang dibutuhkan Android, lalu menaruhnya langsung ke folder `android/` (jadi jalankan ini **setelah** langkah `npx cap add android` di bawah).

### 2. Build web app & tambahkan platform Android

```bash
npm run build
npx cap add android
```

Ini bikin folder baru `android/` — itu project Android native lengkap (Gradle project).

### 3. Generate semua ukuran ikon Android dari logo Dragon Store

Logo Dragon Store kamu sudah terpasang di `public/icon.png` (1254×1254, sudah bulat dengan margin aman — pas buat adaptive icon Android).

Untuk generate semua ukuran ikon yang dibutuhkan Android (termasuk adaptive icon & splash screen), langsung ke folder `android/`:
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --iconBackgroundColor '#0A0A0F' --iconBackgroundColorDark '#0A0A0F'
```

### 4. Sinkronkan setiap kali ada perubahan kode

```bash
npm run android:sync
```
(Ini otomatis `npm run build` lalu `npx cap sync android` — jalankan ini tiap habis edit `src/App.jsx`.)

### 5. Buka & build di Android Studio

```bash
npm run android:open
```

Android Studio akan terbuka dengan project `android/`. Dari situ:

- **Untuk testing cepat:** klik tombol ▶️ Run, pilih emulator atau HP yang terhubung lewat USB (aktifkan Developer Mode + USB Debugging di HP dulu).
- **Untuk dapat file APK:** menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**. File `.apk` akan muncul di `android/app/build/outputs/apk/debug/app-debug.apk` — ini sudah bisa diinstall langsung di HP Android (perlu mengizinkan "Install dari sumber tidak dikenal" di setting HP).
- **Untuk publish ke Google Play:** perlu di-**sign** dengan keystore (Build → Generate Signed Bundle / APK), lalu upload ke [Google Play Console](https://play.google.com/console) (ada biaya akun developer sekali $25).

## Kalau cuma mau APK tanpa install Android Studio penuh

Alternatif lebih ringan: pakai layanan seperti [PWA Builder](https://www.pwabuilder.com) — upload URL web app kamu yang sudah live (hasil deploy Vercel/Netlify), nanti otomatis dibungkus jadi APK dari manifest PWA yang sudah disiapkan di `public/manifest.json`. Hasilnya lebih sederhana (WebView wrapper) dibanding Capacitor, tapi tidak perlu Android Studio sama sekali.

## Tips

- Tiap ubah kode di `src/`, jalankan ulang `npm run android:sync` sebelum build APK baru.
- Nama app yang muncul di home screen HP diatur di `capacitor.config.js` (`appName: "Dragon Store"`) — sudah di-set.
- `appId` (`com.dragonstore.app`) adalah ID unik app kamu — kalau nanti publish ke Play Store, ID ini tidak bisa diganti lagi setelah publish pertama, jadi sudah aman dipakai sebagai default kalau belum punya domain/brand ID khusus.
