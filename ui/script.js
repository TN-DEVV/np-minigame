window.addEventListener('message', (event) => {
    if (event.data.action === 'start') {
        setupGame();
        document.body.style.display = "flex";
    }
});

//document.addEventListener('DOMContentLoaded', function () {
//    setupGame();
//});

const letters = "qwerasd";
let userInput = "";
let timer;
let keyIsPressed = false;

function setupGame() {
    resetGame(); // Clear the previous game state
    generateLetters(); // Generate new letters
    updateDisplay(); // Update the display

    //document.getElementById('start-button').disabled = false;

    // Setup initial event listeners
    //document.getElementById('start-button').addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp); // Added keyup event listener
    startGame()
}

function startGame() {
    //document.getElementById('start-button').disabled = true;

    resetGame(); // Clear the previous game state
    generateLetters(); // Generate new letters
    updateDisplay(); // Update the display

    let timeLeft = 10;
    timer = setInterval(function () {
        timeLeft -= 0.1;
        document.getElementById('timer-fill').style.width = (timeLeft / 10) * 100 + '%';

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 100);

    document.addEventListener('keydown', handleKeyDown);
}

function generateLetters() {
    document.getElementById('row1').innerHTML = '';
    document.getElementById('row2').innerHTML = '';
    document.getElementById('row3').innerHTML = '';

    for (let i = 0; i < 6; i++) {
        document.getElementById('row1').appendChild(createCharacterContainer(getRandomLetter()));
        document.getElementById('row2').appendChild(createCharacterContainer(getRandomLetter()));
    }

    for (let i = 0; i < 3; i++) {
        document.getElementById('row3').appendChild(createCharacterContainer(getRandomLetter()));
    }
}

function createCharacterContainer(character) {
    const container = document.createElement('div');
    container.classList.add('character-container');
    container.innerText = character.toUpperCase();
    return container;
}

function getRandomLetter() {
    return letters[Math.floor(Math.random() * letters.length)];
}

function updateDisplay() {
    document.getElementById('timer-fill').style.width = '100%';
}

function endGame(success) {
    clearInterval(timer);
    displayOutcome(success);
    $.post("https://np-minigame/result", JSON.stringify({
        result: success,
    }));
    setTimeout(function () {
        document.body.style.display = "none";
    }, 2000);
    document.removeEventListener('keydown', handleKeyDown);
}

function resetGame() {
    clearInterval(timer); // Clear the timer
    document.getElementById('timer-fill').style.width = '0%'; // Reset the timer bar width
    userInput = "";
    displayHacking();
}

function handleKeyDown(event) {
    const pressedKey = event.key.toLowerCase();

    // Check if the key is already pressed
    if (keyIsPressed || !letters.includes(pressedKey)) {
        return;
    }

    keyIsPressed = true;

    userInput += pressedKey;
    checkInput();
}

function handleKeyUp(event) {
    keyIsPressed = false;
}

function checkInput() {
    const characterContainers = document.querySelectorAll('.character-container');
    const lastTypedIndex = userInput.length - 1;

    if (characterContainers[lastTypedIndex].innerText.toLowerCase() === userInput[lastTypedIndex]) {
        characterContainers[lastTypedIndex].classList.add('correct');
    } else {
        characterContainers[lastTypedIndex].classList.add('incorrect');
        endGame(false);
    }

    if (userInput.length === 15) {
        clearInterval(timer);
        displayOutcome(true);
        endGame(true)
        //document.getElementById('start-button').disabled = false;
        document.removeEventListener('keydown', handleKeyDown);
    }
}

function displayOutcome(success) {
    const outcomeElement = document.getElementById('outcome');
    outcomeElement.innerText = success ? 'SUCCESS!' : 'FAILED!';
    outcomeElement.style.color = success ? '#0DE6B9' : '#AA6A6C';

    // After displaying the outcome, reattach the 'click' event listener to the start button
    //document.getElementById('start-button').addEventListener('click', startGame);
}

function displayHacking() {
    document.getElementById('outcome').innerText = 'HACKING...';
    document.getElementById('outcome').style.color = '#FFFFFF';
    //document.getElementById('start-button').removeEventListener('click', startGame);
}
