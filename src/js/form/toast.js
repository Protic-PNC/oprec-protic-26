/**
 * PROTIC Oprec 2026/2027 - Toast Notification Utility (src/js/form/toast.js)
 *
 * Menyediakan notifikasi toast modern dengan animasi Tailwind,
 * dukungan aksi (seperti Undo), dan auto-dismiss.
 */
window.PROTIC = window.PROTIC || {};

(function () {
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

    if (typeof window.PROTIC.announce === "function") {
      window.PROTIC.announce(message);
    }
  }

  function dismissToast(toastEl) {
    if (!toastEl) return;
    toastEl.classList.remove("translate-y-0", "opacity-100");
    toastEl.classList.add("translate-y-4", "opacity-0");
    setTimeout(() => {
      if (toastEl.parentElement) toastEl.remove();
    }, 300);
  }

  window.PROTIC.showToast = showToast;
  window.PROTIC.dismissToast = dismissToast;
})();
