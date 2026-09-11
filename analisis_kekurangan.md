# 🔍 Analisis Kekurangan Proyek PROTIC Oprec
> Audit mendalam terhadap performa, UI/UX, aksesibilitas, dan best practice web

---

## Ringkasan Halaman yang Dianalisis

| Halaman | File | Teknologi |
|---|---|---|
| Landing Page | `index.html` + `index.css` + `script.js` | Vanilla CSS |
| Form Pendaftaran | `form.html` + `form.css` | Vanilla CSS + inline JS |
| Terima Kasih | `thankyou.html` + `thankyou.css` | Vanilla CSS |
| Pengumuman | `pengumuman.html` | Tailwind CDN |
| Lolos | `success.html` | Tailwind CDN |
| Ditolak | `denied.html` | Tailwind CDN |

---

## 🔴 KEKURANGAN PERFORMA

---

### P-01 — Gambar Hero (`fotbar.webp`) Berukuran Sangat Besar

**Tingkat keparahan:** 🔴 Kritis

**File terdampak:** [`index.html`](file:///d:/exe/HERD/oprec_protic/index.html#L50), aset `img/fotbar.webp`

**Deskripsi:**
File `fotbar.webp` berukuran **3.29 MB** (3.291.226 bytes). Ini adalah aset gambar terbesar di proyek dan merupakan penyebab utama LCP (Largest Contentful Paint) yang buruk. Walaupun sudah menggunakan format WebP, ukurannya masih sangat besar untuk gambar yang ditampilkan dalam container dengan `max-width: 500px` dan `aspect-ratio: 16/9`.

**Dampak:**
- LCP > 4 detik di koneksi mobile (3G/4G tipikal)
- Google PageSpeed score merah untuk mobile
- Bounce rate tinggi karena gambar utama lambat muncul

---

### P-02 — Splash Screen 2.5 Detik Wajib (Memblokir Konten)

**Tingkat keparahan:** 🔴 Kritis

**File terdampak:** [`script.js`](file:///d:/exe/HERD/oprec_protic/script.js#L56-L72)

**Deskripsi:**
Splash screen dikunci selama **2.500ms (2,5 detik)** menggunakan `setTimeout` sebelum konten utama ditampilkan. Pengguna yang sudah mengetahui situs ini atau mengunjungi ulang tetap *dipaksa* menunggu 2,5 detik setiap kali membuka halaman. Ini bertentangan langsung dengan metrik **FCP (First Contentful Paint)** dan **TTI (Time to Interactive)** yang menjadi standar web modern.

```javascript
// script.js baris 70 — hardcoded 2.5 detik
setTimeout(() => { ... }, 2500);
```

**Dampak:**
- FCP tertunda 2,5 detik secara sengaja
- TTI buruk di semua perangkat
- Pengalaman pengguna kembali yang sangat buruk

---

### P-03 — Aset Gambar Dimuat dari CDN Pihak Ketiga yang Tidak Dikelola

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`index.html`](file:///d:/exe/HERD/oprec_protic/index.html#L91-L269), [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L85-L141), `success.html`, `denied.html`, `pengumuman.html`, `thankyou.html`

**Deskripsi:**
Hampir semua ikon (divisi, footer logo, social media) dimuat dari domain `codia-f2c.s3.us-west-1.amazonaws.com`. Ini adalah bucket S3 milik pihak ketiga (platform Codia), bukan aset yang dikontrol sendiri. Ini menyebabkan:
- Latensi tambahan dari request ke domain berbeda (DNS lookup baru)
- Tidak ada jaminan ketersediaan — jika Codia atau bucket S3 mereka down, semua ikon di situs akan hilang
- Tidak ada caching kontrol dari sisi developer
- Setidaknya **15–20 HTTP request eksternal** hanya untuk ikon

**Contoh URL:**
```
https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-08/5uFCUuNzBu.svg
```

---

### P-04 — Tidak Ada Preload untuk Aset Kritis (LCP Asset)

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`index.html`](file:///d:/exe/HERD/oprec_protic/index.html#L1-L14), [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L1-L8)

**Deskripsi:**
Tidak ada satupun tag `<link rel="preload">` untuk aset kritis:
- `img/header.png` (gambar header yang muncul di setiap halaman)
- `img/fotbar.webp` (gambar LCP utama)
- `img/Protic.png` (logo splash screen)
- Font Poppins dimuat dengan `<link rel="stylesheet">` biasa, bukan dipreload

Tanpa preload, browser harus memparse HTML, menemukan gambar, lalu baru memulai download — menciptakan *waterfall* yang tidak efisien.

---

### P-05 — Gambar Tanpa Atribut `width` dan `height` (Menyebabkan CLS)

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`index.html`](file:///d:/exe/HERD/oprec_protic/index.html#L18-L30), [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L12)

**Deskripsi:**
Hampir semua tag `<img>` tidak memiliki atribut `width` dan `height` eksplisit:
```html
<!-- index.html baris 18 — tanpa width/height -->
<img src="img/Protic.png" alt="PROTIC Hero" />

<!-- index.html baris 30 — tanpa width/height -->
<img src="img/header.png" alt="PROTIC Header" class="header-image" />
```
Tanpa atribut ini, browser tidak dapat mereservasi ruang untuk gambar sebelum dimuat, menyebabkan **Cumulative Layout Shift (CLS)** — konten bergeser saat gambar tiba-tiba muncul. Ini adalah salah satu metrik Core Web Vitals yang paling berdampak pada SEO.

---

### P-06 — Tailwind CSS Dimuat via CDN di 3 Halaman (Runtime Compilation)

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`success.html`](file:///d:/exe/HERD/oprec_protic/success.html#L18), [`denied.html`](file:///d:/exe/HERD/oprec_protic/denied.html#L22), [`pengumuman.html`](file:///d:/exe/HERD/oprec_protic/pengumuman.html#L18)

**Deskripsi:**
```html
<script src="https://cdn.tailwindcss.com"></script>
```
CDN Tailwind mengunduh **seluruh library Tailwind (~110KB)** dan mengompilasi CSS di runtime browser. Ini:
- Menambah ~200-400ms waktu rendering awal
- Mengunduh ~110KB JS yang tidak terkompresi sebelum page bisa render
- Tidak direkomendasikan Tailwind sendiri untuk produksi ("for development only")
- Menciptakan flash of unstyled content (FOUC) sementara kompilasi berjalan

---

### P-07 — CSS Variables Didefinisikan Ulang di Setiap File (Duplikasi Kode)

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`index.css`](file:///d:/exe/HERD/oprec_protic/index.css#L16-L27), [`form.css`](file:///d:/exe/HERD/oprec_protic/form.css#L23-L77), [`thankyou.css`](file:///d:/exe/HERD/oprec_protic/thankyou.css#L15-L21)

**Deskripsi:**
Design token (CSS variables) — warna, font-size, spacing, shadow — didefinisikan ulang secara manual di **3 file CSS berbeda** dengan nilai yang sedikit berbeda-beda antar file. Misalnya:

| Variable | `index.css` | `form.css` | `thankyou.css` |
|---|---|---|---|
| `--font-xs` | `8px` | `7px` | tidak ada |
| `--font-sm` | `10px` | `8px` | `12px` |
| `--font-md` | `12px` | `10px` | `14px` |
| `--font-base` | `14px` | `11px` | tidak ada |
| `--font-lg` | `16px` | `12px` | `16px` |

Inkonsistensi ini menyebabkan tampilan yang tidak konsisten antar halaman dan membuat maintenance sangat sulit.

---

### P-08 — Tidak Ada Atribut `loading="lazy"` pada Gambar Non-Kritis

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`index.html`](file:///d:/exe/HERD/oprec_protic/index.html), `form.html`

**Deskripsi:**
Gambar-gambar yang ada di bawah lipatan (below the fold) seperti ikon divisi dan logo footer tidak menggunakan lazy loading:
```html
<!-- index.html — ikon divisi di bawah lipatan, tanpa loading="lazy" -->
<img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-08/5uFCUuNzBu.svg" alt="Web Icon" />

<!-- index.html — logo footer di bawah lipatan, tanpa loading="lazy" -->
<img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-08/pOR1YyEsWN.png" alt="PROTIC Logo" />
```
Browser memuat semua gambar saat halaman dimuat, termasuk yang belum tentu dilihat pengguna, memboroskan bandwidth.

> [!CAUTION]
> `img/fotbar.webp` adalah **LCP asset** — **jangan** pernah menambahkan `loading="lazy"` padanya. Lazy loading pada LCP image akan menunda browser memulai download elemen terpenting, sehingga justru **memperburuk skor LCP** secara drastis (lihat P-01 & P-04).

---

### P-09 — Tidak Ada Favicon

**Tingkat keparahan:** 🟢 Rendah

**File terdampak:** Semua halaman

**Deskripsi:**
Tidak ada satu pun halaman yang mendefinisikan `<link rel="icon">`. Browser akan otomatis melakukan request ke `/favicon.ico` yang akan menghasilkan **404 error** — menambah request HTTP yang gagal di setiap page load.

---

### P-10 — Tidak Ada Meta Description dan Open Graph Tags

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** Semua halaman (`index.html`, `form.html`, dll.)

**Deskripsi:**
Tidak ada meta description, og:title, og:image, atau tag SEO/sosial media apapun:
```html
<!-- index.html — tidak ada meta description sama sekali -->
<meta charset="UTF--8" />  <!-- bahkan charset ini salah: UTF--8 bukan UTF-8 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

> [!CAUTION]
> Di `index.html` baris 4 terdapat typo kritis: `charset="UTF--8"` (dua strip). Ini berarti charset tidak ditetapkan dengan benar, berpotensi menyebabkan karakter Indonesia (seperti `é`, `ü`) rusak di beberapa browser lama.

---

### P-11 — Font `Dungeon` Tidak Dimuat dengan Benar

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`index.css`](file:///d:/exe/HERD/oprec_protic/index.css#L59), [`form.css`](file:///d:/exe/HERD/oprec_protic/form.css#L142)

**Deskripsi:**
CSS mereferensikan `font-family: 'Dungeon', serif` untuk heading PROTIC, namun tidak ada `@font-face` atau link Google Fonts untuk font Dungeon. Font ini tidak tersedia di Google Fonts secara default. Akibatnya:
- Font fallback ke `serif` generik (biasanya Times New Roman)
- Tampilan heading tidak sesuai desain asli
- Judul "PROTIC" besar di footer/hero akan terlihat menggunakan font default browser

---

## 🟠 KEKURANGAN UI/UX

---

### U-01 — Splash Screen Tidak Bisa Di-Skip (Anti-Pattern UX)

**Tingkat keparahan:** 🔴 Kritis

**File terdampak:** [`script.js`](file:///d:/exe/HERD/oprec_protic/script.js#L56-L72)

**Deskripsi:**
Splash screen 2,5 detik dipaksakan tanpa opsi apapun untuk melompatinya. Ini adalah anti-pattern UX yang sudah lama ditinggalkan:
- Pengguna yang sudah mengenal brand tidak butuh intro
- Pengguna yang ingin langsung daftar harus menunggu tanpa bisa berbuat apapun
- Tidak ada indikator progress (loading bar, persentase) — terasa seperti halaman macet
- Tidak menghormati `prefers-reduced-motion` — pengguna dengan sensitivitas animasi terdampak

---

### U-02 — Layout Desktop Tidak Dioptimalkan (Satu Kolom Semua)

**Tingkat keparahan:** 🔴 Kritis

**File terdampak:** [`index.css`](file:///d:/exe/HERD/oprec_protic/index.css#L238-L311)

**Deskripsi:**
Meskipun komentar CSS menyebut "mobile-first", media query untuk desktop (`min-width: 1024px`) justru mempertahankan layout satu kolom:
```css
/* index.css baris 272-278 */
@media (min-width: 1024px) {
  .intro-section {
    display: flex;
    flex-direction: column; /* masih satu kolom! */
    align-items: center;
  }
}
```
Di layar 1920x1080 atau 1440px, meskipun `.page-wrapper` mendukung `max-width: 1200px`, elemen konten (`.intro-text-content` dan `.intro-image-group`) masih ditumpuk secara vertikal dengan masing-masing dibatasi `max-width: 700px`. Ini menyia-nyiakan >50% ruang layar dan membuat situs terlihat seperti prototipe mobile yang dipaksakan ke desktop.

**Yang seharusnya:** Pada desktop, intro section menggunakan 2 kolom (teks di kiri, gambar + kartu di kanan), dan division section menggunakan 2 kolom (Technical | Non-Technical).

---

### U-03 — Form Validasi Menggunakan `alert()` (Anti-Pattern Modern)

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L293-L295), [`script.js`](file:///d:/exe/HERD/oprec_protic/script.js#L94)

**Deskripsi:**
Semua feedback validasi menggunakan `alert()` native browser:
```javascript
// form.html baris 294 — saat klik divisi ke-3
alert("Kamu hanya boleh memilih 2 divisi!");

// form.html baris 304 — saat submit dengan jumlah divisi ≠ 2
alert("Harap pilih tepat 2 divisi!");

// script.js baris 94 — tidak aktif di form.html, hanya di index.html
alert("Kamu hanya bisa memilih maksimal 2 divisi!");
```

`alert()` adalah metode paling primitif untuk feedback:
- Memblokir seluruh JavaScript execution
- Tampilan tidak konsisten antar browser dan OS
- Tidak dapat di-style sesuai brand
- Mengganggu (blocking UI) terutama di mobile
- Teks pesan **berbeda di 3 tempat** — inkonsistensi copy lebih parah dari yang terlihat!

---

### U-04 — Tidak Ada Navigasi / Breadcrumb antar Halaman

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** Semua halaman

**Deskripsi:**
Tidak ada elemen navigasi sama sekali di situs ini:
- Tidak ada navbar/header link
- Tidak ada tombol "Kembali ke Beranda" di halaman form, thankyou, success, denied
- Pengguna yang membuka `pengumuman.html` atau `form.html` tidak bisa kembali ke halaman utama tanpa menekan tombol Back browser
- Halaman `denied.html` — setelah dinyatakan tidak lolos, tidak ada opsi navigasi yang jelas selain satu tombol "Join Community"

---

### U-05 — Input Nomor WhatsApp dan NPM/NIM Menggunakan `type="number"` (Salah)

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L41-L47), [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L176-L183)

**Deskripsi:**
```html
<!-- form.html baris 42-46 -->
<input type="number" id="npm" name="npm" .../>

<!-- form.html baris 177-183 -->
<input type="number" id="whatsapp" name="whatsapp" placeholder="08xxxxxxxxx" .../>
```

Menggunakan `type="number"` untuk NPM/NIM dan nomor HP memiliki banyak masalah:
1. **Menampilkan spinner up/down** yang tidak relevan dan mengganggu tampilan
2. **Menghilangkan leading zero** — `08123456789` menjadi `8123456789`
3. **Tidak memvalidasi format nomor HP** dengan benar
4. Di mobile, keyboard numerik muncul tapi tanpa tanda `+` atau `-` yang kadang dibutuhkan
5. **`type="tel"`** adalah tipe yang tepat untuk nomor telepon
6. **`type="text"` dengan `pattern`** adalah pendekatan yang tepat untuk NPM

---

### U-06 — Tidak Ada Indikator Pemilihan Divisi yang Jelas (Counter/Badge)

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L82-L154)

**Deskripsi:**
Pengguna diminta memilih **tepat 2 divisi**, namun tidak ada indikator yang menunjukkan:
- Berapa divisi yang sudah dipilih saat ini (misalnya "1/2 dipilih")
- Divisi mana saja yang sudah dipilih (selain warna border yang subtle)
- Peringatan ketika mencoba memilih lebih dari 2

Satu-satunya feedback adalah `alert()` yang baru muncul setelah pengguna **sudah mencoba** melanggar aturan. Ini adalah pola reaktif, bukan preventif. UI yang baik mencegah kesalahan, bukan hanya memberitahu setelah kesalahan terjadi.

---

### U-07 — `success.html` Masih Berisi Template Literal yang Bocor

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`success.html`](file:///d:/exe/HERD/oprec_protic/success.html#L78)

**Deskripsi:**
Di `success.html` baris 78, terdapat placeholder tanpa nilai fallback yang aman:
```html
<h3 class="text-xl font-semibold text-center">
  Divisi {{ $divisi }}
</h3>
```
`{{ $divisi }}` sebenarnya **digantikan oleh JavaScript** saat halaman dimuat (`divisiEl.textContent = \`Divisi ${studentData.Divisi}\``). Akar masalahnya bukan "template engine tidak diproses" — melainkan **tidak ada nilai default HTML yang aman sebagai fallback**. Jika JS gagal berjalan atau `sessionStorage` kosong (akses langsung via URL, JS diblokir), pengguna melihat `Divisi {{ $divisi }}` mentah di layar.

**Yang seharusnya:** Beri nilai default yang bermakna langsung di HTML:
```html
<h3 class="text-xl font-semibold text-center">
  Divisi -
</h3>
```

---

### U-08 — Tidak Ada Feedback Error pada Form Submission yang Gagal

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L330-L336)

**Deskripsi:**
```javascript
.catch((err) => {
  console.error("Error!", err.message);
  alert("Terjadi kesalahan, coba lagi!"); // hanya alert generik
})
.finally(() => {
  setLoading(false);
})
```

Jika submission gagal:
- Hanya `alert()` generik tanpa petunjuk langkah selanjutnya
- Data yang sudah diisi pengguna tetap di form (positif), tapi tidak ada konfirmasi
- Tidak ada retry mechanism
- Error di-log ke `console.error` yang tidak terlihat pengguna biasa

---

### U-09 — Typo pada Label Form

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L164)

**Deskripsi:**
```html
<label for="portfolio" class="form-label">Portofoliov / CV</label>
```
Terdapat huruf `v` yang berlebih di "Portofoliov". Ini adalah kesalahan pengetikan yang langsung terlihat pengguna.

---

### U-10 — Ukuran Font Terlalu Kecil di Beberapa Area

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`form.css`](file:///d:/exe/HERD/oprec_protic/form.css#L40-L51)

**Deskripsi:**
CSS variables di `form.css` mendefinisikan skala font yang sangat kecil:
```css
--font-xs: 7px;
--font-sm: 8px;
--font-md: 10px;
--font-base: 11px;
```

- `7px` dan `8px` jauh di bawah standar WCAG 2.1 minimum (14px untuk body text)
- Font 10-11px pada deskripsi item akan sangat sulit dibaca, terutama di mobile
- Google merekomendasikan minimum **16px** untuk teks body agar tidak memerlukan zoom
- `.item-description p { font-size: var(--font-sm) }` = **10px** — terlalu kecil

---

### U-11 — Tidak Ada `aria-live` Region untuk Feedback Dinamis

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L274-L354)

**Deskripsi:**
Tidak ada `aria-live` region untuk mengumumkan perubahan state kepada pengguna screen reader:
- Saat divisi dipilih/dibatalkan — tidak ada pengumuman ke screen reader
- Saat form disubmit dan loading — tidak ada pengumuman
- Saat terjadi error — `alert()` memang bisa diakses, tapi bukan praktik terbaik
- Pengguna dengan hambatan visual tidak tahu apakah ada feedback terjadi

---

### U-12 — Footer Menggunakan Tailwind Class Inline yang Tidak Valid

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`index.html`](file:///d:/exe/HERD/oprec_protic/index.html#L251), [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L247), `thankyou.html`

**Deskripsi:**
```html
<div class="flex flex-row md:flex-col gap-2">
```
Kelas Tailwind (`flex`, `flex-row`, `md:flex-col`, `gap-2`) digunakan di halaman-halaman yang **tidak** memuat Tailwind CSS (index.html dan form.html hanya memuat `index.css` dan `form.css`). Kelas-kelas ini tidak akan diterapkan, artinya sosial media icons di footer `index.html` dan `form.html` tidak memiliki styling layout apapun.

Ukuran ikon sosial juga menggunakan `class="w-[20px] h-[20px]"` — sintaks Tailwind arbitrary value yang tidak bekerja di halaman non-Tailwind.

---

### U-13 — Halaman `thankyou.html` Tidak Memiliki Tag `</body>` (HTML Tidak Valid)

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`thankyou.html`](file:///d:/exe/HERD/oprec_protic/thankyou.html#L68-L70)

**Deskripsi:**
```html
<!-- thankyou.html — tidak ada closing </body> -->
      </footer>
</html>
```
Tag `</body>` tidak ada di `thankyou.html`. Meskipun browser cukup toleran untuk hal ini, ini adalah HTML yang tidak valid dan menunjukkan kurangnya review kode. Di beberapa parser, ini bisa menyebabkan layout yang tidak terduga.

---

### U-14 — `pengumuman.html` Input NPM Menggunakan `id="fullname"` (Salah Label)

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`pengumuman.html`](file:///d:/exe/HERD/oprec_protic/pengumuman.html#L77-L80)

**Deskripsi:**
```html
<label for="fullname" class="text-sm font-semibold uppercase">NPM</label>
<input type="text" id="fullname" name="fullname" placeholder="25010xxx" />
```
Input untuk NPM diberi `id="fullname"` dan `name="fullname"` — ini adalah copas dari field nama di form pendaftaran yang tidak disesuaikan. Meski fungsional (karena `label for="fullname"` masih terhubung ke inputnya), semantiknya salah dan menyulitkan maintenance serta screen reader yang mengandalkan label semantis.

---

### U-15 — Tidak Ada Feedback Visual Saat Hover pada Ikon Sosial Media

**Tingkat keparahan:** 🟢 Rendah

**File terdampak:** [`index.css`](file:///d:/exe/HERD/oprec_protic/index.css#L211-L220), semua halaman

**Deskripsi:**
Link sosial media (Github, Instagram, LinkedIn) di footer tidak memiliki efek hover. Pengguna tidak mendapat feedback visual bahwa ikon tersebut dapat diklik, sehingga ikon terasa seperti gambar dekoratif saja.

---

### U-16 — Warna Tombol Sangat Mirip Background (Kontras Rendah di Beberapa State)

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`form.css`](file:///d:/exe/HERD/oprec_protic/form.css#L252-L278)

**Deskripsi:**
Tombol divisi memiliki background hijau gelap di atas background kartu hijau gelap. Perbedaan kontras antara tombol inactive dan background container tidak cukup jelas:
- Background container kartu: `linear-gradient(180deg, #80C89F → #114B2A → #06291E)`
- Background tombol: `linear-gradient(180deg, #2aac63 → #051A13)`
- Kontras rasio perlu diuji dengan WCAG AA (minimum 4.5:1 untuk teks)

---

### U-17 — Tidak Ada Konfirmasi Sebelum Submit Form

**Tingkat keparahan:** 🟢 Rendah

**File terdampak:** [`form.html`](file:///d:/exe/HERD/oprec_protic/form.html#L300-L337)

**Deskripsi:**
Setelah menekan "Kirim", form langsung disubmit tanpa konfirmasi. Mengingat ini adalah formulir pendaftaran resmi (sekali submit tidak bisa diedit dari sisi user), tidak ada langkah review/preview sebelum data dikirim ke Google Sheets. Pengguna yang salah mengisi tidak punya kesempatan untuk koreksi setelah submit.

---

### U-18 — Tidak Ada Error State Visual pada Input Form

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`form.css`](file:///d:/exe/HERD/oprec_protic/form.css#L230-L233)

**Deskripsi:**
Form hanya memiliki:
```css
.form-input:focus {
  outline: 2px solid var(--accent-green);
}
```
Tidak ada CSS untuk state error/invalid:
- Tidak ada `.form-input:invalid` styling
- Tidak ada pesan error inline di bawah field
- Tidak ada indikator visual field mana yang wajib diisi dan mana yang opsional (hanya mengandalkan atribut `required` native browser yang tampilannya tidak konsisten)

---

### U-19 — `script.js` Mengandung Dead Code untuk Division Selection

**Tingkat keparahan:** 🟡 Sedang

**File terdampak:** [`script.js`](file:///d:/exe/HERD/oprec_protic/script.js#L74-L115)

**Deskripsi:**
`script.js` baris 74–115 mendefinisikan ulang logika pemilihan divisi (`divisionButtons`, `selectedDivisions`) secara lengkap. Namun `script.js` hanya di-load di `index.html` (baris 277), **bukan** di `form.html`. `form.html` justru menggunakan inline script sendiri yang menduplikasi logika yang sama persis.

Akibatnya:
- Kode di `script.js` baris 74–115 **tidak pernah dieksekusi** di konteks yang relevan (`form.html`)
- Ada dua sumber kebenaran yang berpotensi konflik jika salah satu diubah
- Jika suatu saat script direfactor ke file eksternal, duplikasi ini akan menyebabkan bug ganda

```javascript
// script.js baris 75-98 — tidak pernah jalan di form.html
const divisionButtons = document.querySelectorAll(".division-btn");
let selectedDivisions = [];
divisionButtons.forEach(button => { ... });
```

---

### U-20 — `success.html` Bergantung `sessionStorage` Tanpa Validasi Sumber (Celah Keamanan)

**Tingkat keparahan:** 🟠 Tinggi

**File terdampak:** [`success.html`](file:///d:/exe/HERD/oprec_protic/success.html#L136-L141)

**Deskripsi:**
`success.html` mengambil data dari `sessionStorage` tanpa memverifikasi bahwa data tersebut berasal dari sumber yang sah:

```javascript
// success.html baris 137
const studentData = JSON.parse(sessionStorage.getItem("studentData"));
if (!studentData) {
  alert("Data tidak ditemukan.");
  window.location.href = "index.html";
}
```

Siapapun dapat menyuntikkan data palsu dari konsol browser:
```javascript
sessionStorage.setItem("studentData", JSON.stringify({
  Nama: "Orang Lain", Divisi: "WEB", NPM: "000"
}));
// Buka success.html → halaman tampil sebagai peserta lolos
```
Halaman kemudian memetakan divisi ke nomor WhatsApp koordinator internal dan membuat link WhatsApp dengan data palsu tersebut. Ini **membocorkan kontak internal pengurus** kepada pihak yang tidak berhak.

---

## 📊 Ringkasan Temuan

| ID | Kategori | Keparahan | Judul |
|---|---|---|---|
| P-01 | Performa | 🔴 Kritis | `fotbar.webp` 3.29MB |
| P-02 | Performa | 🔴 Kritis | Splash screen 2.5 detik wajib |
| P-03 | Performa | 🟠 Tinggi | 15+ aset dari CDN pihak ketiga |
| P-04 | Performa | 🟠 Tinggi | Tidak ada `<link rel="preload">` |
| P-05 | Performa | 🟠 Tinggi | Gambar tanpa width/height → CLS |
| P-06 | Performa | 🟠 Tinggi | Tailwind CDN runtime di produksi |
| P-07 | Performa | 🟡 Sedang | CSS variables duplikat & inkonsisten |
| P-08 | Performa | 🟡 Sedang | Tidak ada `loading="lazy"` |
| P-09 | Performa | 🟢 Rendah | Tidak ada favicon (404 request) |
| P-10 | Performa/SEO | 🟡 Sedang | Tidak ada meta description/OG tags |
| P-11 | Performa | 🟡 Sedang | Font Dungeon tidak dimuat |
| U-01 | UI/UX | 🔴 Kritis | Splash screen tidak bisa di-skip |
| U-02 | UI/UX | 🔴 Kritis | Layout desktop tidak dioptimalkan |
| U-03 | UI/UX | 🟠 Tinggi | `alert()` untuk validasi |
| U-04 | UI/UX | 🟠 Tinggi | Tidak ada navigasi antar halaman |
| U-05 | UI/UX | 🟠 Tinggi | `type="number"` untuk HP dan NPM |
| U-06 | UI/UX | 🟠 Tinggi | Tidak ada counter divisi terpilih |
| U-07 | UI/UX | 🟠 Tinggi | Template literal `{{ $divisi }}` bocor |
| U-08 | UI/UX | 🟠 Tinggi | Error handling form tidak informatif |
| U-09 | UI/UX | 🟡 Sedang | Typo "Portofoliov" |
| U-10 | UI/UX | 🟡 Sedang | Font size terlalu kecil (7-10px) |
| U-11 | UI/UX | 🟡 Sedang | Tidak ada `aria-live` region |
| U-12 | UI/UX | 🟡 Sedang | Tailwind classes di halaman non-Tailwind |
| U-13 | UI/UX | 🟡 Sedang | HTML tidak valid (`</body>` hilang) |
| U-14 | UI/UX | 🟡 Sedang | `id="fullname"` untuk input NPM |
| U-15 | UI/UX | 🟢 Rendah | Tidak ada hover effect ikon sosial |
| U-16 | UI/UX | 🟡 Sedang | Kontras warna perlu audit WCAG |
| U-17 | UI/UX | 🟢 Rendah | Tidak ada konfirmasi sebelum submit |
| U-18 | UI/UX | 🟡 Sedang | Tidak ada error state visual pada input |
| U-19 | Arsitektur | 🟡 Sedang | Dead code division selection di `script.js` |
| U-20 | Keamanan | 🟠 Tinggi | `sessionStorage` tanpa validasi sumber (kontak internal bocor) |

**Total temuan: 31 masalah** (4 Kritis, 12 Tinggi, 12 Sedang, 3 Rendah)

---

> ⚡ Menunggu perintah untuk melanjutkan ke bagian No. 2 (Solusi)
