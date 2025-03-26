// Sets up event listeners for about, help, contact modals' open/close buttons
// Displays help modal on page load
export function setupModals() {
    setupModal("about");
    setupModal("help", true);
    setupModal("contact");

    function setupModal(id, showOnLoad = false) {
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