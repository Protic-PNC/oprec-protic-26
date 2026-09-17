/**
 * PROTIC Oprec 2026/2027 - Form Stepper & Step Validation (src/js/form/stepper.js)
 *
 * Mengelola navigasi multi-step (Langkah 1: Biodata, Langkah 2: Divisi, Langkah 3: Berkas),
 * validasi aturan input per langkah, serta indikator visual stepper line dan dots.
 */
window.PROTIC = window.PROTIC || {};

(function () {
  const form = document.getElementById("registrationForm");
  const stepperLine = document.getElementById("stepperLine");
  const stepDot1 = document.getElementById("stepDot1");
  const stepDot2 = document.getElementById("stepDot2");
  const stepDot3 = document.getElementById("stepDot3");
  const stepText1 = document.getElementById("stepText1");
  const stepText2 = document.getElementById("stepText2");
  const stepText3 = document.getElementById("stepText3");
  const step1Error = document.getElementById("step1Error");

  const toStep2Btn = document.getElementById("toStep2Btn");
  const backToStep1Btn = document.getElementById("backToStep1Btn");
  const toStep3Btn = document.getElementById("toStep3Btn");
  const backToStep2Btn = document.getElementById("backToStep2Btn");

  function getCurrentStep() {
    return window.PROTIC.formState.currentStep;
  }

  function setCurrentStep(step) {
    window.PROTIC.formState.currentStep = step;
  }

  function getSelectedDivisions() {
    return window.PROTIC.formState.selectedDivisions || [];
  }

  // Validasi aturan per langkah
  function validateStep(step) {
    if (!form) return true;

    if (step === 1) {
      const fullname = form.fullname ? form.fullname.value.trim() : "";
      const npm = form.npm ? form.npm.value.trim() : "";
      const cls = form.class ? form.class.value.trim() : "";
      const semester = form.semester ? form.semester.value.trim() : "";

      if (!fullname || !npm || !cls || !semester) {
        if (step1Error) {
          step1Error.textContent = "Harap lengkapi semua kolom biodata diri sebelum melanjutkan!";
          step1Error.classList.remove("hidden");
        }
        if (!fullname && form.fullname) form.fullname.focus();
        else if (!npm && form.npm) form.npm.focus();
        else if (!cls && form.class) form.class.focus();
        else if (!semester && form.semester) form.semester.focus();
        if (window.PROTIC.announce) window.PROTIC.announce("Harap lengkapi semua kolom biodata diri.");
        return false;
      }

      if (isNaN(semester) || Number(semester) < 1 || Number(semester) > 8) {
        if (step1Error) {
          step1Error.textContent = "Semester harus berupa angka antara 1 sampai 8!";
          step1Error.classList.remove("hidden");
        }
        if (form.semester) form.semester.focus();
        return false;
      }

      if (step1Error) step1Error.classList.add("hidden");
      return true;
    }

    if (step === 2) {
      const selectedDivisions = getSelectedDivisions();
      if (selectedDivisions.length !== 2) {
        if (window.PROTIC.showDivisionError) {
          window.PROTIC.showDivisionError("Harap pilih tepat 2 divisi (Pilihan 1 & Pilihan 2)!");
        }
        return false;
      }
      if (window.PROTIC.clearDivisionError) window.PROTIC.clearDivisionError();
      return true;
    }

    if (step === 3) {
      const portfolio = form.portfolio ? form.portfolio.value.trim() : "";
      const whatsapp = form.whatsapp ? form.whatsapp.value.trim() : "";
      const email = form.email ? form.email.value.trim() : "";

      // Validasi Portofolio / CV
      if (!portfolio) {
        if (window.PROTIC.showSubmitError) {
          window.PROTIC.showSubmitError("Harap masukkan tautan Portofolio / CV Anda!", "Kolom tautan portofolio wajib diisi.");
        }
        if (form.portfolio) form.portfolio.focus();
        return false;
      }

      if (!portfolio.startsWith("https://")) {
        if (window.PROTIC.showSubmitError) {
          window.PROTIC.showSubmitError("Tautan harus diawali dengan https:// (contoh: https://drive.google.com/...)", "Format tautan portofolio harus diawali https://");
        }
        if (form.portfolio) form.portfolio.focus();
        return false;
      }

      try {
        const urlObj = new URL(portfolio);
        if (urlObj.hostname !== "drive.google.com" && !urlObj.hostname.endsWith(".drive.google.com")) {
          if (window.PROTIC.showSubmitError) {
            window.PROTIC.showSubmitError("Tautan portofolio harus berupa tautan Google Drive (https://drive.google.com/...)!", "Tautan bukan dari Google Drive.");
          }
          if (form.portfolio) form.portfolio.focus();
          return false;
        }
      } catch (e) {
        if (window.PROTIC.showSubmitError) {
          window.PROTIC.showSubmitError("Format tautan Google Drive tidak valid. Pastikan tautan dapat diakses!", "Format URL portofolio tidak valid.");
        }
        if (form.portfolio) form.portfolio.focus();
        return false;
      }

      // Validasi Kontak Aktif
      if (!whatsapp || !email) {
        if (window.PROTIC.showSubmitError) {
          window.PROTIC.showSubmitError("Harap lengkapi nomor WhatsApp dan Email aktif Anda!", "Kolom kontak wajib diisi.");
        }
        if (!whatsapp && form.whatsapp) form.whatsapp.focus();
        else if (form.email) form.email.focus();
        return false;
      }

      if (window.PROTIC.clearSubmitError) window.PROTIC.clearSubmitError();
      return true;
    }

    return true;
  }

  // Transisi antar langkah formulir
  function goToStep(targetStep) {
    const currentStep = getCurrentStep();
    if (targetStep === currentStep) return;

    // Jika maju ke depan, validasi langkah-langkah sebelumnya
    if (targetStep > currentStep) {
      for (let s = currentStep; s < targetStep; s++) {
        if (!validateStep(s)) return;
      }
    }

    // Sembunyikan langkah saat ini
    const currentContainer = document.getElementById(`stepContainer${currentStep}`);
    if (currentContainer) {
      currentContainer.classList.remove("active");
      currentContainer.classList.add("hidden");
    }

    // Tampilkan langkah tujuan
    const targetContainer = document.getElementById(`stepContainer${targetStep}`);
    if (targetContainer) {
      targetContainer.classList.remove("hidden");
      requestAnimationFrame(() => {
        targetContainer.classList.add("active");
      });
    }

    setCurrentStep(targetStep);
    updateStepperVisuals();
    if (window.PROTIC.saveDraft) window.PROTIC.saveDraft();

    // Scroll halus ke posisi form
    if (form) {
      const formTop = form.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, formTop), behavior: "smooth" });
    }

    const stepNames = ["", "Biodata Diri", "Pilihan Divisi", "Berkas & Kontak"];
    if (window.PROTIC.announce) {
      window.PROTIC.announce(`Beralih ke Langkah ${targetStep}: ${stepNames[targetStep] || ""}`);
    }
  }

  // Pembaruan visual indikator stepper
  function updateStepperVisuals() {
    if (!stepperLine || !stepDot1 || !stepDot2 || !stepDot3) return;

    const currentStep = getCurrentStep();
    const selectedDivisions = getSelectedDivisions();

    const isStep1Valid = Boolean(
      form &&
      form.fullname && form.fullname.value.trim() &&
      form.npm && form.npm.value.trim() &&
      form.class && form.class.value.trim() &&
      form.semester && form.semester.value.trim()
    );
    const isStep2Valid = selectedDivisions.length === 2;

    // Garis progress stepper
    if (currentStep === 1) {
      stepperLine.style.width = "0%";
    } else if (currentStep === 2) {
      stepperLine.style.width = "50%";
    } else if (currentStep === 3) {
      stepperLine.style.width = "100%";
    }

    // Indikator Step 1
    if (currentStep > 1 && isStep1Valid) {
      stepDot1.innerHTML = "✓";
      stepDot1.className = "w-8 h-8 rounded-full bg-lightgreen text-darkgreen font-bold text-xs flex items-center justify-center shadow-glow transition-all duration-300 cursor-pointer";
      if (stepText1) stepText1.className = "text-lightergreen font-semibold";
    } else {
      stepDot1.textContent = "1";
      stepDot1.className = currentStep === 1
        ? "w-8 h-8 rounded-full bg-lightgreen text-darkgreen font-bold text-xs flex items-center justify-center shadow-glow transition-all duration-300 cursor-pointer ring-2 ring-lightergreen/60"
        : "w-8 h-8 rounded-full bg-darkgreen border border-white/30 text-white/70 font-semibold text-xs flex items-center justify-center transition-all duration-300 cursor-pointer";
      if (stepText1) stepText1.className = currentStep === 1 ? "text-lightergreen font-bold" : "text-white/60";
    }

    // Indikator Step 2
    if (currentStep > 2 && isStep2Valid) {
      stepDot2.innerHTML = "✓";
      stepDot2.className = "w-8 h-8 rounded-full bg-lightgreen text-darkgreen font-bold text-xs flex items-center justify-center shadow-glow transition-all duration-300 cursor-pointer";
      if (stepText2) stepText2.className = "text-lightergreen font-semibold";
    } else if (currentStep === 2) {
      stepDot2.textContent = "2";
      stepDot2.className = "w-8 h-8 rounded-full bg-lightgreen text-darkgreen font-bold text-xs flex items-center justify-center shadow-glow transition-all duration-300 cursor-pointer ring-2 ring-lightergreen/60";
      if (stepText2) stepText2.className = "text-lightergreen font-bold";
    } else {
      stepDot2.textContent = "2";
      stepDot2.className = "w-8 h-8 rounded-full bg-darkgreen border border-white/30 text-white/70 font-semibold text-xs flex items-center justify-center transition-all duration-300 cursor-pointer";
      if (stepText2) stepText2.className = "text-white/60";
    }

    // Indikator Step 3
    if (currentStep === 3) {
      stepDot3.textContent = "3";
      stepDot3.className = "w-8 h-8 rounded-full bg-lightgreen text-darkgreen font-bold text-xs flex items-center justify-center shadow-glow transition-all duration-300 cursor-pointer ring-2 ring-lightergreen/60";
      if (stepText3) stepText3.className = "text-lightergreen font-bold";
    } else {
      stepDot3.textContent = "3";
      stepDot3.className = "w-8 h-8 rounded-full bg-darkgreen border border-white/30 text-white/70 font-semibold text-xs flex items-center justify-center transition-all duration-300 cursor-pointer";
      if (stepText3) stepText3.className = "text-white/60";
    }
  }

  // Stepper dot click handlers
  if (stepDot1) stepDot1.addEventListener("click", () => goToStep(1));
  if (stepDot2) {
    stepDot2.addEventListener("click", () => {
      const currentStep = getCurrentStep();
      if (currentStep === 3) goToStep(2);
      else if (validateStep(1)) goToStep(2);
    });
  }
  if (stepDot3) {
    stepDot3.addEventListener("click", () => {
      if (validateStep(1) && validateStep(2)) goToStep(3);
    });
  }

  // Navigation button click handlers
  if (toStep2Btn) toStep2Btn.addEventListener("click", () => goToStep(2));
  if (backToStep1Btn) backToStep1Btn.addEventListener("click", () => goToStep(1));
  if (toStep3Btn) toStep3Btn.addEventListener("click", () => goToStep(3));
  if (backToStep2Btn) backToStep2Btn.addEventListener("click", () => goToStep(2));

  // Ekspor ke namespace PROTIC
  window.PROTIC.validateStep = validateStep;
  window.PROTIC.goToStep = goToStep;
  window.PROTIC.updateStepperVisuals = updateStepperVisuals;
})();
