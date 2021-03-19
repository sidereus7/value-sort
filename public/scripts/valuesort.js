'use strict';

var cardList = [];

// Set up all event listeners
window.addEventListener('DOMContentLoaded', () => {
  // add event listeners to the 3 columns
  let columns = document.querySelectorAll("div.column");
  columns.forEach(function(column) {
    column.addEventListener("dragover", dragover_handler);
    column.addEventListener("dragleave", dragleave_handler);
    column.addEventListener("drop", drop_handler);
  });
});

// Request valuecards.json file and parse results
var httpRequest = new XMLHttpRequest();

if (!httpRequest) {
  alert('Giving up :( Cannot create an XMLHTTP instance');
}

httpRequest.addEventListener("load", doStuff);
httpRequest.open('GET', '/valuecards.json');
httpRequest.send();

function doStuff() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      var cardData = JSON.parse(httpRequest.responseText);
      createCards(cardData['cards']);
    } else {
      console.log('There was a problem with the request.');
    }
  }
}

// Creates cards from the given card objects
function createCards(cardData) {
  for (var i = 0; i < cardData.length; i++) {
    // create a card DOM object
    var cardInfo = cardData[i];

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

/* Drag and drop handlers */

function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragenter_handler(ev) {
  ev.dataTransfer.dropEffect = "move";
}

function dragleave_handler(ev) {
  ev.currentTarget.style.background = "lightgray";
}

function dragend_handler(ev) {
  // if a card is being moved from the card-queue to a column,
  // replace it with a new card, if available
  if (ev.currentTarget.classList.contains("enqueued")) {
    const cardQueue = document.getElementById("card-queue");
    if (cardList.length) {
      var newCard = cardList.shift();
      cardQueue.appendChild(newCard);
    } else {
      const finished = document.createElement("p");
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
  var card = document.getElementById(cardId);
  if (ev.target.className === "list-of-cards") {
    drop_handler_helper(card, ev.target);
  } else if (["card", "card-title", "card-desc"].includes(ev.target.className)) {
    var closestList = ev.target.closest("div.list-of-cards");
    if (closestList !== null) {
      drop_handler_helper(card, closestList);
    }
  }

  ev.currentTarget.style.background = "lightgray";
}

function drop_handler_helper(card, list) {
  card.classList.add("shrunk-card");
  card.querySelector(".card-title").classList.add("shrunk-card-title");
  card.querySelector(".card-desc").classList.add("shrunk-card-desc");

  list.appendChild(card);
}