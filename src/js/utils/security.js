/**
 * PROTIC Oprec 2026/2027 - Security Utilities (Shared Module)
 *
 * Berisi fungsi utilitas keamanan yang digunakan bersama oleh:
 * - pengumuman.html: untuk menghash token sebelum redirect
 * - success.html: untuk memverifikasi integritas token sesi
 * - denied.html: untuk memverifikasi integritas token sesi
 *
 * ⚠️  Peringatan Keamanan: Algoritma ini adalah client-side integrity check,
 *      bukan kriptografi sekuriti penuh. Tujuannya mencegah manipulasi data
 *      sessionStorage oleh pengguna biasa (bukan penyerang terlatih).
 */

/**
 * Menghasilkan token keamanan deterministik berdasarkan NPM, status, dan timestamp.
 * Token ini disimpan bersama data di sessionStorage dan diverifikasi ulang di halaman tujuan.
 *
 * @param {string|number} npm     - Nomor Pokok Mahasiswa
 * @param {string}        status  - Status kelolosan ("diterima" / "tidak diterima" dst.)
 * @param {number}        timestamp - Unix timestamp (ms) saat token dibuat
 * @returns {string} Token hex 16 karakter (DJB2 + FNV1a gabungan)
 */
function generateSecurityToken(npm, status, timestamp) {
  const secretSalt = (window.APP_CONFIG?.SECURITY_SALT) || "PROTIC_OPREC_2026_SECURITY_SALT_v1";
  const payload = String(npm).trim() + "|" + String(status).toLowerCase().trim() + "|" + timestamp + "|" + secretSalt;

  // DJB2 hash
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash) + payload.charCodeAt(i);
    hash = hash & hash;
  }

  // FNV-1a hash
  let hash2 = 0x811c9dc5;
  for (let i = 0; i < payload.length; i++) {
    hash2 ^= payload.charCodeAt(i);
    hash2 = Math.imul(hash2, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, "0") + (hash2 >>> 0).toString(16).padStart(8, "0");
}

/**
 * Memverifikasi sesi studentData dari sessionStorage.
 * Memeriksa keberadaan token, masa berlaku, dan integritas token hash.
 *
 * @returns {{ data: object|null, error: string|null }}
 */
function verifyStudentSession() {
  const MAX_SESSION_AGE = (window.APP_CONFIG?.MAX_SESSION_AGE_MS) || (15 * 60 * 1000);
  try {
    const raw = sessionStorage.getItem("studentData");
    if (!raw) return { data: null, error: "Sesi Tidak Ditemukan" };

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data || !parsed.timestamp || !parsed.token) {
      return { data: null, error: "Format Sesi Tidak Valid" };
    }

    const now = Date.now();
    const age = now - parsed.timestamp;

    if (age > MAX_SESSION_AGE || parsed.timestamp > now + 60000) {
      sessionStorage.removeItem("studentData");
      return { data: null, error: "Sesi Telah Berakhir (Kedaluwarsa)" };
    }

    const expectedToken = generateSecurityToken(parsed.data.NPM, parsed.data.Status, parsed.timestamp);
    if (expectedToken !== parsed.token) {
      sessionStorage.removeItem("studentData");
      return { data: null, error: "Integritas Sesi Tidak Valid" };
    }

    return { data: parsed.data, error: null };
  } catch (e) {
    console.error("Gagal memverifikasi sesi:", e);
    return { data: null, error: "Terjadi Kesalahan Pembacaan Sesi" };
  }
}

// Ekspor ke window untuk digunakan oleh skrip biasa (non-module)
if (typeof window !== "undefined") {
  window.PROTIC = window.PROTIC || {};
  window.PROTIC.generateSecurityToken = generateSecurityToken;
  window.PROTIC.verifyStudentSession = verifyStudentSession;
}
