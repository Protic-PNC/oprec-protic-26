# 🚀 Website Open Recruitment PROTIC (PNC)

Website resmi pendaftaran dan pengumuman seleksi calon pengurus **PROTIC (Programming Technology Informatics Club) Politeknik Negeri Cilacap**. Sistem ini mengelola alur mulai dari pengenalan organisasi, pengisian formulir biodata & pilihan divisi, konfirmasi ringkasan data, hingga pengumuman kelolosan peserta secara terintegrasi dengan Google Sheets. 

---

## 🛠️ Teknologi & Dependencies

Proyek ini dibangun menggunakan arsitektur web modern yang ringan, cepat, dan mudah dipelihara tanpa framework frontend yang membengkak (*no bloated framework*):

- **Core Frontend**: HTML5 Semantic, Vanilla JavaScript (ES6+).
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) via Tailwind CLI (kompilasi lokal ke file minified tunggal `dist/output.css` berukuran hanya ~32 KB).
- **Tipografi & Ikon**: Google Fonts (*Cinzel* & *Poppins*), SVG Icons lokal (bebas dependensi eksternal).
- **Backend & Database**: Serverless via **Google Apps Script (GAS)** terhubung langsung ke **Google Spreadsheet**.
- **Aksesibilitas & Keamanan**:
  - Standar WCAG 2.1 AA (kontras warna teruji, ramah pembaca layar dengan `aria-live`).
  - Dialog modal native `<dialog>` untuk konfirmasi data pendaftar.
  - *Cryptographic integrity token* & *Time-To-Live (TTL)* pada `sessionStorage` untuk melindungi kontak WhatsApp pengurus dari akses ilegal.

---

## 📂 Struktur Direktori

```text
oprec_protic/
├── dist/
│   └── output.css            # File CSS produksi yang terkompilasi & terminifikasi (~32 KB)
├── img/
│   ├── icon/                 # Asset ikon divisi & sosial media (SVG lokal)
│   ├── favicon.ico           # Favicon multi-ukuran
│   ├── fotbar.webp           # Foto komunitas terkompresi (<110 KB)
│   ├── header.png            # Header banner resmi PROTIC
│   └── Protic.png            # Logo resmi PROTIC
├── script/
│   ├── regist.gs             # Backend Google Apps Script untuk penampung formulir pendaftaran
│   └── pengumuman.gs         # Backend Google Apps Script untuk pengecekan kelolosan via NPM
├── src/
│   └── input.css             # Source CSS utama (@tailwind directives + custom @layer components)
├── denied.html               # Halaman bagi peserta yang belum lolos seleksi
├── form.html                 # Halaman formulir pendaftaran interaktif (kuota 2 divisi + modal)
├── index.html                # Landing page utama (hero, splash screen, profil, divisi)
├── package.json              # Konfigurasi dependensi npm & build script Tailwind
├── pengumuman.html           # Halaman pencarian status kelolosan via input NPM
├── roadmap_optimasi.md       # Rekam jejak seluruh 28 sesi optimasi & audit performa
├── script.js                 # Script interaksi landing page (splash, smooth scroll, fader)
├── success.html              # Halaman bagi peserta yang lolos seleksi + link grup WhatsApp divisi
├── tailwind.config.js        # Konfigurasi design tokens (warna protic, shadow, fonts)
├── thankyou.html             # Halaman konfirmasi setelah formulir berhasil dikirim
├── README.md                 # Panduan umum & quickstart proyek
└── DOKUMENTASI_TEKNIS.md     # Panduan teknis mendalam & handover untuk pengurus periode berikutnya
```

---

## ⚡ Quick Start (Pengembangan Lokal)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
- Web browser modern (Chrome, Edge, Firefox, atau Safari).
- Text Editor (VS Code / Antigravity IDE disarankan).

### 2. Instalasi Dependensi
Clone atau buka direktori proyek di terminal, lalu jalankan:
```bash
npm install
```

### 3. Menjalankan Kompilasi CSS
- **Mode Development (Auto Watch)**:
  Kompilasi otomatis setiap kali ada perubahan class HTML:
  ```bash
  npm run watch:css
  ```
- **Mode Production (Minified Build)**:
  Menghasilkan bundle CSS produksi yang paling ringkas:
  ```bash
  npm run build:css
  ```

### 4. Menjalankan Halaman di Browser
Karena proyek ini berbasis file web statis, Anda dapat langsung membuka `index.html` menggunakan fitur **Live Server** di VS Code atau membuka langsung file `.html` di browser Anda.

---

## 🔄 Alur Navigasi Halaman (User Journey)

```text
[ index.html ]  ──(Klik Daftar)──>  [ form.html ]
                                          │
                               (Isi Data + Pilih 2 Divisi)
                                          │
                               [ Modal Konfirmasi Native ]
                                          │
                                 (Kirim ke Google Sheets)
                                          │
                                          ▼
                                  [ thankyou.html ]
                                (Join Komunitas Umum)

============================================================

[ pengumuman.html ] ──(Input NPM)──> (Cek Status di Google Sheets)
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
               [ success.html ]                                 [ denied.html ]
        (Diterima: Link WA Koordinator)                   (Belum Lolos: Semangat & Komunitas)
```

---

## 🚢 Panduan Singkat Deployment (Server Politeknik)

Website ini di-hosting pada web server milik Politeknik Negeri Cilacap (`oprec.protic.web.id`). Untuk mengunggah pembaruan:

1. **Jalankan Build Terakhir**:
   ```bash
   npm run build:css
   ```
2. **File yang Wajib Diunggah ke Server (`public_html` / `htdocs`)**:
   - Seluruh file `.html` (`index.html`, `form.html`, `pengumuman.html`, `success.html`, `denied.html`, `thankyou.html`).
   - Folder `dist/` (khususnya `dist/output.css`).
   - Folder `img/` (seluruh aset gambar & ikon).
   - File `script.js` dan `favicon.ico`.
3. **File yang TIDAK Perlu Diunggah ke Server Produksi**:
   - Folder `node_modules/` dan `.git/`.
   - File `src/input.css`, `package.json`, `package-lock.json`, `tailwind.config.js`.

---

## 📖 Dokumentasi Lanjutan & Handover

Untuk pengurus yang ingin:
- Mengganti tahun periode (misal 2026/2027 ke 2027/2028).
- Mengganti spreadsheet dan men-deploy ulang Google Apps Script.
- Menambah/mengubah divisi dan kontak WhatsApp koordinator.
- Memahami sistem keamanan token integritas `sessionStorage`.
- Troubleshooting kendala teknis (CORS, caching, data tidak masuk).

👉 **Silakan baca panduan lengkap di: [DOKUMENTASI_TEKNIS.md](DOKUMENTASI_TEKNIS.md)**.

---

## 👥 Kontributor & Pengelola
- **Organisasi**: PROTIC (Programming Technology Informatics Club)
- **Institusi**: Politeknik Negeri Cilacap
- **Website Utama**: [protic.web.id](https://protic.web.id)
- **Repository Oprec**: Open Recruitment System
