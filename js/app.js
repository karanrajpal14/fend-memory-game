// Global variables

let isClockDisabled = true;
let time = 0;
let clockID;
let clickedCards = [];
let noOfMoves = 0;

const clockSpan = document.querySelector('.clock');
console.log(clockSpan);

const movesSpan = document.querySelector('.moves');
console.log(movesSpan);

/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector('.deck');
console.log(deck);

const allCards = Array.from(deck.querySelectorAll('.card'));
console.log(allCards);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const shuffledDeck = shuffle(allCards);
console.log(shuffledDeck);

shuffledDeck.forEach(card => {
    deck.appendChild(card);
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
    Added a delegated event listener to the deck instead of 
    separate listeners for each card
*/

deck.addEventListener('click', e => {
    const clicked = e.target;
    if (clicked.classList.contains('card') &&
        clickedCards.length < 2 &&
        !clickedCards.includes(clicked) &&
        !clicked.classList.contains('match')) {
        console.log('It\'s-a me, card-io');
        toggleCardState(clicked);
        if (isClockDisabled === true) {
            startClock();
            isClockDisabled = false;
            console.log('Time\'s ticking, mate!');
        }
        if (clickedCards.length === 2) {
            console.log('Checking if cards match');
            checkIfMatched();
            incrementNoOfMoves();
            queryScore();
        }

    } else {
        console.log('It\'s a me, card-iac arrest');
    }
});

function toggleCardState(clickedCard) {
    clickedCard.classList.toggle('open');
    clickedCard.classList.toggle('show');
    pushCardState(clickedCard);
}

function pushCardState(clickedCard) {
    clickedCards.push(clickedCard);
    console.log('Clicked cards - ' + clickedCards);
}

function resetCards() {
    console.log(clickedCards);
    setTimeout(() => {
        clickedCards.forEach(element => {
            console.log(element);
            toggleCardState(element);
        });
        clickedCards = [];
    }, 1000);
}

function checkIfMatched() {
    const firstCard = clickedCards[0];
    const secondCard = clickedCards[1];
    if (firstCard.firstElementChild.className === secondCard.firstElementChild.className) {
        console.log('Ayy, same pinch :P');
        firstCard.classList.toggle('match');
        secondCard.classList.toggle('match');
        clickedCards = [];
    } else {
        console.log('Same same, but different');
        resetCards();
    }
}

function incrementNoOfMoves() {
    noOfMoves++;
    movesSpan.textContent = noOfMoves;
}

function queryScore() {
    if (noOfMoves === 16 || noOfMoves === 24 || noOfMoves === 32) {
        removeStar();
    }
}

function removeStar() {
    let stars = Array.from(document.querySelectorAll('.stars i'));
    stars[stars.length - 1].remove();
}

function startClock() {
    clockID = setInterval(() => {
        time++;
        console.log(time);
        displayTime();
    }, 1000);
}

function displayTime() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds < 10 ? clockSpan.textContent = `${minutes}:0${seconds}` : clockSpan.textContent = `${minutes}:${seconds}`;
}

function stopClock() {
    clearInterval(clockID);
}