import { shuffleList } from "../utils/shuffleList.js";

let cardList = [];

export function createCards(cardData) {
    for (let i = 0; i < cardData.length; i++) {
        let cardInfo = cardData[i];
        let card = createCardElement(cardInfo);
        cardList.push(card);
    }
    shuffleList(cardList);

    // Display the first card in the queue
    const cardQueue = document.getElementById("card-queue");
    if (cardList.length > 0) {
        cardQueue.appendChild(cardList.shift());
    }
}

function createCardElement(cardInfo) {
    const card = document.createElement("div");
    card.classList.add("card", "enqueued");
    card.setAttribute("id", cardInfo.title);
    card.setAttribute("draggable", "true");

    // Populate the title and description
    const cardTitle = document.createElement("p");
    cardTitle.textContent = cardInfo.title.toUpperCase();
    cardTitle.classList.add("card-title");

    const cardDesc = document.createElement("p");
    cardDesc.textContent = cardInfo.description;
    cardDesc.classList.add("card-desc");

    card.appendChild(cardTitle);
    card.appendChild(cardDesc);

    // Add drag event listeners
    card.addEventListener("dragstart", dragstartHandler);
    card.addEventListener("dragenter", dragenterHandler);
    card.addEventListener("dragend", dragendHandler);

    return card;
}

/*********************** Drag Handlers for Cards ***********************/
function dragstartHandler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragenterHandler(ev) {
    ev.dataTransfer.dropEffect = "move";
}

function dragendHandler(ev) {
    // do nothing if not dropped into droppable location
    if (ev.dataTransfer.dropEffect === "none") {
        return;
    }
}
