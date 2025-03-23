// TODO: Pop out behavior doesn't occur when hovering a card over another
//       card. Try something with closestTarget?? 

'use strict';

const cardFileName = "/valuecards.json"; // "/valuecards_small.json";

let cardList = [];

// Set up all event listeners
// TODO: Clean up event listeners
window.addEventListener('DOMContentLoaded', () => {
  const openAboutDialog = document.getElementById("about-button");
  openAboutDialog.addEventListener("click", showAboutDialog);

  const dialogArea = document.getElementById("about-dialog");
  dialogArea.addEventListener("click", closeAboutDialog);

  const closeDialogButton = document.getElementById("close-dialog");
  closeDialogButton.addEventListener("click", closeAboutDialog);

  const openHelpDialog = document.getElementById("help-button");
  openHelpDialog.addEventListener("click", function () {
    modal.style.display = "flex";
  });

  // add event listeners to the 3 columns
  const lists = document.querySelectorAll("div.list-of-cards");
  lists.forEach(function(list) {
    list.addEventListener("dragover", dragover_handler);
    list.addEventListener("dragleave", dragleave_handler);
    list.addEventListener("drop", drop_handler);
  });

  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");

  // Show the modal when the page loads
  modal.style.display = "flex";

  // Hide the modal when the "OK" button is clicked
  closeModal.addEventListener("click", function () {
      modal.style.display = "none";
  });
});

// Request valuecards.json file and parse results
const httpRequest = new XMLHttpRequest();

if (!httpRequest) {
  alert('Giving up :( Cannot create an XMLHTTP instance');
}

httpRequest.addEventListener("load", fetchCardData);
httpRequest.open('GET', cardFileName);
httpRequest.send();

function fetchCardData() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      const cardData = JSON.parse(httpRequest.responseText);
      createCards(cardData['cards']);
    } else {
      console.log('There was a problem with the request.');
    }
  }
}

// Creates cards from the given card objects
function createCards(cardData) {
  for (let i = 0; i < cardData.length; i++) {
    // create a card DOM object
    let cardInfo = cardData[i];

    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("enqueued");
    card.setAttribute('id', cardInfo.title);
    card.setAttribute('draggable', 'true');

    // populate the title and description
    const cardTitle = document.createElement("p");
    cardTitle.textContent = cardInfo.title.toUpperCase();
    cardTitle.classList.add("card-title");
    
    const cardDesc = document.createElement("p");
    cardDesc.textContent = cardInfo.description;
    cardDesc.classList.add("card-desc");

    card.appendChild(cardTitle);
    card.appendChild(cardDesc);

    // add event listeners
    card.addEventListener("dragstart", dragstart_handler);
    card.addEventListener("dragenter", dragenter_handler);
    card.addEventListener("dragend", dragend_handler);

    // add it to the card array
    cardList.push(card);
  }

  // shuffle ordering of cards
  shuffleList(cardList);

  // TODO: Change this shift() to pop() and load the list in backwards
  // display the first card in the list to be sorted
  const cardQueue = document.getElementById("card-queue");
  cardQueue.appendChild(cardList.shift());  // guaranteed not to be empty???
}

// TODO: This should probably change from a dialog to something that is
// compatible with all browsers (Safari, Firefox, etc.)
function showAboutDialog(ev) {
  // display the modal
  const aboutDialog = document.getElementById("about-dialog");
  if (typeof aboutDialog.showModal === "function") {
    aboutDialog.showModal();
  } else {
    alert("The <dialog> API is not supported by this browser");
  }
}

// close the "about" dialog when you click outside of the dialog,
// on its backdrop
function closeAboutDialog(ev) {
  const clickTarget = ev.target;

  // add check to make sure it is an HTMLElement??
  // or is null an ok answer here????
  if (clickTarget.tagName === 'BUTTON') {
    const dialog = document.getElementById("about-dialog");
    dialog.close();
  } else if (clickTarget.tagName === 'DIALOG') {
    const dialog = ev.target;
    const rect = dialog.getBoundingClientRect();
    if (ev.clientY < rect.top || ev.clientY > rect.bottom ||
            ev.clientX < rect.left || ev.clientX > rect.right) {
        dialog.close();
    }
  }
}

/* Drag and drop handlers */

/**************************** CARD HANDLERS ****************************/
function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

// called by card
function dragenter_handler(ev) {
  ev.dataTransfer.dropEffect = "move";
}

// called by card
function dragend_handler(ev) {
  // do nothing if not dropped into droppable location
  if (ev.dataTransfer.dropEffect == "none") {
    return;
  }
}

/**************************** COLUMN HANDLERS ****************************/
function dragover_handler(ev) {
  ev.preventDefault();

  const column = ev.target.closest(".list-of-cards");
  if (column) {
    column.classList.add("over");
  }
}

function dragleave_handler(ev) {
  ev.preventDefault();

  const column = ev.target.closest(".list-of-cards");
  if (column) {
    column.classList.remove("over");
  }
}

function drop_handler(ev) {
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
        let newCard = cardList.shift();
        cardQueue.appendChild(newCard);
      } else {
        let finished = document.createElement("p");
        finished.textContent = "All done!";
        cardQueue.appendChild(finished);
      }

      card.classList.remove("enqueued");
    }

    drop_handler_helper(card, column);
  }
}

function drop_handler_helper(card, list) {
  // moving from the queue into a list
  if (!card.classList.contains("shrunk-card")) {
    card.classList.add("shrunk-card");
    card.querySelector(".card-title").classList.add("shrunk-card-title");
  
    card.removeChild(card.querySelector(".card-desc"));

    let countSpan = document.getElementById("card-count");
    countSpan.innerHTML = parseInt(countSpan.innerHTML) + 1;
  }
  
  list.appendChild(card);
}

// For shuffling the list of cards at initialization
function shuffleList(array) {
  for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at i and j
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
