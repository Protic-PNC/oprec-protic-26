# 🗺️ Roadmap Optimasi PROTIC Oprec
> Satu sesi = satu issue. Eksekusi berurutan, dependencies diperhitungkan.

**Konteks keputusan:**
- ⏳ Timeline: ~1 minggu
- 👥 Tim: 2–3 orang
- 🎨 Arsitektur CSS: **Migrasi semua ke Tailwind** (konsisten dengan halaman lain)
- 💡 Splash screen: **Tetap ada** tapi diperbaiki (bisa di-skip, animasi lebih baik)
- 🔒 U-20 sessionStorage: low priority (internal kampus)
- 📦 Granularitas: **satu issue = satu sesi**

---

## 🌿 Git Workflow & Delegasi Tim

### Prinsip utama: **1 sesi = 1 branch = 1 PR**

```bash
# Setiap mulai sesi baru:
git checkout main
git pull origin main
git checkout -b feat/sesi-01-meta-seo

# Selesai kerjakan:
git add .
git commit -m "fix(seo): perbaiki charset typo + tambah meta description"
git push origin feat/sesi-01-meta-seo
# → buat Pull Request di GitHub → minta review → merge ke main
```

### ⚠️ Sesi yang WAJIB selesai dulu (sebelum paralel)
Sesi berikut menyentuh SEMUA file. **Harus diselesaikan satu per satu oleh satu orang** sebelum orang lain mulai, agar tidak ada konflik:

| Urutan | Sesi | Alasan |
|---|---|---|
| 🥇 Pertama | **Sesi 01** (P-10) | Edit meta/charset di semua 6 file HTML |
| 🥈 Kedua | **Sesi 03** (P-09) | Tambah favicon tag di semua 6 file HTML |
| 🥉 Ketiga | **Sesi 08** (P-03) | Ganti URL S3 → lokal di semua file HTML |

Setelah 3 sesi ini selesai dan sudah di-merge ke `main`, baru boleh paralel.

### 👥 Pembagian Kepemilikan File

| Orang | File yang Dimiliki | Tanggung Jawab |
|---|---|---|
| **🅐 Lead** | `index.html`, `index.css`, `script.js` | Landing page, splash, layout desktop |
| **🅑 Form Dev** | `form.html`, `form.css` | Semua UX form pendaftaran |
| **🅒 Result Dev** | `success.html`, `denied.html`, `pengumuman.html`, `thankyou.html`, `thankyou.css` | Halaman hasil + polish |

> Kalau satu sesi menyentuh file milik orang lain, **koordinasikan dulu** sebelum mulai.

### 📋 Delegasi per Sesi

| Sesi | ID | PIC | File Utama | Boleh Paralel? |
|---|---|---|---|---|
| 01 | P-10 | 🅐 Lead | Semua HTML | ❌ Harus selesai duluan |
| 02 | P-05 | 🅐 Lead | `index.html`, `form.html`, `thankyou.html` | ✅ Setelah sesi 01–03–08 |
| 03 | P-09 | 🅐 Lead | Semua HTML | ❌ Harus selesai duluan |
| 04 | P-11 | 🅒 Result Dev | CSS files | ✅ Setelah sesi 01 |
| 05 | P-01 | 🅑 Form Dev | `img/fotbar.webp` (aset saja) | ✅ Kapan saja |
| 06 | P-04 | 🅐 Lead | `index.html`, `form.html` | ✅ Setelah sesi 01–03–08 |
| 07 | P-08 | 🅐 Lead | `index.html` | ✅ Setelah sesi 08 |
| 08 | P-03 | 🅐 Lead | Semua HTML + `img/icons/` | ❌ Harus selesai duluan |
| 09 | U-09/U-14 | 🅑 Form Dev | `form.html`, `pengumuman.html` | ✅ Setelah sesi 01–03–08 |
| 10 | U-13 | 🅒 Result Dev | `thankyou.html` | ✅ Setelah sesi 01–03–08 |
| 11 | U-05 | 🅑 Form Dev | `form.html` | ✅ |
| 12 | U-07 | 🅒 Result Dev | `success.html` | ✅ |
| 13 | U-03 | 🅑 Form Dev | `form.html` | ✅ Setelah sesi 11 |
| 14 | U-06 | 🅑 Form Dev | `form.html`, `form.css` | ✅ Setelah sesi 13 |
| 15 | U-08 | 🅑 Form Dev | `form.html` | ✅ Setelah sesi 13 |
| 16 | U-18 | 🅑 Form Dev | `form.css` | ✅ |
| 17 | U-10 | 🅑 Form Dev | `form.css` | ✅ |
| 18 | U-11 | 🅑 Form Dev | `form.html` | ✅ Setelah sesi 13 |
| 19 | U-16 | 🅑 Form Dev | `form.css` | ✅ |
| 20 | U-15 | 🅒 Result Dev | `index.css`, `thankyou.css` | ✅ |
| 21 | P-02/U-01 | 🅐 Lead | `index.html`, `index.css`, `script.js` | ✅ |
| 22 | U-02 | 🅐 Lead | `index.css` | ✅ Setelah sesi 21 |
| 23 | U-04 | 🅒 Result Dev | Semua HTML (edit minimal) | ✅ Koordinasi dulu |
| 24 | U-17 | 🅑 Form Dev | `form.html` | ✅ Setelah sesi 13 |
| 25 | U-12 | 🅐 Lead | `index.html`, `form.html`, `thankyou.html` | ✅ Koordinasi B & C |
| 26 | P-06/P-07 | 🅐 Lead + Semua | Semua file | ❌ Koordinasi penuh tim |
| 27 | U-19 | 🅐 Lead | `script.js` | ✅ |
| 28 | U-20 | 🅒 Result Dev | `success.html`, `denied.html`, `pengumuman.html` | ✅ |

---

## 📋 Status Keseluruhan

| Sesi | ID | Judul | PIC | Status |
|---|---|---|---|---|
| 01 | P-10 | Perbaiki charset typo + tambah meta SEO | 🅐 | ✅ Selesai |
| 02 | P-05 | Tambah `width` & `height` pada semua `<img>` | 🅐 | ✅ Selesai |
| 03 | P-09 | Tambah favicon | 🅐 | ✅ Selesai |
| 04 | P-11 | Sediakan font Dungeon (diganti Google Fonts Cinzel) | 🅒 | ✅ Selesai |
| 05 | P-01 | Compress & resize `fotbar.webp` (<300KB) | 🅑 | ✅ Selesai (108 KB) |
| 06 | P-04 | Tambah `<link rel="preload">` untuk aset kritis | 🅐 | ✅ Selesai |
| 07 | P-08 | Tambah `loading="lazy"` pada gambar non-kritis | 🅐 | ✅ Selesai |
| 08 | P-03 | Unduh & host lokal semua ikon dari S3 Codia | 🅐 | ✅ Selesai |
| 09 | U-09/U-14 | Fix typo "Portofoliov" + label NPM salah | 🅑 | ✅ Selesai |
| 10 | U-13 | Fix HTML tidak valid (`</body>` hilang) | 🅒 | ✅ Selesai |
| 11 | U-05 | Ganti `type="number"` → `type="tel"` / `type="text"` | 🅑 | ✅ Selesai |
| 12 | U-07 | Fix fallback HTML `{{ $divisi }}` di success.html | 🅒 | ✅ Selesai |
| 13 | U-03 | Ganti semua `alert()` → inline error message | 🅑 | ✅ Selesai |
| 14 | U-06 | Tambah counter divisi terpilih ("1/2 dipilih") | 🅑 | ✅ Selesai |
| 15 | U-08 | Perbaiki error handling form submission | 🅑 | ✅ Selesai |
| 16 | U-18 | Tambah CSS error state pada input form | 🅑 | ✅ Selesai |
| 17 | U-10 | Fix ukuran font terlalu kecil di form.css | 🅑 | ✅ Selesai |
| 18 | U-11 | Tambah `aria-live` region | 🅑 | ✅ Selesai |
| 19 | U-16 | Audit & perbaiki kontras warna (WCAG AA) | 🅑 | ✅ Selesai |
| 20 | U-15 | Tambah hover effect ikon sosial media | 🅒 | ✅ Selesai |
| 21 | P-02/U-01 | Perbaiki splash screen (skip + delay lebih pendek) | 🅐 | ✅ Selesai |
| 22 | U-02 | Perbaiki layout desktop (2-kolom) | 🅐 | ✅ Selesai |
| 23 | U-04 | Tambah navigasi / tombol kembali antar halaman | 🅒 | ✅ Selesai |
| 24 | U-17 | Tambah modal konfirmasi sebelum submit form | 🅑 | ✅ Selesai |
| 25 | U-12 | Fix Tailwind classes di halaman non-Tailwind | 🅐 | ✅ Selesai |
| 26 | P-06/P-07 | Migrasi CSS → unifikasi semua halaman ke Tailwind | 🅐+Semua | ✅ Selesai |
| 27 | U-19 | Hapus dead code division selection di script.js | 🅐 | ✅ Selesai |
| 28 | U-20 | Hardening sessionStorage | 🅒 | ✅ Selesai |

---

## 🔴 FASE 1 — Fondasi & HTML Benar (Sesi 01–04)
> **Mengapa duluan:** Perbaikan paling kecil dan tidak berisiko. Wajib selesai sebelum optimasi apapun.

### Sesi 01 — `P-10` Fix Charset + Meta SEO
**File:** `index.html`, `form.html`, `thankyou.html`, `success.html`, `denied.html`, `pengumuman.html`

**Yang dilakukan:**
- [x] Fix `charset="UTF--8"` → `charset="UTF-8"` di `index.html` baris 4
- [x] Tambah `<meta name="description">` di semua halaman
- [x] Tambah Open Graph tags (`og:title`, `og:description`, `og:image`) di `index.html`
- [x] Tambah `<title>` yang deskriptif dan unik di setiap halaman

**Estimasi:** 15 menit

---

### Sesi 02 — `P-05` Tambah `width` & `height` pada Semua `<img>`
**File:** `index.html`, `form.html`, `thankyou.html`

**Yang dilakukan:**
- [x] Tambah atribut `width` dan `height` pada semua tag `<img>` yang belum punya
- [x] Prioritas: `img/Protic.png`, `img/header.png`, `img/fotbar.webp`
- [x] Ini mencegah CLS (layout shift) saat gambar dimuat

**Estimasi:** 20 menit

---

### Sesi 03 — `P-09` Tambah Favicon
**File:** `index.html`, `form.html`, `thankyou.html`, `success.html`, `denied.html`, `pengumuman.html`

**Yang dilakukan:**
- [x] Generate favicon dari `img/Protic.png`
- [x] Tambah `<link rel="icon" href="img/favicon.ico">` di semua halaman
- [x] Opsional: tambah apple-touch-icon untuk iOS

**Estimasi:** 10 menit

---

### Sesi 04 — `P-11` Sediakan Font Dungeon
**File:** `index.css`, `form.css`, `thankyou.css`

**Yang dilakukan:**
- [x] Cari font Dungeon yang tersedia secara bebas
- [x] Tambah `@font-face` declaration dengan file lokal, atau
- [x] Ganti dengan alternatif dari Google Fonts (misal `Cinzel` — vibe serupa)
- [x] Verifikasi heading "PROTIC" tampil dengan font yang benar

**Estimasi:** 20 menit

---

## 🟠 FASE 2 — Performa Aset (Sesi 05–08)
> **Mengapa setelah Fase 1:** HTML sudah valid dulu, baru optimasi asset loading. Urutan P-01 → P-04 → P-08 → P-03 mengikuti dependency logis.

### Sesi 05 — `P-01` Compress & Resize `fotbar.webp`
**File:** `img/fotbar.webp` (3.29 MB → target <300 KB)

**Yang dilakukan:**
- [x] Resize ke max-width 1000px (container max 500px, 2x retina = cukup)
- [x] Re-export ke WebP dengan kualitas 75–80%
- [x] Update path gambar jika diganti nama
- [x] Verifikasi tidak terlalu blur

**Tools yang dipakai:** Script Python (Pillow) atau sharp (Node.js)
**Estimasi:** 15 menit

---

### Sesi 06 — `P-04` Tambah `<link rel="preload">`
**File:** `index.html`, `form.html`

**Yang dilakukan:**
- [x] Tambah `<link rel="preload" as="image" href="img/fotbar.webp">` di `index.html`
- [x] Tambah `<link rel="preload" as="image" href="img/header.png">` di `index.html` dan `form.html`
- [x] Pastikan urutan di `<head>` benar (preload sebelum stylesheet)

**Estimasi:** 10 menit

---

### Sesi 07 — `P-08` Tambah `loading="lazy"` pada Gambar Non-Kritis
**File:** `index.html`, `form.html`

**Yang dilakukan:**
- [x] Tambah `loading="lazy"` pada semua ikon divisi (gambar dari S3)
- [x] Tambah `loading="lazy"` pada logo footer
- [x] **JANGAN** tambahkan ke `fotbar.webp`, `header.png`, `Protic.png` (above-the-fold/LCP)

**Estimasi:** 10 menit

---

### Sesi 08 — `P-03` Download & Host Lokal Semua Ikon dari S3 Codia
**File:** `index.html`, `form.html`, `success.html`, `denied.html`, `pengumuman.html`, `thankyou.html`

**Yang dilakukan:**
- [x] Download semua ~15 SVG/PNG dari `codia-f2c.s3.us-west-1.amazonaws.com`
- [x] Simpan ke `img/icons/` dengan nama meaningful (`web.svg`, `uiux.svg`, dst.)
- [x] Update semua referensi URL di semua halaman ke path lokal
- [x] Verifikasi semua ikon tampil dengan benar

**Estimasi:** 30 menit

---

## 🟡 FASE 3 — Form UX & Copy (Sesi 09–16)
> **Inti situs.** Aset sudah beres, sekarang pastikan experience mengisi form sudah sempurna.

### Sesi 09 — `U-09` + `U-14` Fix Copy & Label Salah
**File:** `form.html`, `pengumuman.html`

**Yang dilakukan:**
- [x] Fix typo `"Portofoliov"` → `"Portofolio / CV"` di `form.html` baris 164
- [x] Fix `id="fullname"` → `id="npm"` pada input NPM di `pengumuman.html`
- [x] Update `name="fullname"` → `name="npm"` dan label `for`-nya

**Estimasi:** 5 menit

---

### Sesi 10 — `U-13` Fix HTML Tidak Valid
**File:** `thankyou.html`

**Yang dilakukan:**
- [x] Tambah tag `</body>` yang hilang sebelum `</html>` di baris 69
- [x] Verifikasi struktur HTML lengkap dan valid

**Estimasi:** 5 menit

---

### Sesi 11 — `U-05` Ganti `type="number"` untuk HP dan NPM
**File:** `form.html`

**Yang dilakukan:**
- [x] NPM: `type="number"` → `type="text"` + `inputmode="numeric"` + `pattern="[0-9]+"`
- [x] WhatsApp: `type="number"` → `type="tel"` + `placeholder="08xxxxxxxxx"`
- [x] Semester: boleh tetap `type="number"` (memang angka)
- [x] Tambah `autocomplete` attribute yang relevan

**Estimasi:** 10 menit

---

### Sesi 12 — `U-07` Fix Fallback HTML di `success.html`
**File:** `success.html`

**Yang dilakukan:**
- [x] Ganti `Divisi {{ $divisi }}` → `Divisi -` sebagai nilai default di HTML
- [x] Ganti placeholder `Nama` statis → nilai default bermakna (misal `—`)
- [x] Pastikan JavaScript masih menimpa nilai ini dengan benar saat data ada

**Estimasi:** 10 menit

---

### Sesi 13 — `U-03` Ganti Semua `alert()` → Inline Error Message
**File:** `form.html` (inline script)

**Yang dilakukan:**
- [x] Hapus semua `alert()` untuk validasi divisi
- [x] Buat elemen pesan error inline di bawah `.division-grid`
- [x] Tampilkan pesan error merah saat divisi < 2 atau > 2 saat submit
- [x] Selaraskan teks pesan di semua tempat (satu sumber kebenaran)
- [x] Pastikan juga tidak ada `alert()` di tempat lain selain error submission

**Estimasi:** 20 menit

---

### Sesi 14 — `U-06` Tambah Counter Divisi Terpilih
**File:** `form.html`, `form.css`

**Yang dilakukan:**
- [x] Tambah badge/counter di atas grid divisi: `"0 / 2 dipilih"`
- [x] Update counter setiap kali divisi dipilih/dibatalkan
- [x] Visual berbeda saat sudah mencapai 2 (badge hijau)
- [x] Disable tombol divisi lain saat sudah 2 terpilih (preventif, bukan reaktif)

**Estimasi:** 25 menit

---

### Sesi 15 — `U-08` Perbaiki Error Handling Form Submission
**File:** `form.html` (inline script)

**Yang dilakukan:**
- [x] Ganti `alert()` error submission → pesan error inline di atas tombol Submit
- [x] Tambah petunjuk langkah selanjutnya: "Cek koneksi dan coba lagi. Masalah berlanjut? Hubungi panitia."
- [x] Tampilkan pesan error dibersihkan saat submit berhasil/retry

**Estimasi:** 15 menit

---

### Sesi 16 — `U-18` Tambah CSS Error State pada Input
**File:** `form.css`

**Yang dilakukan:**
- [x] Tambah styling `.form-input:user-invalid` (border merah, setelah interaksi)
- [x] Tambah helper text/pesan error di bawah field wajib
- [x] Tambah indikator `*` (asterisk) merah untuk field wajib

**Estimasi:** 20 menit

---

## 🟢 FASE 4 — Aksesibilitas & Visual Polish (Sesi 17–20)

### Sesi 17 — `U-10` Fix Ukuran Font di `form.css`
**File:** `form.css`

**Yang dilakukan:**
- [x] `--font-xs: 7px` → `12px`
- [x] `--font-sm: 8px` → `13px`
- [x] `--font-md: 10px` → `14px`
- [x] `--font-base: 11px` → `15px`
- [x] Target minimum: body text ≥ 14px, label kecil ≥ 12px
- [x] Verifikasi tidak ada teks di bawah 12px di form

**Estimasi:** 15 menit

---

### Sesi 18 — `U-11` Tambah `aria-live` Region
**File:** `form.html`

**Yang dilakukan:**
- [x] Tambah `<div aria-live="polite" id="form-announcer" class="sr-only"></div>`
- [x] Update JS untuk mengisi announcer saat divisi dipilih/dibatalkan
- [x] Update saat loading dan error submission
- [x] Tambah `aria-label` pada tombol divisi

**Estimasi:** 20 menit

---

### Sesi 19 — `U-16` Audit Kontras Warna WCAG AA
**File:** `form.css`, `form.html`

**Yang dilakukan:**
- [x] Audit kontras tombol divisi vs background (target ≥ 4.5:1 untuk teks normal)
- [x] Audit teks putih di atas background hijau gelap
- [x] Fix warna yang tidak memenuhi standar WCAG AA
- [x] Verifikasi via perhitungan kontras WCAG AA/AAA

**Estimasi:** 25 menit

---

### Sesi 20 — `U-15` Hover Effect Ikon Sosial Media
**File:** `index.css`, `form.css`, `thankyou.css`

**Yang dilakukan:**
- [x] Tambah hover effect pada link sosial (opacity 0.7, scale 1.1, atau filter brightness)
- [x] Transisi smooth `0.2s ease`
- [x] Tambah `:focus-visible` state untuk keyboard navigation

**Estimasi:** 10 menit

---

## 🔵 FASE 5 — UI & Layout Besar (Sesi 21–24)
> Perubahan layout paling berisiko. Dilakukan setelah semua perbaikan kecil final.

### Sesi 21 — `P-02` + `U-01` Perbaiki Splash Screen
**File:** `index.html`, `index.css`, `script.js`

**Yang dilakukan:**
- [x] Kurangi durasi: 2500ms → 1500ms
- [x] Tambah tombol "Skip →" yang muncul setelah 500ms
- [x] Tambah `@media (prefers-reduced-motion: reduce)` — langsung skip
- [x] Tambah loading progress bar tipis di bawah logo

**Estimasi:** 30 menit

---

### Sesi 22 — `U-02` Perbaiki Layout Desktop (2-kolom)
**File:** `index.css`

**Yang dilakukan:**
- [x] Update `@media (min-width: 1024px)` untuk `.intro-section`:
  - `flex-direction: row` (teks kiri, gambar+kartu kanan)
- [x] Update `.divisions-container`:
  - `flex-direction: row` (Technical | Non-Technical berdampingan)
- [x] Verifikasi di 1280px, 1440px, 1920px

**Estimasi:** 30 menit

---

### Sesi 23 — `U-04` Tambah Navigasi antar Halaman
**File:** `form.html`, `thankyou.html`, `success.html`, `denied.html`, `pengumuman.html`

**Yang dilakukan:**
- [x] Tambah tombol "← Kembali ke Beranda" di `form.html` dan `pengumuman.html`
- [x] Tambah navigasi yang jelas di `denied.html` (selain "Join Community")
- [x] Verifikasi semua halaman punya jalur keluar yang jelas

**Estimasi:** 20 menit

---

### Sesi 24 — `U-17` Modal Konfirmasi Sebelum Submit
**File:** `form.html`, `form.css`

**Yang dilakukan:**
- [x] Buat `<dialog>` native HTML untuk modal konfirmasi
- [x] Tampilkan ringkasan: nama, NPM, 2 divisi pilihan
- [x] Tombol "Batalkan" dan "Kirim Sekarang"
- [x] Pastikan accessible (focus trap, Escape untuk tutup)

**Estimasi:** 30 menit

---

## ⚡ FASE 6 — Migrasi CSS ke Tailwind (Sesi 25–27)
> **PALING BERISIKO.** Lakukan paling terakhir setelah semua fix lain sudah final dan terverifikasi.

### Sesi 25 — `U-12` Quick Fix Tailwind Classes (Sementara)
**File:** `index.html`, `form.html`, `thankyou.html`

**Yang dilakukan:**
- [x] Ganti `<div class="flex flex-row md:flex-col gap-2">` → `.footer-social` class yang sudah ada di CSS
- [x] Ganti `class="w-[20px] h-[20px]"` → inline style atau class di file CSS masing-masing

**Estimasi:** 15 menit

---

### Sesi 26 — `P-06` + `P-07` Migrasi Penuh ke Tailwind (Dipecah per Sub-Sesi)
**File:** `index.html`, `index.css`, `form.html`, `form.css`, `thankyou.html`, `thankyou.css`, `pengumuman.html`, `success.html`, `denied.html`

> ⚠️ Dipecah menjadi 4 sub-sesi bertahap untuk meminimalkan risiko regresi dan memastikan verifikasi visual per halaman:

#### Sesi 26A — Setup Tooling Tailwind CLI v3 & Eliminasi CDN (`P-06`)
- [x] Inisialisasi `package.json` dan install `tailwindcss@^3` lokal
- [x] Buat `tailwind.config.js` dengan menyatukan seluruh design tokens (warna, shadow, radius, font)
- [x] Buat `src/input.css` dan setup script npm `"build:css"`
- [x] Compile ke `dist/output.css` dan ganti tag CDN di `pengumuman.html`, `success.html`, `denied.html`
- [x] Verifikasi 3 halaman hasil bebas dari CDN runtime compiler

#### Sesi 26B — Migrasi `thankyou.html`
- [x] Migrasi layout kartu & footer `thankyou.html` ke utility class Tailwind
- [x] Verifikasi tampilan di browser
- [x] Hapus/deprecate `thankyou.css`

#### Sesi 26C — Migrasi `index.html`
- [x] Migrasi landing page, hero, splash progress, dan 2-kolom desktop ke Tailwind
- [x] Verifikasi animasi dan responsive breakpoints
- [x] Hapus/deprecate `index.css`

#### Sesi 26D — Migrasi `form.html`
- [x] Migrasi formulir pendaftaran, floating validation, dan dialog modal ke Tailwind
- [x] Verifikasi interaktivitas form dan error states
- [x] Hapus/deprecate `form.css`

**Estimasi Total:** 2–3 jam

---

### Sesi 27 — `U-19` Hapus Dead Code di `script.js`
**File:** `script.js`

**Yang dilakukan:**
- [x] Hapus baris 74–115 (division selection logic — tidak pernah dieksekusi di `form.html`)
- [x] Verifikasi `index.html` masih berfungsi normal
- [x] Verifikasi `form.html` masih berfungsi normal (inline script-nya independen)

**Estimasi:** 10 menit

---

## 🔒 FASE 7 — Keamanan (Sesi 28) — Low Priority

### Sesi 28 — `U-20` Hardening sessionStorage
**File:** `success.html`, `denied.html`, `pengumuman.html`

**Yang dilakukan:**
- [x] Tambah timestamp/token ke sessionStorage saat data diset di `pengumuman.html`
- [x] Validasi token di `success.html` dan `denied.html`

**Estimasi:** 20 menit

---

## 📊 Ringkasan per Fase

| Fase | Sesi | Estimasi | Risiko |
|---|---|---|---|
| 1 — Fondasi HTML | 01–04 | ~1 jam | 🟢 Rendah |
| 2 — Performa Aset | 05–08 | ~1.5 jam | 🟡 Sedang |
| 3 — Form UX & Copy | 09–16 | ~2 jam | 🟡 Sedang |
| 4 — Aksesibilitas & Polish | 17–20 | ~1.5 jam | 🟢 Rendah |
| 5 — Layout & UI Besar | 21–24 | ~2 jam | 🟠 Tinggi |
| 6 — Migrasi Tailwind | 25–27 | ~3.5 jam | 🔴 Kritis |
| 7 — Keamanan | 28 | ~30 menit | 🟢 Rendah |
| **Total** | **28 sesi** | **~12 jam** | — |

---

## 🚀 Cara Pakai Roadmap Ini

Untuk setiap sesi, cukup katakan:
> **"Kerjakan Sesi [nomor] — [ID]"**

Contoh: `"Kerjakan Sesi 01 — P-10"`

Aku akan baca konteks sesi dari roadmap ini, eksekusi dengan presisi, verifikasi hasilnya, dan update status (⬜ → ✅).

---

> ⚡ Roadmap ini mengacu pada 31 temuan di `analisis_kekurangan.md`
> Diperbarui: 2026-09-10
