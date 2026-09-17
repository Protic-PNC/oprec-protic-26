# 📘 Panduan Serah Terima & Pemeliharaan Kode (Handover Guide)
## Sistem Open Recruitment PROTIC — Kabinet Selanjutnya (2027/2028+)

Selamat datang pengurus dan tim pengembang divisi Web/DevOps periode selanjutnya! Dokumen ini dirancang agar Anda dapat memahami, mengonfigurasi, dan memperbarui sistem pendaftaran ini tanpa harus meraba-raba atau membaca ribuan baris kode.

---

## 🏛️ 1. Peta Arsitektur & Struktur Direktori

Basis kode telah direfaktor dengan prinsip **Separation of Concerns (SoC)**, **Single Responsibility Principle (SRP)**, dan **Zero Build-Tool Dependency** (tetap berjalan di browser modern tanpa Webpack/Vite bundler).

```
oprec_protic/
├── dist/
│   └── output.css              # Output Tailwind CSS ter-minify
├── img/                        # Aset gambar & ikon SVG divisi
├── script/
│   └── regist.gs               # Backend Google Apps Script (GAS) untuk Google Sheets
├── src/
│   ├── input.css               # Input source file Tailwind
│   └── js/
│       ├── config.js           # 🌟 SINGLE SOURCE OF TRUTH (URL API, Deadline, Kontak)
│       ├── components/
│       │   └── manage-modal.js # Komponen modal kelola & hapus data (dibagi oleh index & form)
│       ├── constants/
│       │   └── divisions.js    # 🌟 Kamus data divisi, ikon, deskripsi, & skill
│       ├── form/
│       │   ├── state.js        # State reaktif formulir & accessibility announcer
│       │   ├── toast.js        # Utilitas animasi notifikasi toast & undo
│       │   ├── division-ui.js  # Interaksi seleksi divisi (maks. 2) & preview ringkasan
│       │   ├── stepper.js      # Navigasi multi-step (1-2-3) & validasi field
│       │   ├── draft.js        # Auto-save & pemulihan draf via localStorage
│       │   ├── submit.js       # Modal konfirmasi & fetch POST ke Google Apps Script
│       │   └── main.js         # Entry point & bootstrapper siklus hidup halaman formulir
│       └── utils/
│           ├── security.js     # Hashing token HMAC sha256 session autentikasi
│           └── timer.js        # Countdown interval & format waktu penutupan
├── index.html                  # Landing page (Beranda)
├── form.html                   # Formulir pendaftaran calon pengurus
├── pengumuman.html             # Pengecekan hasil seleksi & pengumuman
├── success.html                # Halaman status: Diterima
├── denied.html                 # Halaman status: Belum Beruntung
├── thankyou.html               # Halaman konfirmasi setelah submit formulir
├── script.js                   # Interaktivitas beranda (scroll, splash, animasi)
└── package.json                # Skrip build CSS Tailwind
```

---

## ⚙️ 2. Cara Mengubah Konfigurasi Setiap Periode Baru

Anda **TIDAK PERLU** mengedit file HTML atau file logika sistem. Cukup buka satu file:
👉 **[`src/js/config.js`](file:///d:/exe/HERD/oprec_protic/src/js/config.js)**

```javascript
window.APP_CONFIG = {
  // 1. Ganti URL ini setelah deploy Web App Google Apps Script periode baru
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbw_.../exec",

  // 2. Ganti tanggal & jam penutupan pendaftaran (Format ISO: YYYY-MM-DDTHH:mm:ss+07:00)
  REGISTRATION_DEADLINE: "2027-09-18T00:00:00+07:00",

  // 3. Ganti salt keamanan untuk sesi pengumuman kelolosan
  SECURITY_SALT: "PROTIC_OPREC_2027_SECURITY_SALT_v1",

  // 4. Perbarui nomor WhatsApp panitia / admin oprec
  CONTACTS: {
    WA_ADMIN_1: "https://wa.me/6281234567890",
    INSTAGRAM: "https://instagram.com/proticpnc"
  }
};
```

---

## 👥 3. Cara Menambah, Mengubah, atau Menghapus Divisi

Jika kepengurusan baru menambah divisi baru (misal: *Cyber Security*) atau mengganti deskripsi tugas divisi:
👉 Buka berkas **[`src/js/constants/divisions.js`](file:///d:/exe/HERD/oprec_protic/src/js/constants/divisions.js)**

Tambahkan kunci divisi baru ke dalam objek:
```javascript
"CYBER": {
  name: "Cyber Security & Network",
  icon: "img/icon/security.svg",
  desc: "Pengamanan infrastruktur jaringan, audit penetrasi web, dan mitigasi ancaman siber.",
  skills: ["Network", "Linux", "Penetration Testing", "Security Audit"]
}
```
*Sistem kartu preview, validasi maksimal 2 divisi, dan penghitungan badge akan menyesuaikan secara otomatis!*

---

## 📝 4. Cara Menyesuaikan Syarat & Validasi Input Formulir

Jika divisi menginginkan aturan baru (misalnya NPM wajib 10 digit, portofolio boleh link Figma/GitHub selain Google Drive):
👉 Buka berkas **[`src/js/form/stepper.js`](file:///d:/exe/HERD/oprec_protic/src/js/form/stepper.js)**

Cari fungsi `validateStep(step)`:
- `step === 1`: Validasi biodata (NPM, Nama Lengkap, Kelas, Semester).
- `step === 2`: Validasi pilihan divisi (default: tepat 2 divisi).
- `step === 3`: Validasi link berkas/portofolio dan kontak WhatsApp/Email.

---

## 📊 5. Setup Google Sheets & Deploy Google Apps Script Baru

1. Buat **Google Spreadsheet** baru di Google Drive organisasi.
2. Buat header kolom di baris 1:
   `Timestamp | Full Name | NPM | Class | Semester | Division 1 | Division 2 | Portfolio URL | WhatsApp | Email | Status`
3. Klik **Extensions > Apps Script**.
4. Buka berkas lokal **[`script/regist.gs`](file:///d:/exe/HERD/oprec_protic/script/regist.gs)**, salin seluruh kodenya, lalu tempelkan ke editor Apps Script.
5. Klik **Deploy > New deployment**.
6. Pilih jenis **Web app**:
   - *Execute as*: **Me (akun Anda)**
   - *Who has access*: **Anyone** (Wajib agar pendaftar bisa submit tanpa login akun Google).
7. Klik **Deploy**, salin **Web App URL**, lalu tempelkan ke `SCRIPT_URL` di [`src/js/config.js`](file:///d:/exe/HERD/oprec_protic/src/js/config.js).

---

## 🎨 6. Compile Gaya Tampilan (Tailwind CSS)

Proyek ini menggunakan Tailwind CSS CLI mandiri (ringan, tanpa Vite/Webpack).
Jika Anda menambahkan class Tailwind baru di HTML atau JS:

```bash
# Jalankan kompilasi dan minify CSS sekali
npm run build:css

# Atau jalankan mode pengawasan otomatis saat sedang mendesain
npm run watch:css
```

---

## 🚀 7. Deployment ke Cloudflare Pages

Proyek ini terhubung langsung ke Git Repository.
1. Setiap kali Anda melakukan `git push origin main`, Cloudflare Pages akan otomatis mendeteksi perubahan dan melakukan deployment instan dalam ~30 detik.
2. Jika perlu deploy manual menggunakan Cloudflare Wrangler CLI:
   ```bash
   npx wrangler pages deploy . --project-name oprec-protic-26-v4
   ```

---
*Dipersiapkan dengan standar Clean Architecture untuk keberlanjutan UKM PROTIC Politeknik Negeri Cilacap.*
