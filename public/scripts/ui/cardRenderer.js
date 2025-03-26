import { shuffleList } from "../utils/shuffleList.js";

let cardList = [];

// creates a list of card objects from the given card data
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

// creates a card element from the given card data
// (title, description)
function createCardElement(cardInfo) {
    const card = document.createElement("div");
    card.classList.add("card", "enqueued");
    card.setAttribute("id", cardInfo.title);
    card.setAttribute("draggable", "true");

    // Populate card title
    const cardTitle = document.createElement("p");
    cardTitle.textContent = cardInfo.title.toUpperCase();
    cardTitle.classList.add("card-title");
    card.appendChild(cardTitle);

    // Populate card description
    const cardDesc = document.createElement("p");
    cardDesc.textContent = cardInfo.description;
    cardDesc.classList.add("card-desc");
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

// TODO: Should the drop listeners live here too for cards?
