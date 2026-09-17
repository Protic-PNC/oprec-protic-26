/**
 * PROTIC Oprec 2026/2027 - Form State & UI Helpers (src/js/form/state.js)
 *
 * Mengelola state reaktif form pendaftaran serta fungsi helper UI untuk
 * accessibility announcer dan notifikasi error validasi.
 */
window.PROTIC = window.PROTIC || {};

window.PROTIC.formState = {
  currentStep: 1,
  selectedDivisions: [],
  isEditMode: false,
  verifiedApplicantData: null,
  currentVerifiedPin: null,
  pendingFormData: null,
  DRAFT_KEY: "protic_oprec_draft"
};

(function () {
  const formAnnouncer = document.getElementById("formAnnouncer");
  const divisionError = document.getElementById("divisionError");
  const submitError = document.getElementById("submitError");

  function announce(message) {
    if (formAnnouncer) {
      formAnnouncer.textContent = "";
      setTimeout(() => {
        formAnnouncer.textContent = message;
      }, 50);
    }
  }

  function showDivisionError(msg) {
    if (divisionError) {
      divisionError.textContent = msg;
      divisionError.classList.remove("hidden");
      announce(msg);
    }
  }

  function clearDivisionError() {
    if (divisionError) {
      divisionError.textContent = "";
      divisionError.classList.add("hidden");
    }
  }

  function showSubmitError(htmlContent, textSummary) {
    if (submitError) {
      submitError.innerHTML = htmlContent;
      submitError.classList.remove("hidden");
      submitError.scrollIntoView({ behavior: "smooth", block: "center" });
      announce(textSummary || "Gagal mengirim formulir.");
    }
  }

  function clearSubmitError() {
    if (submitError) {
      submitError.innerHTML = "";
      submitError.classList.add("hidden");
    }
  }

  window.PROTIC.announce = announce;
  window.PROTIC.showDivisionError = showDivisionError;
  window.PROTIC.clearDivisionError = clearDivisionError;
  window.PROTIC.showSubmitError = showSubmitError;
  window.PROTIC.clearSubmitError = clearSubmitError;
})();
