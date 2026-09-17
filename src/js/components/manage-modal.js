/**
 * PROTIC Oprec 2026/2027 - Unified Manage & Delete Modal Controller (src/js/components/manage-modal.js)
 *
 * Komponen bersama (Shared Component) untuk Beranda (index.html) dan Formulir (form.html).
 * Mengelola:
 *  - Verifikasi identitas pendaftar (NPM + 4 digit nomor WhatsApp)
 *  - Pratinjau data pendaftaran (Preview First)
 *  - Transisi ke mode ubah data (langsung jika di form.html, redirect via sessionStorage jika di index.html)
 *  - Penghapusan data pendaftaran permanen (Hard Delete) dengan konfirmasi modal
 */
window.PROTIC = window.PROTIC || {};

(function () {
  const scriptURL =
    window.APP_CONFIG?.SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbw_mtEcU_vVhF96O2ACQZkPp_LoV7i88L9b4CNFx5gLkJ9wSiSzBtaA6xkNitoZ-aPo/exec";

  // Elemen Modal Kelola
  const openManageModalBtn = document.getElementById("openManageModalBtn");
  const closedScreenManageBtn = document.getElementById("closedScreenManageBtn");
  const manageModal = document.getElementById("manageModal");
  const closeManageModalBtn = document.getElementById("closeManageModalBtn");
  const manageVerifyCard = document.getElementById("manageVerifyCard");
  const managePreviewCard = document.getElementById("managePreviewCard");
  const deleteSuccessBanner = document.getElementById("deleteSuccessBanner");

  // Input Verifikasi
  const verifyNpm = document.getElementById("verifyNpm");
  const verifyPin = document.getElementById("verifyPin");
  const btnCheckRegistration = document.getElementById("btnCheckRegistration");
  const btnCheckText = document.getElementById("btnCheckText");
  const btnCheckLoading = document.getElementById("btnCheckLoading");
  const verifyError = document.getElementById("verifyError");

  // Tombol Aksi di Kartu Pratinjau
  const btnExitManage = document.getElementById("btnExitManage");
  const btnStartEdit = document.getElementById("btnStartEdit");
  const btnOpenDeleteModal = document.getElementById("btnOpenDeleteModal");
  const btnBackToNewRegister = document.getElementById("btnBackToNewRegister");

  // Elemen Pratinjau
  const cardApplicantName = document.getElementById("cardApplicantName");
  const cardApplicantNpm = document.getElementById("cardApplicantNpm");
  const cardClassSemester = document.getElementById("cardClassSemester");
  const cardWhatsapp = document.getElementById("cardWhatsapp");
  const cardEmail = document.getElementById("cardEmail");
  const cardPortfolioLink = document.getElementById("cardPortfolioLink");
  const cardDivisionsBadge = document.getElementById("cardDivisionsBadge");

  // Elemen Modal Hapus (Hard Delete)
  const deleteModal = document.getElementById("deleteModal");
  const deleteTargetName = document.getElementById("deleteTargetName");
  const deleteTargetNpm = document.getElementById("deleteTargetNpm");
  const deleteCancelBtn = document.getElementById("deleteCancelBtn");
  const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");
  const deleteBtnText = document.getElementById("deleteBtnText");
  const deleteBtnLoading = document.getElementById("deleteBtnLoading");

  let verifiedApplicantData = null;
  let currentVerifiedPin = null;

  function announce(msg) {
    if (window.PROTIC.announce) {
      window.PROTIC.announce(msg);
    }
  }

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
        badge.className =
          "inline-flex items-center gap-1.5 py-1 px-2.5 rounded bg-lightgreen/20 text-lightergreen font-semibold text-xs border border-lightgreen/35";
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
        if (!result.data.fullname && !result.data.class && !result.data.whatsapp) {
          showVerifyError(
            "⚠️ <strong>Perhatian:</strong> Skrip Apps Script di Google Drive belum diperbarui dengan kode terbaru dari <code>script/regist.gs</code>."
          );
          return;
        }

        verifiedApplicantData = result.data;
        currentVerifiedPin = pin;
        if (window.PROTIC.formState) {
          window.PROTIC.formState.verifiedApplicantData = result.data;
          window.PROTIC.formState.currentVerifiedPin = pin;
        }

        populatePreviewCard(result.data);
        showManageView("preview");
        announce(`Data pendaftaran atas nama ${result.data.fullname} berhasil diverifikasi.`);
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

  // Event Listeners
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
      if (window.PROTIC.formState) {
        window.PROTIC.formState.verifiedApplicantData = null;
        window.PROTIC.formState.currentVerifiedPin = null;
      }
      showManageView("verify");
      if (verifyNpm) verifyNpm.focus();
    });
  }

  if (btnStartEdit) {
    btnStartEdit.addEventListener("click", () => {
      if (!verifiedApplicantData) return;

      // Jika kita berada di form.html (tersedia fungsi startEditMode)
      if (typeof window.PROTIC.startEditMode === "function") {
        closeManageModal();
        window.PROTIC.startEditMode(verifiedApplicantData);
      } else {
        // Jika kita berada di index.html (landing page)
        try {
          sessionStorage.setItem(
            "protic_edit_applicant",
            JSON.stringify({
              data: verifiedApplicantData,
              pin: currentVerifiedPin,
            })
          );
        } catch (e) {}
        window.location.href = "form.html";
      }
    });
  }

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
          if (window.PROTIC.clearDraft) window.PROTIC.clearDraft();
          if (typeof window.PROTIC.cancelEditMode === "function") {
            window.PROTIC.cancelEditMode(true);
          }
          verifiedApplicantData = null;
          currentVerifiedPin = null;
          showManageView("deleteSuccess");
          announce("Pendaftaran Anda telah berhasil dihapus secara permanen dari sistem.");
          if (typeof window.PROTIC.showToast === "function") {
            window.PROTIC.showToast({
              message: "Pendaftaran berhasil dihapus secara permanen.",
              type: "success",
              duration: 4000,
            });
          }
        } else {
          const errMsg = result.message || "Gagal menghapus pendaftaran.";
          if (typeof window.PROTIC.showToast === "function") {
            window.PROTIC.showToast({ message: errMsg, type: "error", duration: 4000 });
          } else {
            alert(errMsg);
          }
        }
      } catch (err) {
        console.error("Error deleting:", err);
        const errMsg = "Terjadi kesalahan jaringan saat menghapus pendaftaran. Silakan coba lagi.";
        if (typeof window.PROTIC.showToast === "function") {
          window.PROTIC.showToast({ message: errMsg, type: "error", duration: 4000 });
        } else {
          alert(errMsg);
        }
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

  // Ekspor ke namespace PROTIC & global window
  window.openManageModal = openManageModal;
  window.PROTIC.openManageModal = openManageModal;
  window.PROTIC.closeManageModal = closeManageModal;
  window.PROTIC.showManageView = showManageView;
  window.PROTIC.populatePreviewCard = populatePreviewCard;
  window.PROTIC.getVerifiedApplicantData = () => verifiedApplicantData;
  window.PROTIC.getCurrentVerifiedPin = () => currentVerifiedPin;
})();
