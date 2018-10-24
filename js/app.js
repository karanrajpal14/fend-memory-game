// Global variables

let isClockDisabled = true;
let time = 0;
let clockID;
let clickedCards = [];
let noOfMoves = 0;
let matchedCards = 0;

const clockSpan = document.querySelector('.clock');
const movesSpan = document.querySelector('.moves');
const starHTML = '<i class="fa fa-star fa-lg has-text-warning"></i>';
const modalDiv = document.querySelector('.modal');
const deck = document.querySelector('.deck');
const allCards = Array.from(deck.querySelectorAll('.card'));
const TOTAL_MATCH_PAIRS = allCards.length / 2;

shuffleDeck(allCards);

function shuffleDeck(allCards) {
    // Shuffling all cards
    const shuffledDeck = shuffle(allCards);

    // Adding shuffled cards to deck
    shuffledDeck.forEach(card => {
        deck.appendChild(card);
    });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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
        showCard(clicked);
        if (isClockDisabled === true) {
            startClock();
            isClockDisabled = false;
            console.log('Time\'s ticking, mate!');
        }
        if (clickedCards.length === 2) {
            incrementNoOfMoves();
            checkIfMatched();
            queryScore();
        }

    } else {
        console.log('It\'s a me, card-iac arrest');
    }
});

function showCard(clickedCard) {
    clickedCard.classList.toggle('open');
    clickedCard.classList.toggle('show');
    clickedCards.push(clickedCard);
}

function checkIfMatched() {
    const firstCard = clickedCards[0];
    const secondCard = clickedCards[1];
    if (firstCard.firstElementChild.className === secondCard.firstElementChild.className) {
        console.log('Ayy, same pinch :P');
        firstCard.classList.toggle('match');
        secondCard.classList.toggle('match');
        clickedCards = [];
        matchedCards++;
        if (matchedCards === TOTAL_MATCH_PAIRS) {
            pushGameState();
            gameOver();
        }
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
    if (noOfMoves === 16 || noOfMoves === 24) {
        removeStar();
    }
}

function removeStar() {
    let stars = Array.from(document.querySelectorAll('.stars i'));
    stars[stars.length - 1].remove();
}

// Reset cards after both are shown and not matched
function resetCards() {
    setTimeout(() => {
        clickedCards.forEach(card => {
            showCard(card);
        });
        clickedCards = [];
    }, 1000);
}

function startClock() {
    clockID = setInterval(() => {
        time++;
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

function toggleModal() {
    modalDiv.classList.toggle('is-active');
}

function pushGameState() {
    const gameTime = document.querySelector('#game_time');
    const gameRating = document.querySelector('#game_rating');
    const gameMoves = document.querySelector('#game_moves');

    gameTime.textContent = `Time: ${clockSpan.textContent}`;
    gameMoves.textContent = `Moves: ${movesSpan.textContent}`;
    gameRating.textContent = `Stars: ${getStars()}`;
}

function getStars() {
    starCount = 0;
    let currentstarCount = document.querySelectorAll('.stars i');
    currentstarCount.forEach(() => {
        starCount++;
    });
    return starCount;
}

function gameOver() {
    stopClock();
    toggleModal();
}

function replayGame() {
    // Kill time
    stopClock();
    isClockDisabled = true;
    time = 0;
    displayTime();

    // Reset moves
    moves = 0;
    movesSpan.textContent = moves;

    // Reset stars
    stars = 0;
    document.querySelectorAll('.stars li').forEach(listItem => {
        listItem.innerHTML = starHTML;
    });

    // Reset shown cards
    document.querySelectorAll('.deck li').forEach(card => {
        card.className = 'card';
    });

    shuffleDeck(allCards);

    // Cancel modal
    modalDiv.classList.remove('is-active');
}
