/**
 * PROTIC Oprec 2026/2027 - Form Submission & Edit Mode Controller (src/js/form/submit.js)
 *
 * Mengelola:
 *  - Siklus Mode Ubah Data (applyEditMode, startEditMode, cancelEditMode)
 *  - Modal Konfirmasi Pendaftaran (Preview Ringkasan & Checklist Google Drive)
 *  - Modal Peringatan Duplikasi NPM
 *  - Eksekusi Fetch HTTP POST ke Google Apps Script (Action: "register" / "update")
 */
window.PROTIC = window.PROTIC || {};

(function () {
  const scriptURL =
    window.APP_CONFIG?.SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbw_mtEcU_vVhF96O2ACQZkPp_LoV7i88L9b4CNFx5gLkJ9wSiSzBtaA6xkNitoZ-aPo/exec";

  const form = document.getElementById("registrationForm");
  const editModeBanner = document.getElementById("editModeBanner");
  const editModeApplicantName = document.getElementById("editModeApplicantName");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  // Tombol & Elemen Submit Form
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnLoading = document.getElementById("btnLoading");

  // Modal Konfirmasi Submit
  const confirmModal = document.getElementById("confirmModal");
  const modalCancelBtn = document.getElementById("modalCancelBtn");
  const modalConfirmBtn = document.getElementById("modalConfirmBtn");
  const modalConfirmBtnText = document.getElementById("modalConfirmBtnText");
  const confirmDriveAccess = document.getElementById("confirmDriveAccess");
  const summaryName = document.getElementById("summaryName");
  const summaryNpm = document.getElementById("summaryNpm");
  const summaryClass = document.getElementById("summaryClass");
  const summaryDivisions = document.getElementById("summaryDivisions");
  const summaryPortfolio = document.getElementById("summaryPortfolio");

  // Modal Duplikasi NPM
  const duplicateModal = document.getElementById("duplicateModal");
  const duplicateNpmText = document.getElementById("duplicateNpmText");
  const duplicateCloseBtn = document.getElementById("duplicateCloseBtn");
  const duplicateGoManageBtn = document.getElementById("duplicateGoManageBtn");

  let pendingFormData = null;

  function announce(msg) {
    if (window.PROTIC.announce) window.PROTIC.announce(msg);
  }

  function isRegistrationClosed() {
    if (typeof window.PROTIC.isRegistrationClosed === "function") {
      return window.PROTIC.isRegistrationClosed();
    }
    const deadline = window.APP_CONFIG?.REGISTRATION_DEADLINE
      ? new Date(window.APP_CONFIG.REGISTRATION_DEADLINE).getTime()
      : 0;
    return Date.now() >= deadline;
  }

  function setLoading(loading) {
    if (!submitBtn || !btnText || !btnLoading) return;
    if (loading) {
      submitBtn.disabled = true;
      btnText.classList.add("hidden");
      btnLoading.classList.remove("hidden");
    } else {
      submitBtn.disabled = false;
      btnText.classList.remove("hidden");
      btnLoading.classList.add("hidden");
    }
  }

  // ==========================================
  // EDIT MODE (MODE UBAH DATA)
  // ==========================================
  function applyEditMode(data, pin) {
    if (!data) return;
    const state = window.PROTIC.formState;
    state.isEditMode = true;
    state.verifiedApplicantData = data;
    if (pin) state.currentVerifiedPin = pin;

    if (form && form.npm) {
      form.npm.readOnly = true;
      form.npm.classList.add("opacity-70", "cursor-not-allowed");
    }

    if (editModeBanner) editModeBanner.classList.remove("hidden");
    if (editModeApplicantName) {
      const name = data.fullname || "Pendaftar";
      const npm = data.npm || "";
      editModeApplicantName.textContent = `${name} (${npm})`;
    }

    if (btnText) btnText.innerHTML = "Simpan Perubahan &rarr;";
    if (modalConfirmBtnText) modalConfirmBtnText.innerHTML = "Simpan Perubahan &rarr;";

    if (window.PROTIC.updateClearDraftBtnVisibility) {
      window.PROTIC.updateClearDraftBtnVisibility();
    }
  }

  function startEditMode(data) {
    if (!data) return;
    if (window.PROTIC.closeManageModal) window.PROTIC.closeManageModal();

    if (form) {
      if (form.fullname) form.fullname.value = data.fullname || "";
      if (form.npm) form.npm.value = data.npm || "";
      if (form.class) form.class.value = data.class || "";
      if (form.semester) form.semester.value = data.semester || "";
      if (form.portfolio) form.portfolio.value = data.portfolio || "";
      if (form.whatsapp) form.whatsapp.value = data.whatsapp || "";
      if (form.email) form.email.value = data.email || "";
    }

    window.PROTIC.formState.selectedDivisions = [data.division1, data.division2].filter(Boolean);

    applyEditMode(data, window.PROTIC.formState.currentVerifiedPin);
    if (window.PROTIC.updateDivisionUI) window.PROTIC.updateDivisionUI();
    if (window.PROTIC.updateStepperVisuals) window.PROTIC.updateStepperVisuals();
    if (window.PROTIC.saveDraft) window.PROTIC.saveDraft();

    if (window.PROTIC.goToStep) window.PROTIC.goToStep(1);
    announce("Mode Ubah Data aktif. Silakan perbarui data Anda dan kirim kembali.");
  }

  function cancelEditMode(resetAll = false) {
    const state = window.PROTIC.formState;
    state.isEditMode = false;
    state.verifiedApplicantData = null;
    state.currentVerifiedPin = null;

    if (form && form.npm) {
      form.npm.readOnly = false;
      form.npm.classList.remove("opacity-70", "cursor-not-allowed");
    }
    if (editModeBanner) editModeBanner.classList.add("hidden");
    if (btnText) btnText.innerHTML = "Kirim Pendaftaran &rarr;";
    if (modalConfirmBtnText) modalConfirmBtnText.innerHTML = "Kirim Sekarang &rarr;";

    if (window.PROTIC.clearDraft) window.PROTIC.clearDraft();

    if (resetAll && form) {
      form.reset();
      state.selectedDivisions = [];
      if (window.PROTIC.updateDivisionUI) window.PROTIC.updateDivisionUI();
      if (window.PROTIC.updateStepperVisuals) window.PROTIC.updateStepperVisuals();
      if (window.PROTIC.goToStep) window.PROTIC.goToStep(1);
    }

    if (window.PROTIC.updateClearDraftBtnVisibility) {
      window.PROTIC.updateClearDraftBtnVisibility();
    }
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      cancelEditMode(true);
      announce("Mode ubah data dibatalkan.");
    });
  }

  // Checklist Izin Google Drive di Modal Konfirmasi
  if (confirmDriveAccess && modalConfirmBtn) {
    confirmDriveAccess.addEventListener("change", () => {
      if (confirmDriveAccess.checked) {
        modalConfirmBtn.disabled = false;
        modalConfirmBtn.classList.remove("opacity-50", "cursor-not-allowed");
      } else {
        modalConfirmBtn.disabled = true;
        modalConfirmBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
    });
  }

  // Tutup Modal Konfirmasi
  if (modalCancelBtn && confirmModal) {
    modalCancelBtn.addEventListener("click", () => {
      confirmModal.close();
      if (submitBtn) submitBtn.focus();
    });
  }

  if (confirmModal) {
    confirmModal.addEventListener("click", (e) => {
      const rect = confirmModal.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        confirmModal.close();
        if (submitBtn) submitBtn.focus();
      }
    });

    confirmModal.addEventListener("close", () => {
      if (!pendingFormData && submitBtn) {
        submitBtn.focus();
      }
    });
  }

  // Duplicate Modal Handlers
  if (duplicateCloseBtn && duplicateModal) {
    duplicateCloseBtn.addEventListener("click", () => {
      duplicateModal.close();
    });
  }

  if (duplicateGoManageBtn && duplicateModal) {
    duplicateGoManageBtn.addEventListener("click", () => {
      duplicateModal.close();
      const attemptedNpm = form?.npm ? form.npm.value.trim() : "";
      if (window.PROTIC.openManageModal) {
        window.PROTIC.openManageModal();
      }
      const verifyNpm = document.getElementById("verifyNpm");
      const verifyPin = document.getElementById("verifyPin");
      if (verifyNpm && attemptedNpm) {
        verifyNpm.value = attemptedNpm;
        if (verifyPin) verifyPin.focus();
      }
    });
  }

  // ==========================================
  // FORM SUBMIT EVENT & CONFIRMATION MODAL
  // ==========================================
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (window.PROTIC.clearSubmitError) window.PROTIC.clearSubmitError();

      const isEdit = window.PROTIC.formState.isEditMode;
      if (!isEdit && isRegistrationClosed()) {
        if (window.PROTIC.showSubmitError) {
          window.PROTIC.showSubmitError(
            "<strong>Pendaftaran Telah Ditutup.</strong><br />Masa pendaftaran calon pengurus PROTIC 2026/2027 telah resmi berakhir pada pukul 24:00 WIB.",
            "Pendaftaran telah ditutup."
          );
        }
        return;
      }

      // Validasi semua 3 langkah
      if (window.PROTIC.validateStep) {
        if (!window.PROTIC.validateStep(1)) {
          if (window.PROTIC.goToStep) window.PROTIC.goToStep(1);
          return;
        }
        if (!window.PROTIC.validateStep(2)) {
          if (window.PROTIC.goToStep) window.PROTIC.goToStep(2);
          return;
        }
        if (!window.PROTIC.validateStep(3)) {
          return;
        }
      }

      const selectedDivisions = window.PROTIC.formState.selectedDivisions || [];
      pendingFormData = {
        fullname: form.fullname.value.trim(),
        npm: form.npm.value.trim(),
        class: form.class.value.trim(),
        semester: form.semester.value.trim(),
        division1: selectedDivisions[0],
        division2: selectedDivisions[1],
        portfolio: form.portfolio.value.trim(),
        whatsapp: form.whatsapp.value.trim(),
        email: form.email.value.trim(),
      };

      // Isi ringkasan di modal konfirmasi
      if (summaryName) summaryName.textContent = pendingFormData.fullname;
      if (summaryNpm) summaryNpm.textContent = pendingFormData.npm;
      if (summaryClass) summaryClass.textContent = `${pendingFormData.class} (Semester ${pendingFormData.semester})`;

      if (summaryDivisions) {
        summaryDivisions.innerHTML = "";
        selectedDivisions.forEach((div) => {
          const badge = document.createElement("span");
          badge.className = "summary-badge";
          badge.textContent = div;
          summaryDivisions.appendChild(badge);
        });
      }

      if (summaryPortfolio) {
        summaryPortfolio.textContent = pendingFormData.portfolio;
        summaryPortfolio.href = pendingFormData.portfolio;
      }

      // Reset checklist izin Drive ke unchecked
      if (confirmDriveAccess) confirmDriveAccess.checked = false;
      if (modalConfirmBtn) {
        modalConfirmBtn.disabled = true;
        modalConfirmBtn.classList.add("opacity-50", "cursor-not-allowed");
      }

      // Buka modal native
      if (confirmModal && typeof confirmModal.showModal === "function") {
        confirmModal.showModal();
        announce("Modal konfirmasi terbuka. Silakan periksa kembali data Anda.");
      } else {
        executeFormSubmit(pendingFormData);
      }
    });
  }

  // Konfirmasi kirim dari dalam modal
  if (modalConfirmBtn && confirmModal) {
    modalConfirmBtn.addEventListener("click", () => {
      if (!confirmDriveAccess || confirmDriveAccess.checked) {
        confirmModal.close();
        if (pendingFormData) {
          executeFormSubmit(pendingFormData);
        }
      }
    });
  }

  // ==========================================
  // EKSEKUSI FETCH HTTP POST KE GOOGLE APPS SCRIPT
  // ==========================================
  function executeFormSubmit(formData) {
    const isEdit = window.PROTIC.formState.isEditMode;
    if (!isEdit && isRegistrationClosed()) {
      if (window.PROTIC.showSubmitError) {
        window.PROTIC.showSubmitError(
          "<strong>Pendaftaran Telah Ditutup.</strong><br />Masa pendaftaran calon pengurus PROTIC 2026/2027 telah resmi berakhir pada pukul 24:00 WIB.",
          "Pendaftaran telah ditutup."
        );
      }
      return;
    }

    setLoading(true);
    announce(isEdit ? "Menyimpan perubahan data pendaftaran..." : "Mengirim formulir pendaftaran, mohon tunggu...");

    const actionType = isEdit ? "update" : "register";
    const payload = {
      ...formData,
      action: actionType,
      pin: isEdit ? window.PROTIC.formState.currentVerifiedPin : undefined,
    };

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Kasus 1: Pendaftaran Baru tapi NPM Sudah Terdaftar (Duplikasi)
        if (data.result === "duplicate") {
          if (duplicateNpmText) duplicateNpmText.textContent = formData.npm;
          if (duplicateModal && typeof duplicateModal.showModal === "function") {
            duplicateModal.showModal();
          } else if (window.PROTIC.showSubmitError) {
            window.PROTIC.showSubmitError(
              `<strong>NPM ${formData.npm} sudah terdaftar!</strong><br />Anda tidak dapat mengirimkan formulir ganda. Silakan gunakan opsi 'Cek atau ubah data' di atas untuk mengubah pendaftaran Anda.`,
              "NPM sudah terdaftar."
            );
          }
          return;
        }

        // Kasus 2: Gagal Update karena Otorisasi Tidak Cocok
        if (data.result === "invalid_pin" || data.result === "not_found") {
          if (window.PROTIC.showSubmitError) {
            window.PROTIC.showSubmitError(
              `<strong>Gagal memperbarui data:</strong> ${data.message || "Otorisasi tidak valid."}`,
              data.message
            );
          }
          return;
        }

        // Kasus 3: Berhasil Update Data
        if (isEdit) {
          if (window.PROTIC.clearDraft) window.PROTIC.clearDraft();
          announce("Perubahan data pendaftaran berhasil disimpan ke Google Sheets!");

          const updatedData = {
            ...window.PROTIC.formState.verifiedApplicantData,
            ...formData,
          };
          window.PROTIC.formState.verifiedApplicantData = updatedData;

          if (window.PROTIC.populatePreviewCard) {
            window.PROTIC.populatePreviewCard(updatedData);
          }
          cancelEditMode(true);
          if (window.PROTIC.openManageModal) window.PROTIC.openManageModal();
          if (window.PROTIC.showManageView) window.PROTIC.showManageView("preview");

          if (window.PROTIC.showToast) {
            window.PROTIC.showToast({
              message: "Perubahan data pendaftaran berhasil disimpan!",
              type: "success",
              duration: 3500,
            });
          }
          return;
        }

        // Kasus 4: Berhasil Pendaftaran Baru
        if (window.PROTIC.clearDraft) window.PROTIC.clearDraft();
        announce("Pendaftaran berhasil! Mengalihkan ke halaman terima kasih.");
        window.location.href = "thankyou.html";
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        if (window.PROTIC.showSubmitError) {
          window.PROTIC.showSubmitError(
            "<strong>Gagal mengirim formulir.</strong><br />Cek koneksi internet Anda dan coba lagi. Masalah berlanjut? Hubungi panitia.",
            "Gagal mengirim formulir. Cek koneksi internet Anda dan coba lagi."
          );
        }
      })
      .finally(() => {
        setLoading(false);
        pendingFormData = null;
      });
  }

  // Ekspor ke namespace PROTIC
  window.PROTIC.applyEditMode = applyEditMode;
  window.PROTIC.startEditMode = startEditMode;
  window.PROTIC.cancelEditMode = cancelEditMode;
  window.PROTIC.executeFormSubmit = executeFormSubmit;
  window.PROTIC.setLoading = setLoading;
})();
