/**
 * PROTIC Oprec 2026/2027 - Division UI & Selector (src/js/form/division-ui.js)
 *
 * Mengatur interaksi pemilihan divisi (maksimal 2), pembaruan status tombol,
 * dan rendering panel ringkasan (preview card) divisi terpilih.
 */
window.PROTIC = window.PROTIC || {};

(function () {
  const divisionCounter = document.getElementById("divisionCounter");
  const divisionButtons = document.querySelectorAll(".division-btn");
  const divisionPreviewContainer = document.getElementById("divisionPreviewContainer");

  function getDivisionsDict() {
    return window.PROTIC.DIVISIONS || {};
  }

  function getSelectedDivisions() {
    return window.PROTIC.formState.selectedDivisions;
  }

  function setSelectedDivisions(divs) {
    window.PROTIC.formState.selectedDivisions = divs;
  }

  // Dynamic Division Preview (Versi Terbaik: Unified Compact Panel)
  function updateDivisionPreview() {
    if (!divisionPreviewContainer) return;
    const selectedDivisions = getSelectedDivisions();
    const divisionInfo = getDivisionsDict();

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
    const info1 = divisionInfo[div1Key] || { name: div1Key, desc: "-", skills: [] };
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
      const info2 = divisionInfo[div2Key] || { name: div2Key, desc: "-", skills: [] };
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

  // Toggle division handler
  function toggleDivision(division) {
    let selectedDivisions = getSelectedDivisions();

    if (selectedDivisions.includes(division)) {
      selectedDivisions = selectedDivisions.filter((d) => d !== division);
      setSelectedDivisions(selectedDivisions);
      if (window.PROTIC.clearDivisionError) window.PROTIC.clearDivisionError();
      updateDivisionUI();
      if (window.PROTIC.saveDraft) window.PROTIC.saveDraft();
      if (window.PROTIC.announce) {
        window.PROTIC.announce(`Pilihan divisi ${division} dibatalkan. ${selectedDivisions.length} dari 2 divisi terpilih.`);
      }
    } else {
      if (selectedDivisions.length < 2) {
        selectedDivisions.push(division);
        setSelectedDivisions(selectedDivisions);
        if (window.PROTIC.clearDivisionError) window.PROTIC.clearDivisionError();
        updateDivisionUI();
        if (window.PROTIC.saveDraft) window.PROTIC.saveDraft();
        if (window.PROTIC.announce) {
          window.PROTIC.announce(`Divisi ${division} dipilih. ${selectedDivisions.length} dari 2 divisi terpilih.`);
        }
      } else {
        if (window.PROTIC.showDivisionError) {
          window.PROTIC.showDivisionError("Kamu hanya boleh memilih maksimal 2 divisi!");
        }
      }
    }
  }

  // Division UI update
  function updateDivisionUI() {
    const selectedDivisions = getSelectedDivisions();
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
    if (window.PROTIC.updateStepperVisuals) {
      window.PROTIC.updateStepperVisuals();
    }
  }

  // Inisialisasi event listener tombol divisi
  divisionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleDivision(btn.dataset.division);
    });
  });

  // Ekspor ke global & namespace PROTIC
  window.toggleDivision = toggleDivision;
  window.PROTIC.toggleDivision = toggleDivision;
  window.PROTIC.updateDivisionUI = updateDivisionUI;
  window.PROTIC.updateDivisionPreview = updateDivisionPreview;
})();
