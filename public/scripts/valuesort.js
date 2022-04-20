'use strict';

const cardFileName = "/valuecards_small.json"; // "/valuecards.json";

let cardList = [];

// Set up all event listeners
window.addEventListener('DOMContentLoaded', () => {
  const openAboutDialog = document.getElementById("about-button");
  openAboutDialog.addEventListener("click", showAboutDialog);

  const dialogArea = document.getElementById("about-dialog");
  dialogArea.addEventListener("click", closeAboutDialog);

  const closeDialogButton = document.getElementById("close-dialog");
  closeDialogButton.addEventListener("click", closeAboutDialog);

  // add event listeners to the 3 columns
  const columns = document.querySelectorAll("div.column");
  columns.forEach(function(column) {
    column.addEventListener("dragover", dragover_handler);
    column.addEventListener("dragleave", dragleave_handler);
    column.addEventListener("drop", drop_handler);
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

function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragenter_handler(ev) {
  ev.dataTransfer.dropEffect = "move";
}

function dragleave_handler(ev) {
  // TODO: Change this to be a CSS class style
  ev.currentTarget.style.background = "#A4A4A6";
}

function dragend_handler(ev) {
  // if a card is being moved from the card-queue to a column,
  // replace it with a new card, if available
  if (ev.currentTarget.classList.contains("enqueued")) {
    const cardQueue = document.getElementById("card-queue");
    if (cardList.length) {
      let newCard = cardList.shift();
      cardQueue.appendChild(newCard);
    } else {
      let finished = document.createElement("p");
      finished.textContent = "All done!";
      cardQueue.appendChild(finished);
    }

    // remove the class from that card
    ev.currentTarget.classList.remove("enqueued");
  }
}

function dragover_handler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
  ev.currentTarget.style.background = "gray";
}

function drop_handler(ev) {
  ev.preventDefault();

  const cardId = ev.dataTransfer.getData("text/plain");
  const card = document.getElementById(cardId);
  if (ev.target.className === "list-of-cards") {
    drop_handler_helper(card, ev.target);
  } else if (["card", "card-title", "card-desc"].includes(ev.target.className)) {
    const closestList = ev.target.closest("div.list-of-cards");
    if (closestList !== null) {
      drop_handler_helper(card, closestList);
    }
  }

  // TODO: Change this to a CSS class style
  ev.currentTarget.style.background = "#A4A4A6";
}

function drop_handler_helper(card, list) {
  card.classList.add("shrunk-card");
  card.querySelector(".card-title").classList.add("shrunk-card-title");
  card.querySelector(".card-desc").classList.add("shrunk-card-desc");

  list.appendChild(card);
}