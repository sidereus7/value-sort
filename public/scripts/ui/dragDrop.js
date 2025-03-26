export function setupDragAndDrop() {
    document.querySelectorAll("div.list-of-cards").forEach(list => {
        list.addEventListener("dragover", dragoverHandler);
        list.addEventListener("dragleave", dragleaveHandler);
        list.addEventListener("drop", dropHandler);
    });
}

function dragoverHandler(ev) {
    ev.preventDefault();

    const column = ev.target.closest(".list-of-cards");
    if (column) {
      column.classList.add("over");
    }
}

function dragleaveHandler(ev) {
    ev.preventDefault();
    
    const column = ev.target.closest(".list-of-cards");
    if (column) {
        column.classList.remove("over");
    }
}

function dropHandler(ev) {
    ev.preventDefault();
    
    const column = ev.target.closest(".list-of-cards");
    if (column) {
        column.classList.remove("over");

        const cardId = ev.dataTransfer.getData("text/plain");
        const card = document.getElementById(cardId);

        // remove card from the queue and replace with next card
        if (card.classList.contains("enqueued")) {
            const cardQueue = document.getElementById("card-queue");
            if (cardList.length) {
                // add next card from list to queue
                cardQueue.appendChild(cardList.shift());
            } else {
                let finished = document.createElement("p");
                finished.textContent = "All done!";
                cardQueue.appendChild(finished);
            }
            card.classList.remove("enqueued");
        }

        dropHandlerHelper(card, column);
    }
}

function dropHandlerHelper(card, list) {
    // moving card from the queue into a list
    if (!card.classList.contains("shrunk-card")) {
        card.classList.add("shrunk-card");
        card.querySelector(".card-title").classList.add("shrunk-card-title");
        card.removeChild(card.querySelector(".card-desc"));

        let countSpan = document.getElementById("card-count");
        countSpan.innerHTML = parseInt(countSpan.innerHTML) + 1;
    }

    list.appendChild(card);
}
