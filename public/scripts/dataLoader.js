import { createCards } from "./ui/cardRenderer.js";

const cardFileName = "/valuecards.json";
let cardList = [];

export function fetchCardData() {
    const httpRequest = new XMLHttpRequest();

    httpRequest.addEventListener("load", () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const cardData = JSON.parse(httpRequest.responseText);
                createCards(cardData['cards']);
            } else {
                console.error("Failed to fetch card data.");
            }
        }
    });

    httpRequest.open('GET', cardFileName);
    httpRequest.send();
}
  