// === Smooth Scroll for internal links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// === Registration Deadline & Countdown ===
// Target: 18 September 2026 00:00:00 WIB (Midnight pergantian hari)
const REGISTRATION_DEADLINE = new Date("2026-09-18T00:00:00+07:00").getTime();

function isRegistrationClosed() {
  return Date.now() >= REGISTRATION_DEADLINE;
}

function updateCountdownUI() {
  const badge = document.getElementById("countdownBadge");
  const digits = document.getElementById("countdownDigits");
  const joinBtn = document.querySelector(".join-btn");

  if (!badge && !joinBtn) return true;

  const now = Date.now();
  const diff = REGISTRATION_DEADLINE - now;

  if (diff <= 0) {
    // Pendaftaran Ditutup
    if (badge) {
      badge.classList.add("expired");
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0" aria-hidden="true"></span>
        <span>Pendaftaran Telah Ditutup</span>
      `;
    }

    if (joinBtn) {
      joinBtn.classList.add("btn-closed");
      joinBtn.setAttribute("disabled", "true");
      joinBtn.setAttribute("aria-disabled", "true");
      joinBtn.textContent = "Pendaftaran Ditutup";
      joinBtn.classList.remove("w-40");
      joinBtn.classList.add("w-auto", "px-6");
    }
    return true; // Selesai / Expired
  }

  // Masih aktif, format jam, menit, detik
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatted = [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0")
  ].join(" : ");

  if (digits) {
    digits.textContent = formatted;
  }

  return false;
}

// Inisialisasi countdown di landing page
if (document.getElementById("countdownBadge") || document.querySelector(".join-btn")) {
  const isFinished = updateCountdownUI();
  if (!isFinished) {
    const timerInterval = setInterval(() => {
      if (updateCountdownUI()) {
        clearInterval(timerInterval);
      }
    }, 1000);
  }
}

// === Join Button with Click Effect ===
const joinBtn = document.querySelector(".join-btn");
if (joinBtn) {
  joinBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (isRegistrationClosed() || joinBtn.hasAttribute("disabled") || joinBtn.classList.contains("btn-closed")) {
      return;
    }

    // Tambah animasi klik
    joinBtn.classList.add("clicked");
    setTimeout(() => {
      window.location.href = "form.html";
    }, 500); // delay biar animasi kelihatan
  });
}

// === Fade-in on scroll ===
const faders = document.querySelectorAll(".section-title, .division-card, .about-card");

const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("fade-in");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// === Hover effect for division items ===
document.querySelectorAll(".division-item").forEach(item => {
  item.addEventListener("mouseenter", () => {
    item.classList.add("active");
  });
  item.addEventListener("mouseleave", () => {
    item.classList.remove("active");
  });
});

// === Splash Screen Transition (Once-Per-Session) ===
window.addEventListener("load", () => {
  const landing = document.getElementById("landingPage");
  const main = document.querySelector(".main-content");
  const skipBtn = document.getElementById("skipSplashBtn");

  if (!landing || !main) return;

  // Cek apakah splash sudah pernah ditampilkan dalam sesi ini
  const alreadyShown = sessionStorage.getItem("protic_splash_shown") === "true";

  if (alreadyShown) {
    landing.style.display = "none";
    main.classList.add("show");
    return;
  }

  let hasDismissed = false;
  let splashTimer = null;

  const dismissSplash = () => {
    if (hasDismissed) return;
    hasDismissed = true;
    if (splashTimer) clearTimeout(splashTimer);

    // Tandai bahwa splash sudah ditampilkan untuk sesi ini
    try {
      sessionStorage.setItem("protic_splash_shown", "true");
    } catch (e) {}

    landing.classList.add("fade-out");
    landing.addEventListener("transitionend", () => {
      landing.style.display = "none";
      main.classList.add("show");
    }, { once: true });
  };

  // Tombol Skip muncul setelah 400ms
  if (skipBtn) {
    setTimeout(() => {
      if (!hasDismissed) {
        skipBtn.classList.add("visible");
      }
    }, 400);

    skipBtn.addEventListener("click", dismissSplash);
  }

  // Durasi splash screen 1500ms (1.5 detik)
  splashTimer = setTimeout(dismissSplash, 1500);
});

// === Kelola Data Pendaftaran Modal di Beranda ===
const scriptURL = "https://script.google.com/macros/s/AKfycbw_mtEcU_vVhF96O2ACQZkPp_LoV7i88L9b4CNFx5gLkJ9wSiSzBtaA6xkNitoZ-aPo/exec";

const openManageModalBtn = document.getElementById("openManageModalBtn");
const manageModal = document.getElementById("manageModal");
const closeManageModalBtn = document.getElementById("closeManageModalBtn");
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

// Preview Card Elements
const cardApplicantName = document.getElementById("cardApplicantName");
const cardApplicantNpm = document.getElementById("cardApplicantNpm");
const cardClassSemester = document.getElementById("cardClassSemester");
const cardWhatsapp = document.getElementById("cardWhatsapp");
const cardEmail = document.getElementById("cardEmail");
const cardPortfolioLink = document.getElementById("cardPortfolioLink");
const cardDivisionsBadge = document.getElementById("cardDivisionsBadge");

// Delete Modal Elements
const deleteModal = document.getElementById("deleteModal");
const deleteCancelBtn = document.getElementById("deleteCancelBtn");
const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");
const deleteBtnText = document.getElementById("deleteBtnText");
const deleteBtnLoading = document.getElementById("deleteBtnLoading");
const deleteTargetName = document.getElementById("deleteTargetName");
const deleteTargetNpm = document.getElementById("deleteTargetNpm");

let verifiedApplicantData = null;
let currentVerifiedPin = null;

function openManageModal() {
  if (manageModal && typeof manageModal.showModal === "function") {
    showManageView("verify");
    clearVerifyError();
    manageModal.showModal();
    if (verifyNpm) setTimeout(() => verifyNpm.focus(), 80);
  }
}

function closeManageModal() {
  if (manageModal && manageModal.open) {
    manageModal.close();
  }
}

if (openManageModalBtn) openManageModalBtn.addEventListener("click", openManageModal);
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

function showManageView(viewName) {
  if (viewName === "preview") {
    if (manageVerifyCard) manageVerifyCard.classList.add("hidden");
    if (managePreviewCard) managePreviewCard.classList.remove("hidden");
    if (deleteSuccessBanner) deleteSuccessBanner.classList.add("hidden");
  } else if (viewName === "deleteSuccess") {
    if (manageVerifyCard) manageVerifyCard.classList.add("hidden");
    if (managePreviewCard) managePreviewCard.classList.add("hidden");
    if (deleteSuccessBanner) deleteSuccessBanner.classList.remove("hidden");
  } else {
    if (manageVerifyCard) manageVerifyCard.classList.remove("hidden");
    if (managePreviewCard) managePreviewCard.classList.add("hidden");
    if (deleteSuccessBanner) deleteSuccessBanner.classList.add("hidden");
    if (verifyPin) verifyPin.value = "";
  }
}

function showVerifyError(msg) {
  if (verifyError) {
    verifyError.innerHTML = msg;
    verifyError.classList.remove("hidden");
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
      verifiedApplicantData = result.data;
      currentVerifiedPin = pin;
      populatePreviewCard(result.data);
      showManageView("preview");
    } else if (result.result === "invalid_pin") {
      showVerifyError("PIN salah: 4 digit nomor WhatsApp tidak cocok dengan data pendaftaran Anda.");
      if (verifyPin) verifyPin.focus();
    } else if (result.result === "not_found") {
      showVerifyError(`Data pendaftaran dengan NPM <strong>${npm}</strong> tidak ditemukan.`);
      if (verifyNpm) verifyNpm.focus();
    } else {
      showVerifyError(result.message || "Gagal memverifikasi identitas.");
    }
  } catch (err) {
    console.error("Error verifying registration:", err);
    showVerifyError("Gagal terhubung ke server. Pastikan koneksi internet stabil dan coba lagi.");
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

if (btnExitManage) {
  btnExitManage.addEventListener("click", () => {
    verifiedApplicantData = null;
    currentVerifiedPin = null;
    showManageView("verify");
    if (verifyNpm) verifyNpm.focus();
  });
}

if (btnStartEdit) {
  btnStartEdit.addEventListener("click", () => {
    if (verifiedApplicantData) {
      try {
        sessionStorage.setItem("protic_edit_applicant", JSON.stringify({
          data: verifiedApplicantData,
          pin: currentVerifiedPin
        }));
      } catch (e) {}
      window.location.href = "form.html";
    }
  });
}

if (btnOpenDeleteModal && deleteModal) {
  btnOpenDeleteModal.addEventListener("click", () => {
    if (!verifiedApplicantData) return;
    if (deleteTargetName) deleteTargetName.textContent = verifiedApplicantData.fullname || "Pendaftar";
    if (deleteTargetNpm) deleteTargetNpm.textContent = verifiedApplicantData.npm || "";
    deleteModal.showModal();
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
        verifiedApplicantData = null;
        currentVerifiedPin = null;
        showManageView("deleteSuccess");
      } else {
        alert(result.message || "Gagal menghapus pendaftaran.");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Terjadi kesalahan jaringan saat menghapus pendaftaran. Silakan coba lagi.");
    } finally {
      setDeleteLoading(false);
    }
  });
}

if (btnBackToNewRegister) {
  btnBackToNewRegister.addEventListener("click", () => {
    closeManageModal();
    showManageView("verify");
  });
}
