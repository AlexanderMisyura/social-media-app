// Functions to open and close a modal
function openModal(modalElement) {
  modalElement.classList.add("is-active");
}

function closeModal(modalElement) {
  modalElement.classList.remove("is-active");
}

function closeAllModals() {
  (document.querySelectorAll(".modal") || []).forEach((modalElement) => {
    closeModal(modalElement);
  });
}

// Add a click event on buttons to open a specific modal
(document.querySelectorAll(".js-modal-trigger") || []).forEach(
  (modalTriggerOpen) => {
    const targetName = modalTriggerOpen.dataset.targetName;
    const modalElement = document.getElementById(targetName);

    modalTriggerOpen.addEventListener("click", () => {
      openModal(modalElement);
    });
  }
);

// Add a click event on various child elements to close the parent modal
(
  document.querySelectorAll(
    ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
  ) || []
).forEach((modalTriggerClose) => {
  const modalElement = modalTriggerClose.closest(".modal");

  modalTriggerClose.addEventListener("click", () => {
    closeModal(modalElement);
  });
});

// Add a keyboard event to close all modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Escape key
    closeAllModals();
  }
});
