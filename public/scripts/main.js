import { fetchCardData } from "./dataLoader.js";
import { setupModals } from "./ui/modals.js";
import { setupDragAndDrop } from "./ui/dragDrop.js";

document.addEventListener("DOMContentLoaded", () => {
    setupModals();  // about, contact, and help
    setupDragAndDrop();  // column drag/drop listeners 
    fetchCardData();  // card creation and card drag listeners
});