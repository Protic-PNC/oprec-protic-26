/**
 * PROTIC Oprec 2026/2027 - Form Main Entry & Lifecycle Bootstrapper (src/js/form/main.js)
 *
 * Mengorkestrasi seluruh modul form saat DOM siap:
 *  - Memuat draf form dari localStorage
 *  - Sinkronisasi UI divisi dan stepper
 *  - Countdown status penutupan pendaftaran (via modul terpusat timer.js)
 *  - Mendeteksi query URL (?manage=true atau #manage) untuk membuka modal kelola otomatis
 *  - Menangani pengalihan mode ubah data dari Beranda (sessionStorage)
 */
window.PROTIC = window.PROTIC || {};

(function () {
  const REGISTRATION_DEADLINE = window.APP_CONFIG?.REGISTRATION_DEADLINE
    ? new Date(window.APP_CONFIG.REGISTRATION_DEADLINE).getTime()
    : new Date("2026-09-18T00:00:00+07:00").getTime();

  // Elemen Deadline & Status Penutupan
  const registrationSection = document.getElementById("registrationSection");
  const closedScreenSection = document.getElementById("closedScreenSection");
  const formTitleContainer = document.getElementById("formTitleContainer");
  const formCountdownWrapper = document.getElementById("formCountdownWrapper");
  const formCountdownDigits = document.getElementById("formCountdownDigits");
  const formStatusBadge = document.getElementById("formStatusBadge");
  const formStatusDot = document.getElementById("formStatusDot");
  const formStatusText = document.getElementById("formStatusText");

  function isRegistrationClosed() {
    return Date.now() >= REGISTRATION_DEADLINE;
  }
  window.PROTIC.isRegistrationClosed = isRegistrationClosed;

  // Inisialisasi awal saat halaman dibuka
  function init() {
    if (window.PROTIC.loadDraft) window.PROTIC.loadDraft();
    if (window.PROTIC.updateDivisionUI) window.PROTIC.updateDivisionUI();
    if (window.PROTIC.updateStepperVisuals) window.PROTIC.updateStepperVisuals();

    // Inisialisasi status deadline (via modul terpusat timer.js)
    if (typeof window.PROTIC.startCountdownInterval === "function") {
      window.PROTIC.startCountdownInterval(REGISTRATION_DEADLINE, ({ formatted, expired }) => {
        const isEditMode = window.PROTIC.formState?.isEditMode;

        if (expired) {
          if (formCountdownWrapper) formCountdownWrapper.classList.add("hidden");
          if (formStatusDot) {
            formStatusDot.classList.remove("bg-lightgreen", "animate-pulse");
            formStatusDot.classList.add("bg-rose-500");
          }
          if (formStatusText) {
            formStatusText.textContent = "Ditutup";
            formStatusText.classList.remove("text-lightergreen");
            formStatusText.classList.add("text-rose-300");
          }
          if (formStatusBadge) {
            formStatusBadge.classList.remove("bg-lightgreen/10", "border-lightgreen/25");
            formStatusBadge.classList.add("bg-rose-500/10", "border-rose-500/25");
          }
          if (!isEditMode) {
            if (registrationSection) registrationSection.classList.add("hidden");
            if (formTitleContainer) formTitleContainer.classList.add("hidden");
            if (closedScreenSection) closedScreenSection.classList.remove("hidden");
          } else {
            if (closedScreenSection) closedScreenSection.classList.add("hidden");
            if (formTitleContainer) formTitleContainer.classList.add("hidden");
            if (registrationSection) registrationSection.classList.remove("hidden");
          }
        } else {
          if (formCountdownWrapper) formCountdownWrapper.classList.remove("hidden");
          if (formCountdownDigits) formCountdownDigits.textContent = formatted;
        }
      });
    }

    // Buka otomatis modal kelola pendaftaran jika diakses via tautan kelola (form.html?manage=true / #manage)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("manage") === "true" || window.location.hash === "#manage") {
        setTimeout(() => {
          if (window.PROTIC.openManageModal) {
            window.PROTIC.openManageModal();
          }
        }, 50);
      }
    } catch (e) {}

    // Tangani pendaftar yang diverifikasi di Beranda dan ingin mengubah data di form.html
    try {
      const redirectEdit = sessionStorage.getItem("protic_edit_applicant");
      if (redirectEdit) {
        sessionStorage.removeItem("protic_edit_applicant");
        const parsed = JSON.parse(redirectEdit);
        if (parsed && parsed.data) {
          if (window.PROTIC.formState) {
            window.PROTIC.formState.currentVerifiedPin = parsed.pin || null;
          }
          setTimeout(() => {
            if (window.PROTIC.startEditMode) {
              window.PROTIC.startEditMode(parsed.data);
            }
          }, 60);
        }
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
