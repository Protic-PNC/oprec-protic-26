// === Smooth Scroll for internal links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// === Join Button with Click Effect ===
const joinBtn = document.querySelector(".join-btn");
if (joinBtn) {
  joinBtn.addEventListener("click", (e) => {
    e.preventDefault();

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
