/**
 * PROTIC Oprec 2026/2027 - Form Draft Auto-Save (src/js/form/draft.js)
 *
 * Mengelola mekanisme auto-save draf formulir ke localStorage,
 * pemulihan data formulir saat halaman dimuat ulang, serta
 * aksi pembersihan draf dengan notifikasi toast dan fitur Undo ("Urungkan").
 */
window.PROTIC = window.PROTIC || {};

(function () {
  const form = document.getElementById("registrationForm");
  const clearDraftBtn = document.getElementById("clearDraftBtn");
  const DRAFT_KEY = window.PROTIC.formState?.DRAFT_KEY || "protic_oprec_draft";

  let lastClearedDraft = null;

  function updateClearDraftBtnVisibility() {
    if (!clearDraftBtn) return;
    const hasDraft = Boolean(localStorage.getItem(DRAFT_KEY));
    const isEditMode = window.PROTIC.formState?.isEditMode;

    // Jika bukan edit mode dan ada draf, tampilkan opsi Bersihkan Draf
    if (!isEditMode && hasDraft) {
      clearDraftBtn.classList.remove("hidden");
    } else {
      clearDraftBtn.classList.add("hidden");
    }
  }

  function saveDraft() {
    if (!form) return;
    try {
      const state = window.PROTIC.formState;
      const draft = {
        fullname: form.fullname ? form.fullname.value : "",
        npm: form.npm ? form.npm.value : "",
        class: form.class ? form.class.value : "",
        semester: form.semester ? form.semester.value : "",
        selectedDivisions: state.selectedDivisions || [],
        portfolio: form.portfolio ? form.portfolio.value : "",
        whatsapp: form.whatsapp ? form.whatsapp.value : "",
        email: form.email ? form.email.value : "",
        currentStep: state.currentStep || 1,
        isEditMode: state.isEditMode || false,
        verifiedApplicantData: state.isEditMode ? state.verifiedApplicantData : null,
        currentVerifiedPin: state.isEditMode ? state.currentVerifiedPin : null,
        savedAt: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      updateClearDraftBtnVisibility();
    } catch (e) {
      console.warn("Gagal menyimpan draf form ke localStorage", e);
    }
  }

  function loadDraft() {
    if (!form) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) {
        updateClearDraftBtnVisibility();
        return;
      }
      const draft = JSON.parse(raw);
      if (!draft) {
        updateClearDraftBtnVisibility();
        return;
      }

      if (draft.fullname && form.fullname) form.fullname.value = draft.fullname;
      if (draft.npm && form.npm) form.npm.value = draft.npm;
      if (draft.class && form.class) form.class.value = draft.class;
      if (draft.semester && form.semester) form.semester.value = draft.semester;
      if (draft.portfolio && form.portfolio) form.portfolio.value = draft.portfolio;
      if (draft.whatsapp && form.whatsapp) form.whatsapp.value = draft.whatsapp;
      if (draft.email && form.email) form.email.value = draft.email;

      if (Array.isArray(draft.selectedDivisions)) {
        const validDivisions = Object.keys(window.PROTIC.DIVISIONS || {
          "WEB": 1, "UI/UX": 1, "MOBILE": 1, "DEVOPS": 1, "DATA": 1,
          "HUMAS": 1, "KOMINFO": 1, "SEKRETARIS": 1, "SEKRE": 1, "BENDAHARA": 1
        });
        window.PROTIC.formState.selectedDivisions = draft.selectedDivisions
          .filter((d) => validDivisions.includes(d))
          .slice(0, 2);
      }

      // Pulihkan Status Mode Ubah Data jika pengguna sebelumnya keluar saat sedang mengedit
      if (draft.isEditMode && draft.verifiedApplicantData) {
        if (typeof window.PROTIC.applyEditMode === "function") {
          window.PROTIC.applyEditMode(draft.verifiedApplicantData, draft.currentVerifiedPin);
        }
      }

      updateClearDraftBtnVisibility();
    } catch (e) {
      console.warn("Gagal memuat draf form dari localStorage", e);
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
      updateClearDraftBtnVisibility();
    } catch (e) {
      console.warn("Gagal menghapus draf form", e);
    }
  }

  function handleClearDraft() {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        lastClearedDraft = JSON.parse(raw);
      } catch (e) {
        lastClearedDraft = null;
      }
    }

    // Langsung bersihkan seketika tanpa dialog konfirmasi mengganggu
    if (typeof window.PROTIC.cancelEditMode === "function") {
      window.PROTIC.cancelEditMode(true);
    }

    if (typeof window.PROTIC.showToast === "function") {
      window.PROTIC.showToast({
        message: "Draf formulir dibersihkan.",
        type: "info",
        duration: 5000,
        action: {
          label: "Urungkan",
          onClick: () => {
            if (lastClearedDraft) {
              try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(lastClearedDraft));
                loadDraft();
                if (window.PROTIC.updateDivisionUI) window.PROTIC.updateDivisionUI();
                if (window.PROTIC.updateStepperVisuals) window.PROTIC.updateStepperVisuals();
                window.PROTIC.showToast({
                  message: "Draf formulir berhasil dipulihkan!",
                  type: "success",
                  duration: 3000,
                });
              } catch (err) {
                console.warn("Gagal memulihkan draf:", err);
              } finally {
                lastClearedDraft = null;
              }
            }
          },
        },
      });
    }
  }

  if (clearDraftBtn) {
    clearDraftBtn.addEventListener("click", handleClearDraft);
  }

  // Listener input untuk auto-save draf
  if (form) {
    form.addEventListener("input", () => {
      if (window.PROTIC.updateStepperVisuals) window.PROTIC.updateStepperVisuals();
      saveDraft();
    });
  }

  // Ekspor ke namespace PROTIC
  window.PROTIC.saveDraft = saveDraft;
  window.PROTIC.loadDraft = loadDraft;
  window.PROTIC.clearDraft = clearDraft;
  window.PROTIC.updateClearDraftBtnVisibility = updateClearDraftBtnVisibility;
})();
