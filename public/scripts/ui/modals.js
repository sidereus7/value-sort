export function setupModals() {
    setupModal("about");
    setupModal("help", true);
    setupModal("contact");

    // TODO: update name of closeHelpModal to close-help-modal
    function setupModal(id, closeButtonId, showOnLoad = false) {
        const modal = document.getElementById(`${id}-modal`);
        const openButton = document.getElementById(`${id}-open`);
        const closeButton = document.getElementById(`${id}-close`);

        if (!modal || !openButton || !closeButton) {
            return;
        }

        openButton.addEventListener("click", () => modal.style.display = "flex");
        closeButton.addEventListener("click", () => modal.style.display = "none");

        if (showOnLoad) {
            modal.style.display = "flex";
        }
    }
}