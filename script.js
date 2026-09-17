/**
 * PROTIC Oprec 2026/2027 - Landing Page Controller (script.js)
 *
 * Mengatur interaktivitas beranda (index.html):
 *  - Smooth scrolling link navigasi
 *  - Indikator status countdown penutupan pendaftaran
 *  - Animasi tombol daftar
 *  - Efek scroll fade-in dan hover divisi
 *  - Splash screen (sekali per sesi browser)
 *
 * Catatan: Fitur kelola dan hapus pendaftaran kini dikelola terpusat
 * oleh komponen bersama: src/js/components/manage-modal.js
 */

// === Smooth Scroll for internal links ===
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// === Registration Deadline & Countdown ===
// Mengambil dari APP_CONFIG (Single Source of Truth) dengan fallback aman
const REGISTRATION_DEADLINE = window.APP_CONFIG?.REGISTRATION_DEADLINE
  ? new Date(window.APP_CONFIG.REGISTRATION_DEADLINE).getTime()
  : new Date("2026-09-18T00:00:00+07:00").getTime();

function isRegistrationClosed() {
  return Date.now() >= REGISTRATION_DEADLINE;
}

// Inisialisasi countdown di landing page (via modul terpusat timer.js)
if (document.getElementById("countdownBadge") || document.querySelector(".join-btn")) {
  if (typeof window.PROTIC?.startCountdownInterval === "function") {
    window.PROTIC.startCountdownInterval(REGISTRATION_DEADLINE, ({ formatted, expired }) => {
      const badge = document.getElementById("countdownBadge");
      const digits = document.getElementById("countdownDigits");
      const joinBtn = document.querySelector(".join-btn");

      if (expired) {
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
      } else {
        if (digits) digits.textContent = formatted;
      }
    });
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
  rootMargin: "0px 0px -50px 0px",
};

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("fade-in");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});

// === Hover effect for division items ===
document.querySelectorAll(".division-item").forEach((item) => {
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
    landing.addEventListener(
      "transitionend",
      () => {
        landing.style.display = "none";
        main.classList.add("show");
      },
      { once: true }
    );
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
