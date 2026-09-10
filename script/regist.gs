/**
 * Google Apps Script - Backend Pendaftaran & Manajemen Pendaftar PROTIC
 * 
 * Mendukung aksi:
 * 1. "register" : Pendaftaran baru (dengan proteksi duplikasi NPM)
 * 2. "verify"   : Pengecekan data pendaftaran via NPM + 4 digit terakhir WhatsApp (PIN)
 * 3. "update"   : Pembaruan data pendaftaran yang sudah terdaftar
 * 4. "delete"   : Penghapusan data pendaftaran secara permanen (Hard Delete)
 */

const SHEET_NAME = 'Pendaftar';

function getPendaftarSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp',
      'Nama Lengkap',
      'NPM',
      'Kelas',
      'Semester',
      'Divisi 1',
      'Divisi 2',
      'Portofolio',
      'Whatsapp',
      'Email'
    ]);
  }
  return sheet;
}

function cleanDigits(val) {
  return String(val || '').replace(/\D/g, '');
}

function findRegistration(sheet, npm) {
  const data = sheet.getDataRange().getValues();
  const targetNpm = String(npm).trim();

  for (let i = 1; i < data.length; i++) {
    const rowNpm = String(data[i][2]).trim(); // Kolom C (NPM)
    if (rowNpm === targetNpm) {
      return {
        rowIndex: i + 1, // 1-indexed for sheet operations
        row: data[i],
        data: {
          timestamp: data[i][0],
          fullname: data[i][1],
          npm: data[i][2],
          class: data[i][3],
          semester: data[i][4],
          division1: data[i][5],
          division2: data[i][6],
          portfolio: data[i][7],
          whatsapp: data[i][8],
          email: data[i][9]
        }
      };
    }
  }
  return null;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET Handler: Mendukung verifikasi identitas (NPM + 4 digit WA) via query parameter
function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = params.action || 'verify';

    if (action === 'verify') {
      const npm = (params.npm || '').trim();
      const pin = cleanDigits(params.pin || '');

      if (!npm || pin.length !== 4) {
        return jsonResponse({
          result: 'error',
          message: 'NPM dan 4 digit terakhir nomor WhatsApp wajib diisi.'
        });
      }

      const sheet = getPendaftarSheet();
      const found = findRegistration(sheet, npm);

      if (!found) {
        return jsonResponse({
          result: 'not_found',
          message: 'Data pendaftaran dengan NPM tersebut tidak ditemukan.'
        });
      }

      const storedWaDigits = cleanDigits(found.data.whatsapp);
      const storedLast4 = storedWaDigits.slice(-4);

      if (storedLast4 !== pin) {
        return jsonResponse({
          result: 'invalid_pin',
          message: '4 digit nomor WhatsApp tidak cocok dengan data pendaftaran.'
        });
      }

      return jsonResponse({
        result: 'success',
        message: 'Identitas berhasil diverifikasi.',
        data: found.data
      });
    }

    return jsonResponse({ result: 'error', message: 'Aksi GET tidak valid.' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: String(err) });
  }
}

// POST Handler: Menangani register, verify, update, dan delete
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || 'register';
    const sheet = getPendaftarSheet();

    // 1. PENDAFTARAN BARU
    if (action === 'register') {
      const npm = String(payload.npm || '').trim();
      if (!npm) {
        return jsonResponse({ result: 'error', message: 'NPM wajib diisi.' });
      }

      // Cek apakah NPM sudah terdaftar sebelumnya
      const existing = findRegistration(sheet, npm);
      if (existing) {
        return jsonResponse({
          result: 'duplicate',
          message: 'NPM ini sudah terdaftar sebelumnya. Gunakan tab "Kelola Pendaftaran" untuk melihat atau mengubah data Anda.',
          npm: npm
        });
      }

      // Tambahkan baris baru
      sheet.appendRow([
        new Date(), // timestamp
        payload.fullname || '',
        npm,
        payload.class || '',
        payload.semester || '',
        payload.division1 || '',
        payload.division2 || '',
        payload.portfolio || '',
        payload.whatsapp || '',
        payload.email || ''
      ]);

      return jsonResponse({
        result: 'success',
        message: 'Pendaftaran berhasil dikirim!',
        data: payload
      });
    }

    // 2. VERIFIKASI IDENTITAS (CEK DATA LAMA)
    if (action === 'verify') {
      const npm = String(payload.npm || '').trim();
      const pin = cleanDigits(payload.pin || '');

      if (!npm || pin.length !== 4) {
        return jsonResponse({
          result: 'error',
          message: 'NPM dan 4 digit terakhir nomor WhatsApp wajib diisi.'
        });
      }

      const found = findRegistration(sheet, npm);
      if (!found) {
        return jsonResponse({
          result: 'not_found',
          message: 'Data pendaftaran dengan NPM tersebut tidak ditemukan.'
        });
      }

      const storedWaDigits = cleanDigits(found.data.whatsapp);
      const storedLast4 = storedWaDigits.slice(-4);

      if (storedLast4 !== pin) {
        return jsonResponse({
          result: 'invalid_pin',
          message: '4 digit nomor WhatsApp tidak cocok dengan data pendaftaran.'
        });
      }

      return jsonResponse({
        result: 'success',
        message: 'Identitas berhasil diverifikasi.',
        data: found.data
      });
    }

    // 3. PERBARUI DATA PENDAFTARAN (UPDATE)
    if (action === 'update') {
      const npm = String(payload.npm || '').trim();
      const pin = cleanDigits(payload.pin || '');

      const found = findRegistration(sheet, npm);
      if (!found) {
        return jsonResponse({
          result: 'not_found',
          message: 'Data pendaftaran tidak ditemukan.'
        });
      }

      const storedWaDigits = cleanDigits(found.data.whatsapp);
      const storedLast4 = storedWaDigits.slice(-4);

      if (storedLast4 !== pin) {
        return jsonResponse({
          result: 'invalid_pin',
          message: 'Otorisasi gagal: 4 digit nomor WhatsApp verifikasi tidak cocok.'
        });
      }

      // Perbarui nilai baris di sheet (kolom 1 sampai 10)
      sheet.getRange(found.rowIndex, 1, 1, 10).setValues([[
        new Date(), // update timestamp ke waktu edit terakhir
        payload.fullname || found.data.fullname,
        npm,
        payload.class || found.data.class,
        payload.semester || found.data.semester,
        payload.division1 || found.data.division1,
        payload.division2 || found.data.division2,
        payload.portfolio !== undefined ? payload.portfolio : found.data.portfolio,
        payload.whatsapp || found.data.whatsapp,
        payload.email || found.data.email
      ]]);

      return jsonResponse({
        result: 'success',
        message: 'Data pendaftaran berhasil diperbarui!',
        data: payload
      });
    }

    // 4. HAPUS PENDAFTARAN (HARD DELETE)
    if (action === 'delete') {
      const npm = String(payload.npm || '').trim();
      const pin = cleanDigits(payload.pin || '');

      const found = findRegistration(sheet, npm);
      if (!found) {
        return jsonResponse({
          result: 'not_found',
          message: 'Data pendaftaran tidak ditemukan.'
        });
      }

      const storedWaDigits = cleanDigits(found.data.whatsapp);
      const storedLast4 = storedWaDigits.slice(-4);

      if (storedLast4 !== pin) {
        return jsonResponse({
          result: 'invalid_pin',
          message: 'Otorisasi gagal: 4 digit nomor WhatsApp tidak cocok.'
        });
      }

      // Hapus baris secara fisik dari Google Sheets
      sheet.deleteRow(found.rowIndex);

      return jsonResponse({
        result: 'success',
        message: 'Pendaftaran Anda telah berhasil dihapus secara permanen dari sistem.',
        deletedNpm: npm
      });
    }

    return jsonResponse({ result: 'error', message: 'Aksi POST tidak dikenali.' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: String(err) });
  }
}
