/**
 * PROTIC Oprec 2026/2027 - Form Controller (src/js/form.js)
 *
 * Logika utama untuk halaman formulir pendaftaran (form.html).
 * Bergantung pada: config.js, utils/security.js, utils/timer.js
 *
 * Responsibilities:
 *  - State management (currentStep, selectedDivisions, isEditMode, dll)
 *  - Validasi langkah demi langkah (step 1-3)
 *  - Navigasi stepper multi-step
 *  - Auto-save & restore draft (localStorage)
 *  - Modal: confirm, manage, delete, duplicate
 *  - Fetch ke Google Apps Script (register, verify, update, delete)
 *  - Countdown timer status badge (via window.PROTIC.startCountdownInterval)
 */
const scriptURL =
        window.APP_CONFIG?.SCRIPT_URL ||
        "https://script.google.com/macros/s/AKfycbw_mtEcU_vVhF96O2ACQZkPp_LoV7i88L9b4CNFx5gLkJ9wSiSzBtaA6xkNitoZ-aPo/exec";
      const form = document.getElementById("registrationForm");

      let currentStep = 1;
      let selectedDivisions = [];
      const DRAFT_KEY = "protic_oprec_draft";

      // Division Information Dictionary for Dynamic Preview (Versi Terbaik)
      const divisionInfo = {
        "WEB": {
          name: "Web Development",
          icon: "img/icon/web.svg",
          desc: "Pengembangan website responsif organisasi, rancang bangun frontend & backend, dan integrasi API web.",
          skills: ["HTML/CSS", "JavaScript", "Frameworks", "REST API"]
        },
        "UI/UX": {
          name: "UI/UX Design",
          icon: "img/icon/ui.svg",
          desc: "Riset kebutuhan pengguna, perancangan antarmuka visual UI, wireframing sistematis, dan prototipe interaktif.",
          skills: ["Figma", "Wireframing", "UX Research", "Prototyping"]
        },
        "MOBILE": {
          name: "Mobile Development",
          icon: "img/icon/mobile.svg",
          desc: "Pengembangan aplikasi mobile Android & iOS, integrasi layanan API, dan arsitektur performa app.",
          skills: ["Flutter", "Kotlin", "Mobile UI", "API Integration"]
        },
        "DEVOPS": {
          name: "DevOps & System Admin",
          icon: "img/icon/devops.svg",
          desc: "Pengelolaan server Linux/Cloud, otomasi CI/CD, deployment aplikasi, serta pemantauan keandalan sistem.",
          skills: ["Linux", "Git & CI/CD", "Cloud/Server", "Docker"]
        },
        "DATA": {
          name: "Data & Artificial Intelligence",
          icon: "img/icon/data.svg",
          desc: "Pengolahan & visualisasi data organisasi, otomasi analitik, serta pengenalan dasar kecerdasan buatan.",
          skills: ["Python", "Data Mining", "AI Basics", "Visualization"]
        },
        "HUMAS": {
          name: "Humas (Hubungan Masyarakat)",
          icon: "img/icon/humas.svg",
          desc: "Komunikasi eksternal & internal organisasi, perluasan networking industri, dan kolaborasi kemitraan.",
          skills: ["Public Relations", "Networking", "Partnership", "Event Handling"]
        },
        "KOMINFO": {
          name: "Kominfo",
          icon: "img/icon/kominfo.svg",
          desc: "Branding media sosial organisasi, pembuatan konten grafis kreatif, dokumentasi multimedia, dan publikasi.",
          skills: ["Content Creation", "Social Media", "Desain Grafis", "Copywriting"]
        },
        "SEKRETARIS": {
          name: "Sekretaris",
          icon: "img/icon/sekretaris.svg",
          desc: "Pengelolaan administrasi resmi organisasi, persuratan, notulensi rapat, serta pengarsipan dokumen dan proposal kegiatan.",
          skills: ["Administrasi", "Notulensi", "Persuratan", "Dokumentasi"]
        },
        "SEKRE": {
          name: "Sekretaris",
          icon: "img/icon/sekretaris.svg",
          desc: "Pengelolaan administrasi resmi organisasi, persuratan, notulensi rapat, serta pengarsipan dokumen dan proposal kegiatan.",
          skills: ["Administrasi", "Notulensi", "Persuratan", "Dokumentasi"]
        },
        "BENDAHARA": {
          name: "Bendahara",
          icon: "img/icon/bendahara.svg",
          desc: "Pengelolaan keuangan organisasi, budgeting program kerja, pencatatan cash flow kas, serta penyusunan LPJ keuangan.",
          skills: ["Budgeting", "Bookkeeping", "Cash Flow", "LPJ Keuangan"]
        }
      };

      // Subtle Link & Manage Modal (Opsi C)
      const openManageModalBtn = document.getElementById("openManageModalBtn");
      const manageModal = document.getElementById("manageModal");
      const closeManageModalBtn = document.getElementById("closeManageModalBtn");
      const registrationSection = document.getElementById("registrationSection");
      const editModeBanner = document.getElementById("editModeBanner");
      const editModeApplicantName = document.getElementById("editModeApplicantName");
      const cancelEditBtn = document.getElementById("cancelEditBtn");

      // Registration Deadline & Closed State Elements (Centralized Config)
      const REGISTRATION_DEADLINE = window.APP_CONFIG?.REGISTRATION_DEADLINE
        ? new Date(window.APP_CONFIG.REGISTRATION_DEADLINE).getTime()
        : new Date("2026-09-18T00:00:00+07:00").getTime();
      const closedScreenSection = document.getElementById("closedScreenSection");
      const closedScreenManageBtn = document.getElementById("closedScreenManageBtn");
      const formTitleContainer = document.getElementById("formTitleContainer");
      const formCountdownWrapper = document.getElementById("formCountdownWrapper");
      const formCountdownDigits = document.getElementById("formCountdownDigits");
      const formStatusBadge = document.getElementById("formStatusBadge");
      const formStatusDot = document.getElementById("formStatusDot");
      const formStatusText = document.getElementById("formStatusText");

      // Manage Section Elements
      const manageVerifyCard = document.getElementById("manageVerifyCard");
      const managePreviewCard = document.getElementById("managePreviewCard");
      const deleteSuccessBanner = document.getElementById("deleteSuccessBanner");
      const verifyNpm = document.getElementById("verifyNpm");
      const verifyPin = document.getElementById("verifyPin");
      const btnCheckRegistration = document.getElementById("btnCheckRegistration");
      const btnCheckText = document.getElementById("btnCheckText");
      const btnCheckLoading = document.getElementById("btnCheckLoading");
      const verifyError = document.getElementById("verifyError");
      const btnExitManage = document.getElementById("btnExitManage");
      const btnStartEdit = document.getElementById("btnStartEdit");
      const btnOpenDeleteModal = document.getElementById("btnOpenDeleteModal");
      const btnBackToNewRegister = document.getElementById("btnBackToNewRegister");

      // Card Preview Elements
      const cardApplicantName = document.getElementById("cardApplicantName");
      const cardApplicantNpm = document.getElementById("cardApplicantNpm");
      const cardClassSemester = document.getElementById("cardClassSemester");
      const cardWhatsapp = document.getElementById("cardWhatsapp");
      const cardEmail = document.getElementById("cardEmail");
      const cardDivisionsBadge = document.getElementById("cardDivisionsBadge");
      const cardPortfolioLink = document.getElementById("cardPortfolioLink");

      // Delete Modal Elements
      const deleteModal = document.getElementById("deleteModal");
      const deleteTargetName = document.getElementById("deleteTargetName");
      const deleteTargetNpm = document.getElementById("deleteTargetNpm");
      const deleteCancelBtn = document.getElementById("deleteCancelBtn");
      const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");
      const deleteBtnText = document.getElementById("deleteBtnText");
      const deleteBtnLoading = document.getElementById("deleteBtnLoading");

      // Duplicate Modal Elements
      const duplicateModal = document.getElementById("duplicateModal");
      const duplicateNpmText = document.getElementById("duplicateNpmText");
      const duplicateCloseBtn = document.getElementById("duplicateCloseBtn");
      const duplicateGoManageBtn = document.getElementById("duplicateGoManageBtn");

      // Step Containers
      const stepContainer1 = document.getElementById("stepContainer1");
      const stepContainer2 = document.getElementById("stepContainer2");
      const stepContainer3 = document.getElementById("stepContainer3");

      // Stepper Elements
      const stepDot1 = document.getElementById("stepDot1");
      const stepDot2 = document.getElementById("stepDot2");
      const stepDot3 = document.getElementById("stepDot3");
      const stepperLine = document.getElementById("stepperLine");
      const stepText1 = document.getElementById("stepText1");
      const stepText2 = document.getElementById("stepText2");
      const stepText3 = document.getElementById("stepText3");

      // Error and notification elements
      const step1Error = document.getElementById("step1Error");
      const divisionError = document.getElementById("divisionError");
      const divisionCounter = document.getElementById("divisionCounter");
      const divisionButtons = document.querySelectorAll(".division-btn");
      const divisionPreviewContainer = document.getElementById("divisionPreviewContainer");
      const formAnnouncer = document.getElementById("formAnnouncer");

      // Step Navigation Buttons
      const toStep2Btn = document.getElementById("toStep2Btn");
      const backToStep1Btn = document.getElementById("backToStep1Btn");
      const toStep3Btn = document.getElementById("toStep3Btn");
      const backToStep2Btn = document.getElementById("backToStep2Btn");

      // Confirm Modal & Elements
      const confirmModal = document.getElementById("confirmModal");
      const modalCancelBtn = document.getElementById("modalCancelBtn");
      const modalConfirmBtn = document.getElementById("modalConfirmBtn");
      const confirmDriveAccess = document.getElementById("confirmDriveAccess");
      const summaryName = document.getElementById("summaryName");
      const summaryNpm = document.getElementById("summaryNpm");
      const summaryClass = document.getElementById("summaryClass");
      const summaryDivisions = document.getElementById("summaryDivisions");
      const summaryPortfolio = document.getElementById("summaryPortfolio");

      // Submit State Elements
      const submitBtn = document.getElementById("submitBtn");
      const btnText = document.getElementById("btnText");
      const btnLoading = document.getElementById("btnLoading");
      const submitError = document.getElementById("submitError");

      let pendingFormData = null;
      let isEditMode = false;
      let verifiedApplicantData = null;
      let currentVerifiedPin = null;

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

      // Step Validation Logic
      function validateStep(step) {
        if (step === 1) {
          const fullname = form.fullname.value.trim();
          const npm = form.npm.value.trim();
          const cls = form.class.value.trim();
          const semester = form.semester.value.trim();

          if (!fullname || !npm || !cls || !semester) {
            if (step1Error) {
              step1Error.textContent = "Harap lengkapi semua kolom biodata diri sebelum melanjutkan!";
              step1Error.classList.remove("hidden");
            }
            if (!fullname) form.fullname.focus();
            else if (!npm) form.npm.focus();
            else if (!cls) form.class.focus();
            else if (!semester) form.semester.focus();
            announce("Harap lengkapi semua kolom biodata diri.");
            return false;
          }

          if (isNaN(semester) || Number(semester) < 1 || Number(semester) > 8) {
            if (step1Error) {
              step1Error.textContent = "Semester harus berupa angka antara 1 sampai 8!";
              step1Error.classList.remove("hidden");
            }
            form.semester.focus();
            return false;
          }

          if (step1Error) step1Error.classList.add("hidden");
          return true;
        }

        if (step === 2) {
          if (selectedDivisions.length !== 2) {
            showDivisionError("Harap pilih tepat 2 divisi (Pilihan 1 & Pilihan 2)!");
            return false;
          }
          clearDivisionError();
          return true;
        }

        if (step === 3) {
          const portfolio = form.portfolio.value.trim();
          const whatsapp = form.whatsapp.value.trim();
          const email = form.email.value.trim();

          // Validasi Portofolio / CV
          if (!portfolio) {
            showSubmitError("Harap masukkan tautan Portofolio / CV Anda!", "Kolom tautan portofolio wajib diisi.");
            form.portfolio.focus();
            return false;
          }

          if (!portfolio.startsWith("https://")) {
            showSubmitError("Tautan harus diawali dengan https:// (contoh: https://drive.google.com/...)", "Format tautan portofolio harus diawali https://");
            form.portfolio.focus();
            return false;
          }

          try {
            const urlObj = new URL(portfolio);
            if (urlObj.hostname !== "drive.google.com" && !urlObj.hostname.endsWith(".drive.google.com")) {
              showSubmitError("Tautan portofolio harus berupa tautan Google Drive (https://drive.google.com/...)!", "Tautan bukan dari Google Drive.");
              form.portfolio.focus();
              return false;
            }
          } catch (e) {
            showSubmitError("Format tautan Google Drive tidak valid. Pastikan tautan dapat diakses!", "Format URL portofolio tidak valid.");
            form.portfolio.focus();
            return false;
          }

          // Validasi Kontak Aktif
          if (!whatsapp || !email) {
            showSubmitError("Harap lengkapi nomor WhatsApp dan Email aktif Anda!", "Kolom kontak wajib diisi.");
            if (!whatsapp) form.whatsapp.focus();
            else form.email.focus();
            return false;
          }
          clearSubmitError();
          return true;
        }

        return true;
      }

      // Transition between Steps
      function goToStep(targetStep) {
        if (targetStep === currentStep) return;

        // If navigating forward, validate preceding steps
        if (targetStep > currentStep) {
          for (let s = currentStep; s < targetStep; s++) {
            if (!validateStep(s)) return;
          }
        }

        // Hide current step
        const currentContainer = document.getElementById(`stepContainer${currentStep}`);
        if (currentContainer) {
          currentContainer.classList.remove("active");
          currentContainer.classList.add("hidden");
        }

        // Show target step
        const targetContainer = document.getElementById(`stepContainer${targetStep}`);
        if (targetContainer) {
          targetContainer.classList.remove("hidden");
          requestAnimationFrame(() => {
            targetContainer.classList.add("active");
          });
        }

        currentStep = targetStep;
        updateStepperVisuals();
        saveDraft();

        // Scroll to form smoothly
        const formTop = form.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: Math.max(0, formTop), behavior: "smooth" });

        const stepNames = ["", "Biodata Diri", "Pilihan Divisi", "Berkas & Kontak"];
        announce(`Beralih ke Langkah ${targetStep}: ${stepNames[targetStep]}`);
      }

      // Update Visual Stepper
      function updateStepperVisuals() {
        if (!stepperLine || !stepDot1 || !stepDot2 || !stepDot3) return;

        const isStep1Valid = Boolean(
          form.fullname && form.fullname.value.trim() &&
          form.npm && form.npm.value.trim() &&
          form.class && form.class.value.trim() &&
          form.semester && form.semester.value.trim()
        );
        const isStep2Valid = selectedDivisions.length === 2;

        // Stepper Progress Line
        if (currentStep === 1) {
          stepperLine.style.width = "0%";
        } else if (currentStep === 2) {
          stepperLine.style.width = "50%";
        } else if (currentStep === 3) {
          stepperLine.style.width = "100%";
        }

        // Step 1 Indicator
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

        // Step 2 Indicator
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

        // Step 3 Indicator
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

      // Dynamic Division Preview (Versi Terbaik: Unified Compact Panel)
      function updateDivisionPreview() {
        if (!divisionPreviewContainer) return;

        if (selectedDivisions.length === 0) {
          divisionPreviewContainer.innerHTML = `
            <div class="py-2.5 px-3.5 rounded-lg bg-white/[0.03] border border-white/10 text-white/50 text-xs text-center flex items-center justify-center gap-2">
              <span class="text-sm" aria-hidden="true">💡</span>
              <span>Pilih divisi di atas untuk melihat ringkasan tugas & fokus keahlian.</span>
            </div>
          `;
          return;
        }

        let html = `
          <div class="rounded-lg bg-black/40 border border-white/15 divide-y divide-white/10 overflow-hidden shadow-md animate-fadeIn">
        `;

        // Pilihan 1
        const div1Key = selectedDivisions[0];
        const info1 = divisionInfo[div1Key];
        html += `
          <div class="p-3 flex items-start justify-between gap-2.5 bg-white/[0.01]">
            <div class="flex items-start gap-2.5 min-w-0">
              <span class="w-5 h-5 rounded bg-lightgreen/20 text-lightergreen font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div class="min-w-0">
                <div class="flex items-baseline gap-2">
                  <h4 class="font-bold text-xs sm:text-sm text-white tracking-wide truncate">${info1.name}</h4>
                  <span class="text-[10px] text-lightergreen font-semibold uppercase tracking-wider shrink-0">Pilihan 1</span>
                </div>
                <p class="text-[11px] sm:text-xs text-white/80 leading-relaxed mt-0.5">
                  ${info1.desc}
                </p>
                <p class="text-[10px] text-white/45 mt-1 font-mono">
                  Skill: ${info1.skills.join(" · ")}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="text-white/40 hover:text-red-400 text-xs font-medium py-0.5 px-1.5 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              title="Batalkan ${info1.name}"
              aria-label="Batalkan ${info1.name}"
              onclick="toggleDivision('${div1Key}')"
            >
              Batal
            </button>
          </div>
        `;

        // Pilihan 2
        if (selectedDivisions.length > 1) {
          const div2Key = selectedDivisions[1];
          const info2 = divisionInfo[div2Key];
          html += `
            <div class="p-3 flex items-start justify-between gap-2.5 bg-white/[0.01]">
              <div class="flex items-start gap-2.5 min-w-0">
                <span class="w-5 h-5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div class="min-w-0">
                  <div class="flex items-baseline gap-2">
                    <h4 class="font-bold text-xs sm:text-sm text-white tracking-wide truncate">${info2.name}</h4>
                    <span class="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider shrink-0">Pilihan 2</span>
                  </div>
                  <p class="text-[11px] sm:text-xs text-white/80 leading-relaxed mt-0.5">
                    ${info2.desc}
                  </p>
                  <p class="text-[10px] text-white/45 mt-1 font-mono">
                    Skill: ${info2.skills.join(" · ")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="text-white/40 hover:text-red-400 text-xs font-medium py-0.5 px-1.5 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="Batalkan ${info2.name}"
                aria-label="Batalkan ${info2.name}"
                onclick="toggleDivision('${div2Key}')"
              >
                Batal
              </button>
            </div>
          `;
        } else {
          html += `
            <div class="py-2 px-3 flex items-center gap-2 text-[11px] sm:text-xs text-white/45 bg-black/20">
              <span class="w-5 h-5 rounded bg-white/10 text-white/40 font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <span>Pilih 1 divisi lagi di atas sebagai Pilihan 2</span>
            </div>
          `;
        }

        html += `</div>`;
        divisionPreviewContainer.innerHTML = html;
      }

      // Global function to toggle division from buttons or preview card cancel icon
      window.toggleDivision = function(division) {
        if (selectedDivisions.includes(division)) {
          selectedDivisions = selectedDivisions.filter((d) => d !== division);
          clearDivisionError();
          updateDivisionUI();
          saveDraft();
          announce(`Pilihan divisi ${division} dibatalkan. ${selectedDivisions.length} dari 2 divisi terpilih.`);
        } else {
          if (selectedDivisions.length < 2) {
            selectedDivisions.push(division);
            clearDivisionError();
            updateDivisionUI();
            saveDraft();
            announce(`Divisi ${division} dipilih. ${selectedDivisions.length} dari 2 divisi terpilih.`);
          } else {
            showDivisionError("Kamu hanya boleh memilih maksimal 2 divisi!");
          }
        }
      };

      // Division UI update
      function updateDivisionUI() {
        const count = selectedDivisions.length;
        if (divisionCounter) {
          divisionCounter.textContent = `${count} / 2 dipilih`;
          if (count === 2) {
            divisionCounter.classList.add("complete");
          } else {
            divisionCounter.classList.remove("complete");
          }
        }

        divisionButtons.forEach((btn) => {
          const div = btn.dataset.division;
          const isSelected = selectedDivisions.includes(div);
          btn.setAttribute("aria-pressed", isSelected ? "true" : "false");

          if (isSelected) {
            btn.classList.add("active", "selected");
          } else {
            btn.classList.remove("active", "selected");
          }

          if (count >= 2 && !isSelected) {
            btn.disabled = true;
            btn.classList.add("disabled");
          } else {
            btn.disabled = false;
            btn.classList.remove("disabled");
          }
        });

        updateDivisionPreview();
        updateStepperVisuals();
      }

      // Division button click events
      divisionButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          toggleDivision(btn.dataset.division);
        });
      });

      // Stepper dot click handlers
      if (stepDot1) stepDot1.addEventListener("click", () => goToStep(1));
      if (stepDot2) {
        stepDot2.addEventListener("click", () => {
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

      // Auto-Save Draft Functions
      function updateClearDraftBtnVisibility() {
        const clearDraftBtn = document.getElementById("clearDraftBtn");
        if (!clearDraftBtn) return;
        const hasDraft = Boolean(localStorage.getItem(DRAFT_KEY));
        // Jika bukan edit mode dan ada draf, tampilkan opsi Bersihkan Draf
        if (!isEditMode && hasDraft) {
          clearDraftBtn.classList.remove("hidden");
        } else {
          clearDraftBtn.classList.add("hidden");
        }
      }

      function saveDraft() {
        try {
          const draft = {
            fullname: form.fullname ? form.fullname.value : "",
            npm: form.npm ? form.npm.value : "",
            class: form.class ? form.class.value : "",
            semester: form.semester ? form.semester.value : "",
            selectedDivisions: selectedDivisions,
            portfolio: form.portfolio ? form.portfolio.value : "",
            whatsapp: form.whatsapp ? form.whatsapp.value : "",
            email: form.email ? form.email.value : "",
            currentStep: currentStep,
            isEditMode: isEditMode,
            verifiedApplicantData: isEditMode ? verifiedApplicantData : null,
            currentVerifiedPin: isEditMode ? currentVerifiedPin : null,
            savedAt: Date.now(),
          };
          localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
          updateClearDraftBtnVisibility();
        } catch (e) {
          console.warn("Gagal menyimpan draf form ke localStorage", e);
        }
      }

      function loadDraft() {
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
            const validDivisions = [
              "WEB",
              "UI/UX",
              "MOBILE",
              "DEVOPS",
              "DATA",
              "HUMAS",
              "KOMINFO",
              "SEKRETARIS",
              "SEKRE",
              "BENDAHARA",
            ];
            selectedDivisions = draft.selectedDivisions.filter((d) => validDivisions.includes(d)).slice(0, 2);
          }

          // Pulihkan Status Mode Ubah Data jika pengguna sebelumnya keluar saat sedang mengedit
          if (draft.isEditMode && draft.verifiedApplicantData) {
            if (typeof applyEditMode === "function") {
              applyEditMode(draft.verifiedApplicantData, draft.currentVerifiedPin);
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

      // ==========================================
      // TOAST NOTIFICATION SYSTEM (BOTTOM-CENTER)
      // ==========================================
      const toastContainer = document.getElementById("toastContainer");
      let activeToastTimeout = null;

      function showToast({ message, type = "success", action = null, duration = 3500 }) {
        if (!toastContainer) return;

        if (activeToastTimeout) {
          clearTimeout(activeToastTimeout);
          activeToastTimeout = null;
        }
        toastContainer.innerHTML = "";

        const toast = document.createElement("div");
        toast.className =
          "pointer-events-auto w-full bg-[#0d2217]/95 border border-lightgreen/40 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-md rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-white transition-all duration-300 transform translate-y-4 opacity-0";

        let iconHtml = "";
        if (type === "success") {
          iconHtml = `<span class="w-7 h-7 rounded-full bg-lightgreen/20 text-lightergreen border border-lightgreen/40 flex items-center justify-center font-bold text-xs shrink-0">✓</span>`;
        } else if (type === "error") {
          iconHtml = `<span class="w-7 h-7 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 flex items-center justify-center font-bold text-xs shrink-0">✕</span>`;
        } else {
          iconHtml = `<span class="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0">ℹ</span>`;
        }

        let actionBtnHtml = "";
        if (action && action.label) {
          actionBtnHtml = `
            <button
              type="button"
              id="toastActionBtn"
              class="py-1.5 px-3.5 rounded-xl bg-lightgreen hover:bg-lightergreen text-darkgreen font-bold text-xs shadow-glow transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              ${action.label}
            </button>
          `;
        }

        toast.innerHTML = `
          <div class="flex items-center gap-2.5 min-w-0">
            ${iconHtml}
            <p class="text-xs sm:text-sm text-white/90 leading-snug font-medium truncate sm:whitespace-normal">
              ${message}
            </p>
          </div>
          ${actionBtnHtml}
        `;

        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
          toast.classList.remove("translate-y-4", "opacity-0");
          toast.classList.add("translate-y-0", "opacity-100");
        });

        if (action && action.onClick) {
          const actionBtn = toast.querySelector("#toastActionBtn");
          if (actionBtn) {
            actionBtn.addEventListener("click", () => {
              dismissToast(toast);
              action.onClick();
            });
          }
        }

        if (duration > 0) {
          activeToastTimeout = setTimeout(() => {
            dismissToast(toast);
          }, duration);
        }

        announce(message);
      }

      function dismissToast(toastEl) {
        if (!toastEl) return;
        toastEl.classList.remove("translate-y-0", "opacity-100");
        toastEl.classList.add("translate-y-4", "opacity-0");
        setTimeout(() => {
          if (toastEl.parentElement) toastEl.remove();
        }, 300);
      }

      let lastClearedDraft = null;

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
        cancelEditMode(true);

        showToast({
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
                  updateDivisionUI();
                  updateStepperVisuals();
                  showToast({
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

      const clearDraftBtn = document.getElementById("clearDraftBtn");
      if (clearDraftBtn) {
        clearDraftBtn.addEventListener("click", handleClearDraft);
      }

      // Input listener to auto-save and update visuals
      form.addEventListener("input", () => {
        updateStepperVisuals();
        saveDraft();
      });

      // Drive Access Checklist Listener inside confirmModal
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

      // Close modal on cancel button
      if (modalCancelBtn && confirmModal) {
        modalCancelBtn.addEventListener("click", () => {
          confirmModal.close();
          submitBtn.focus();
        });
      }

      // Close modal when clicking outside on backdrop
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
            submitBtn.focus();
          }
        });

        confirmModal.addEventListener("close", () => {
          if (!pendingFormData) {
            submitBtn.focus();
          }
        });
      }

      // Buka / Tutup Modal Kelola Pendaftaran (Opsi C)
      function openManageModal() {
        if (manageModal && typeof manageModal.showModal === "function") {
          showManageView("verify");
          clearVerifyError();
          manageModal.showModal();
          announce("Dialog kelola pendaftaran terbuka.");
          if (verifyNpm) setTimeout(() => verifyNpm.focus(), 80);
        }
      }

      function closeManageModal() {
        if (manageModal && manageModal.open) {
          manageModal.close();
        }
      }

      if (openManageModalBtn) openManageModalBtn.addEventListener("click", openManageModal);
      if (closedScreenManageBtn) closedScreenManageBtn.addEventListener("click", openManageModal);
      if (closeManageModalBtn) closeManageModalBtn.addEventListener("click", closeManageModal);

      if (manageModal) {
        manageModal.addEventListener("click", (e) => {
          const rect = manageModal.getBoundingClientRect();
          const isInDialog =
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width;
          if (!isInDialog) {
            closeManageModal();
          }
        });
      }

      // Sub-view Switcher inside Manage Modal
      function showManageView(viewName) {
        if (viewName === "preview") {
          manageVerifyCard.classList.add("hidden");
          managePreviewCard.classList.remove("hidden");
          deleteSuccessBanner.classList.add("hidden");
        } else if (viewName === "deleteSuccess") {
          manageVerifyCard.classList.add("hidden");
          managePreviewCard.classList.add("hidden");
          deleteSuccessBanner.classList.remove("hidden");
        } else {
          manageVerifyCard.classList.remove("hidden");
          managePreviewCard.classList.add("hidden");
          deleteSuccessBanner.classList.add("hidden");
          if (verifyPin) verifyPin.value = "";
        }
      }

      function showVerifyError(msg) {
        if (verifyError) {
          verifyError.innerHTML = msg;
          verifyError.classList.remove("hidden");
          announce(msg);
        }
      }

      function clearVerifyError() {
        if (verifyError) {
          verifyError.innerHTML = "";
          verifyError.classList.add("hidden");
        }
      }

      function setVerifyLoading(loading) {
        if (!btnCheckRegistration || !btnCheckText || !btnCheckLoading) return;
        btnCheckRegistration.disabled = loading;
        if (loading) {
          btnCheckText.classList.add("hidden");
          btnCheckLoading.classList.remove("hidden");
        } else {
          btnCheckText.classList.remove("hidden");
          btnCheckLoading.classList.add("hidden");
        }
      }

      function setDeleteLoading(loading) {
        if (!deleteConfirmBtn || !deleteBtnText || !deleteBtnLoading) return;
        deleteConfirmBtn.disabled = loading;
        if (loading) {
          deleteBtnText.classList.add("hidden");
          deleteBtnLoading.classList.remove("hidden");
        } else {
          deleteBtnText.classList.remove("hidden");
          deleteBtnLoading.classList.add("hidden");
        }
      }

      // Populate Data ke Kartu Ringkasan (Preview First)
      function populatePreviewCard(data) {
        if (!data) return;
        if (cardApplicantName) cardApplicantName.textContent = data.fullname || "-";
        if (cardApplicantNpm) cardApplicantNpm.textContent = `NPM: ${data.npm || "-"}`;
        if (cardClassSemester) cardClassSemester.textContent = `${data.class || "-"} (Semester ${data.semester || "-"})`;
        if (cardWhatsapp) cardWhatsapp.textContent = data.whatsapp || "-";
        if (cardEmail) cardEmail.textContent = data.email || "-";

        if (cardPortfolioLink) {
          if (data.portfolio && data.portfolio.trim()) {
            cardPortfolioLink.href = data.portfolio.trim();
            cardPortfolioLink.textContent = data.portfolio.trim();
            cardPortfolioLink.classList.remove("opacity-50", "pointer-events-none");
          } else {
            cardPortfolioLink.href = "#";
            cardPortfolioLink.textContent = "(Tidak mencantumkan tautan portofolio)";
            cardPortfolioLink.classList.add("opacity-50", "pointer-events-none");
          }
        }

        if (cardDivisionsBadge) {
          cardDivisionsBadge.innerHTML = "";
          const divs = [data.division1, data.division2].filter(Boolean);
          divs.forEach((d, idx) => {
            const badge = document.createElement("span");
            badge.className = "inline-flex items-center gap-1.5 py-1 px-2.5 rounded bg-lightgreen/20 text-lightergreen font-semibold text-xs border border-lightgreen/35";
            badge.innerHTML = `<span class="w-4 h-4 rounded bg-lightgreen/30 text-white font-bold text-[10px] flex items-center justify-center">${idx + 1}</span> <span>${d}</span>`;
            cardDivisionsBadge.appendChild(badge);
          });
        }
      }

      // Verifikasi Identitas Pendaftar (NPM + 4 Digit WA)
      async function handleVerifyRegistration() {
        const npm = verifyNpm ? verifyNpm.value.trim() : "";
        const pin = verifyPin ? verifyPin.value.trim() : "";

        if (!npm) {
          showVerifyError("Harap masukkan NPM Anda!");
          if (verifyNpm) verifyNpm.focus();
          return;
        }

        if (!pin || pin.length !== 4) {
          showVerifyError("PIN verifikasi harus berupa 4 digit terakhir nomor WhatsApp Anda!");
          if (verifyPin) verifyPin.focus();
          return;
        }

        clearVerifyError();
        setVerifyLoading(true);
        announce("Memeriksa data pendaftaran ke server, mohon tunggu...");

        try {
          const res = await fetch(scriptURL, {
            method: "POST",
            body: JSON.stringify({
              action: "verify",
              npm: npm,
              pin: pin,
            }),
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const result = await res.json();

          if (result.result === "success" && result.data) {
            // Deteksi jika Google Apps Script di Google Drive masih versi lama
            if (!result.data.fullname && !result.data.class && !result.data.whatsapp) {
              showVerifyError("⚠️ <strong>Perhatian:</strong> Skrip Apps Script di Google Drive belum diperbarui dengan kode terbaru dari <code>script/regist.gs</code>. Silakan salin isi file <code>script/regist.gs</code> ke Google Apps Script Spreadsheet Anda.");
              return;
            }

            verifiedApplicantData = result.data;
            currentVerifiedPin = pin;
            populatePreviewCard(result.data);
            showManageView("preview");
            announce(`Data pendaftaran atas nama ${result.data.fullname} berhasil diverifikasi.`);
          } else if (result.result === "not_found") {
            showVerifyError("❌ Data pendaftaran dengan NPM tersebut tidak ditemukan.");
          } else if (result.result === "invalid_pin") {
            showVerifyError("❌ 4 digit nomor WhatsApp tidak cocok dengan data pendaftaran yang tersimpan.");
          } else {
            showVerifyError(result.message || "Gagal memverifikasi identitas.");
          }
        } catch (err) {
          console.error("Error verifying:", err);
          showVerifyError("Gagal menghubungi server. Pastikan koneksi internet aktif dan coba lagi.");
        } finally {
          setVerifyLoading(false);
        }
      }

      if (btnCheckRegistration) {
        btnCheckRegistration.addEventListener("click", handleVerifyRegistration);
      }

      if (verifyPin) {
        verifyPin.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleVerifyRegistration();
          }
        });
      }

      // Tombol Ganti NPM / Keluar dari Preview
      if (btnExitManage) {
        btnExitManage.addEventListener("click", () => {
          verifiedApplicantData = null;
          currentVerifiedPin = null;
          showManageView("verify");
        });
      }

      // Tombol Kembali ke Pendaftaran Baru setelah Hapus Sukses
      if (btnBackToNewRegister) {
        btnBackToNewRegister.addEventListener("click", () => {
          closeManageModal();
          cancelEditMode(true);
        });
      }

      // Mode Edit: Menerapkan Tampilan UI Mode Ubah Data
      function applyEditMode(data, pin) {
        if (!data) return;
        isEditMode = true;
        verifiedApplicantData = data;
        if (pin) currentVerifiedPin = pin;

        if (form.npm) {
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
        const modalConfirmBtnText = document.getElementById("modalConfirmBtnText");
        if (modalConfirmBtnText) modalConfirmBtnText.innerHTML = "Simpan Perubahan &rarr;";
        updateClearDraftBtnVisibility();
      }

      // Mode Edit: Mengisi Data Lama ke Form & Beralih ke Form Step 1
      function startEditMode(data) {
        if (!data) return;
        closeManageModal();

        if (form.fullname) form.fullname.value = data.fullname || "";
        if (form.npm) form.npm.value = data.npm || "";
        if (form.class) form.class.value = data.class || "";
        if (form.semester) form.semester.value = data.semester || "";
        if (form.portfolio) form.portfolio.value = data.portfolio || "";
        if (form.whatsapp) form.whatsapp.value = data.whatsapp || "";
        if (form.email) form.email.value = data.email || "";

        selectedDivisions = [data.division1, data.division2].filter(Boolean);

        applyEditMode(data, currentVerifiedPin);
        updateDivisionUI();
        updateStepperVisuals();
        saveDraft(); // Langsung amankan sesi Edit Mode ke localStorage!

        goToStep(1);
        announce("Mode Ubah Data aktif. Silakan perbarui data Anda dan kirim kembali.");
        updateFormStatusUI();
      }

      function cancelEditMode(resetAll = false) {
        isEditMode = false;
        verifiedApplicantData = null;
        currentVerifiedPin = null;

        if (form.npm) {
          form.npm.readOnly = false;
          form.npm.classList.remove("opacity-70", "cursor-not-allowed");
        }
        if (editModeBanner) editModeBanner.classList.add("hidden");
        if (btnText) btnText.innerHTML = "Kirim Pendaftaran &rarr;";
        const modalConfirmBtnText = document.getElementById("modalConfirmBtnText");
        if (modalConfirmBtnText) modalConfirmBtnText.innerHTML = "Kirim Sekarang &rarr;";

        clearDraft(); // Selalu bersihkan draf saat keluar dari mode edit

        if (resetAll) {
          form.reset();
          selectedDivisions = [];
          updateDivisionUI();
          updateStepperVisuals();
          goToStep(1);
        }
        updateClearDraftBtnVisibility();
        updateFormStatusUI();
      }

      if (btnStartEdit) {
        btnStartEdit.addEventListener("click", () => {
          if (verifiedApplicantData) {
            startEditMode(verifiedApplicantData);
          }
        });
      }

      if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", () => {
          cancelEditMode(true);
          announce("Mode ubah data dibatalkan.");
        });
      }

      // Hard Delete Modal Handling
      if (btnOpenDeleteModal && deleteModal) {
        btnOpenDeleteModal.addEventListener("click", () => {
          if (!verifiedApplicantData) return;
          if (deleteTargetName) deleteTargetName.textContent = verifiedApplicantData.fullname || "Pendaftar";
          if (deleteTargetNpm) deleteTargetNpm.textContent = verifiedApplicantData.npm || "-";
          if (typeof deleteModal.showModal === "function") {
            deleteModal.showModal();
          }
        });
      }

      if (deleteCancelBtn && deleteModal) {
        deleteCancelBtn.addEventListener("click", () => {
          deleteModal.close();
        });
      }

      if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener("click", async () => {
          if (!verifiedApplicantData || !currentVerifiedPin) return;

          setDeleteLoading(true);
          announce("Menghapus data pendaftaran secara permanen...");

          try {
            const res = await fetch(scriptURL, {
              method: "POST",
              body: JSON.stringify({
                action: "delete",
                npm: verifiedApplicantData.npm,
                pin: currentVerifiedPin,
              }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const result = await res.json();

            if (result.result === "success") {
              if (deleteModal && deleteModal.open) deleteModal.close();
              clearDraft();
              cancelEditMode(true);
              verifiedApplicantData = null;
              currentVerifiedPin = null;
              showManageView("deleteSuccess");
              announce("Pendaftaran Anda telah berhasil dihapus secara permanen dari sistem.");
              showToast({
                message: "Pendaftaran berhasil dihapus secara permanen.",
                type: "success",
                duration: 4000,
              });
            } else {
              showToast({
                message: result.message || "Gagal menghapus pendaftaran.",
                type: "error",
                duration: 4000,
              });
            }
          } catch (err) {
            console.error("Error deleting:", err);
            showToast({
              message: "Terjadi kesalahan jaringan saat menghapus pendaftaran. Silakan coba lagi.",
              type: "error",
              duration: 4000,
            });
          } finally {
            setDeleteLoading(false);
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
          const attemptedNpm = form.npm ? form.npm.value.trim() : "";
          openManageModal();
          if (verifyNpm && attemptedNpm) {
            verifyNpm.value = attemptedNpm;
            if (verifyPin) verifyPin.focus();
          }
        });
      }

      // Form submit: validasi Step 3 & buka modal konfirmasi
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearSubmitError();

        if (!isEditMode && isRegistrationClosed()) {
          showSubmitError(
            "<strong>Pendaftaran Telah Ditutup.</strong><br />Masa pendaftaran calon pengurus PROTIC 2026/2027 telah resmi berakhir pada pukul 24:00 WIB.",
            "Pendaftaran telah ditutup."
          );
          updateFormStatusUI();
          return;
        }

        // Validate all 3 steps
        if (!validateStep(1)) {
          goToStep(1);
          return;
        }
        if (!validateStep(2)) {
          goToStep(2);
          return;
        }
        if (!validateStep(3)) {
          return;
        }

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

        // Reset checklist izin Drive ke unchecked dan disable tombol konfirmasi
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

      function executeFormSubmit(formData) {
        if (!isEditMode && isRegistrationClosed()) {
          showSubmitError(
            "<strong>Pendaftaran Telah Ditutup.</strong><br />Masa pendaftaran calon pengurus PROTIC 2026/2027 telah resmi berakhir pada pukul 24:00 WIB.",
            "Pendaftaran telah ditutup."
          );
          updateFormStatusUI();
          return;
        }

        setLoading(true);
        announce(isEditMode ? "Menyimpan perubahan data pendaftaran..." : "Mengirim formulir pendaftaran, mohon tunggu...");

        const actionType = isEditMode ? "update" : "register";
        const payload = {
          ...formData,
          action: actionType,
          pin: isEditMode ? currentVerifiedPin : undefined,
        };

        fetch(scriptURL, {
          method: "POST",
          body: JSON.stringify(payload),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Server status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            // Kasus 1: Pendaftaran Baru tapi NPM Sudah Terdaftar (Duplikasi)
            if (data.result === "duplicate") {
              if (duplicateNpmText) duplicateNpmText.textContent = formData.npm;
              if (duplicateModal && typeof duplicateModal.showModal === "function") {
                duplicateModal.showModal();
              } else {
                showSubmitError(
                  `<strong>NPM ${formData.npm} sudah terdaftar!</strong><br />Anda tidak dapat mengirimkan formulir ganda. Silakan gunakan opsi 'Cek atau ubah data' di atas untuk mengubah pendaftaran Anda.`,
                  "NPM sudah terdaftar."
                );
              }
              return;
            }

            // Kasus 2: Gagal Update karena Otorisasi Tidak Cocok
            if (data.result === "invalid_pin" || data.result === "not_found") {
              showSubmitError(
                `<strong>Gagal memperbarui data:</strong> ${data.message || "Otorisasi tidak valid."}`,
                data.message
              );
              return;
            }

            // Kasus 3: Berhasil Update Data
            if (isEditMode) {
              clearDraft();
              announce("Perubahan data pendaftaran berhasil disimpan ke Google Sheets!");

              // Update data lokal & buka kartu ringkasan di modal
              verifiedApplicantData = {
                ...verifiedApplicantData,
                ...formData,
              };
              populatePreviewCard(verifiedApplicantData);
              cancelEditMode(true);
              openManageModal();
              showManageView("preview");

              // Notifikasi Toast Modern di bagian bawah layar
              showToast({
                message: "Perubahan data pendaftaran berhasil disimpan!",
                type: "success",
                duration: 3500,
              });
              return;
            }

            // Kasus 4: Berhasil Pendaftaran Baru
            clearDraft();
            announce("Pendaftaran berhasil! Mengalihkan ke halaman terima kasih.");
            window.location.href = "thankyou.html";
          })
          .catch((err) => {
            console.error("Error submitting form:", err);
            showSubmitError(
              "<strong>Gagal mengirim formulir.</strong><br />Cek koneksi internet Anda dan coba lagi. Masalah berlanjut? Hubungi panitia.",
              "Gagal mengirim formulir. Cek koneksi internet Anda dan coba lagi."
            );
          })
          .finally(() => {
            setLoading(false);
            pendingFormData = null;
          });
      }


      function setLoading(loading) {
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

      // Registration Deadline & Closed State Handler
      function isRegistrationClosed() {
        return Date.now() >= REGISTRATION_DEADLINE;
      }

      // Inisialisasi awal saat halaman dibuka
      loadDraft();
      updateDivisionUI();
      updateStepperVisuals();

      // Inisialisasi status deadline (via modul terpusat timer.js)
      window.PROTIC.startCountdownInterval(REGISTRATION_DEADLINE, ({ formatted, expired }) => {
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

      // Buka otomatis modal kelola pendaftaran jika diakses via tautan kelola (form.html?manage=true / #manage)
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("manage") === "true" || window.location.hash === "#manage") {
          setTimeout(() => {
            openManageModal();
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
            currentVerifiedPin = parsed.pin || null;
            setTimeout(() => {
              startEditMode(parsed.data);
            }, 60);
          }
        }
      } catch (e) {}