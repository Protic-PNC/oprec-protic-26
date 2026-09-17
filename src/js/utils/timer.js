/**
 * PROTIC Oprec 2026/2027 - Countdown Timer Utilities (Shared Module)
 *
 * Berisi fungsi utilitas countdown timer yang digunakan bersama oleh:
 * - script.js (index.html): badge countdown di landing page
 * - form.html: badge status pendaftaran di formulir
 *
 * Untuk menggunakan modul ini, pastikan config.js dimuat lebih dulu.
 */

/**
 * Menghitung sisa waktu dari sekarang hingga deadline dan
 * memformatnya menjadi string "JJ : MM : DD".
 *
 * @param {number} deadlineMs - Deadline dalam Unix timestamp (ms)
 * @returns {{ diff: number, formatted: string, expired: boolean }}
 */
function calcCountdown(deadlineMs) {
  const diff = deadlineMs - Date.now();
  if (diff <= 0) return { diff: 0, formatted: "00 : 00 : 00", expired: true };

  const hours   = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatted = [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(" : ");

  return { diff, formatted, expired: false };
}

/**
 * Menjalankan interval countdown 1 detik dan memanggil callback setiap tick.
 * Interval otomatis dihentikan saat deadline tercapai.
 *
 * @param {number}   deadlineMs - Deadline dalam Unix timestamp (ms)
 * @param {Function} onTick     - Callback(result) dipanggil setiap detik: { diff, formatted, expired }
 * @returns {number} intervalId (bisa digunakan untuk clearInterval manual jika diperlukan)
 */
function startCountdownInterval(deadlineMs, onTick) {
  // Panggil sekali langsung
  const initial = calcCountdown(deadlineMs);
  onTick(initial);
  if (initial.expired) return null;

  const id = setInterval(() => {
    const result = calcCountdown(deadlineMs);
    onTick(result);
    if (result.expired) clearInterval(id);
  }, 1000);

  return id;
}

// Ekspor ke window untuk digunakan oleh skrip biasa (non-module)
if (typeof window !== "undefined") {
  window.PROTIC = window.PROTIC || {};
  window.PROTIC.calcCountdown = calcCountdown;
  window.PROTIC.startCountdownInterval = startCountdownInterval;
}
