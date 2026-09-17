/**
 * PROTIC Oprec 2026/2027 - Application Configuration (Single Source of Truth)
 * 
 * Pengurus periode selanjutnya (2027+) cukup memperbarui nilai di file ini
 * untuk mengganti endpoint Google Apps Script, batas waktu pendaftaran,
 * serta tautan resmi organisasi tanpa perlu mengubah file HTML/JS lainnya.
 */

const APP_CONFIG = {
  // Google Apps Script Web App Deployment URL
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbw_mtEcU_vVhF96O2ACQZkPp_LoV7i88L9b4CNFx5gLkJ9wSiSzBtaA6xkNitoZ-aPo/exec",

  // Batas Waktu Pendaftaran (Format ISO 8601 dengan timezone WIB +07:00)
  REGISTRATION_DEADLINE: "2026-09-18T00:00:00+07:00",

  // Salt Keamanan untuk Enkripsi Token Sesi Pengumuman
  SECURITY_SALT: "PROTIC_OPREC_2026_SECURITY_SALT_v1",

  // Durasi Maksimum Sesi Validasi Hasil (15 Menit)
  MAX_SESSION_AGE_MS: 15 * 60 * 1000,

  // Tautan Resmi & Komunitas
  LINKS: {
    WHATSAPP_COMMUNITY: "https://chat.whatsapp.com/DaExLk9Nm7U6YpDFvHParv?s=cl&p=a&mlu=4&ilr=4",
    INSTAGRAM: "https://www.instagram.com/protic_pnc?stkn=anlzMDhlMzlucmJh",
    GITHUB: "https://github.com/Protic-PNC",
    LINKEDIN: "https://www.linkedin.com/company/proticpnc/"
  }
};

// Pasang ke window agar dapat diakses oleh skrip biasa maupun modul
if (typeof window !== "undefined") {
  window.APP_CONFIG = APP_CONFIG;
}

// Ekspor untuk lingkungan module ES / Node
if (typeof module !== "undefined" && module.exports) {
  module.exports = APP_CONFIG;
}
