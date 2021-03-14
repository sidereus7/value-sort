'use strict';

var cardList = [];

// Set up all event listeners
window.addEventListener('DOMContentLoaded', () => {
  // TODO: look at JS bubbling to add event listeners to
  // dynamically created elements
  const card = document.getElementById("nurturance");
  card.addEventListener("dragstart", dragstart_handler);
  card.addEventListener("dragenter", dragenter_handler);

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

function createCards(cardData) {
  for (var i = 0; i < cardData.length; i++) {
    // create a card DOM object
    var cardInfo = cardData[i];

    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute('id', cardInfo.title);
    card.setAttribute('draggable', 'true');

    // populate the title and description
    const cardTitle = document.createElement("p");
    cardTitle.textContent = cardInfo.title;
    cardTitle.classList.add("card-title");
    
    const cardDesc = document.createElement("p");
    cardDesc.textContent = cardInfo.description;
    cardDesc.classList.add("card-desc");

    card.appendChild(cardTitle);
    card.appendChild(cardDesc);

    // add event listeners
    card.addEventListener("dragstart", dragstart_handler);
    card.addEventListener("dragenter", dragenter_handler);

    // add it to the card array
    cardList.push(card);

    // add it as a child of the Very Important column (for now)
    const column = document.getElementById("very-important-list");
    column.appendChild(card);
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
  ev.currentTarget.style.background = "lightgray";
}

function dragover_handler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
  ev.currentTarget.style.background = "gray";
}

function drop_handler(ev) {
  ev.preventDefault();
  
  // move card into the target column and revert column color
  const data = ev.dataTransfer.getData("text/plain");
  ev.target.appendChild(document.getElementById(data));
  ev.currentTarget.style.background = "lightgray";


  // TODO: create a shrunk card class and do that instead of
  // hard-coding styles in here. Naughty, Sara.
  // shrink the card and its text
  var id = ev.dataTransfer.getData("text/plain");
  var card = document.getElementById(id);
  card.style.height = "88px";
  card.style.width = "188px";
  card.querySelector(".card-title").style.fontSize = "16px";
  card.querySelector(".card-desc").style.fontSize = "12px";
}