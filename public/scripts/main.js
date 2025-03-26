import { fetchCardData } from "./dataLoader.js";
import { setupModals } from "./ui/modals.js";
import { setupDragAndDrop } from "./ui/dragDrop.js";

document.addEventListener("DOMContentLoaded", () => {
    setupModals();
    setupDragAndDrop();
    fetchCardData();
});