const buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickPattern = [];
let levelCounter = 0;
let gameOver = false;
let isDisplayingPattern = false;


const sounds = {
  red:"sounds/8bit-jump.mp3",
  green:"sounds/jump.mp3",
  yellow:"sounds/happy-mouse-jump.mp3",
  blue:"sounds/super-mario-jump.mp3",
  start:"sounds/game-start.mp3",
  wrong: "sounds/game-over2.mp3",
}
const box1 = document.getElementById("red");
const box2 = document.getElementById("blue");
const box3 = document.getElementById("green");
const box4 = document.getElementById("yellow");

// Start the game on Enter key press
document.addEventListener("keydown", function (e) {
  if (e.keyCode === 13 && gamePattern.length === 0 && !gameOver) {
    playSound("start");
    startGame(); // Start game only if not already started
    
  } else if(gameOver){
     resetGame();
   startGame();

  } 
});

function startGame() {
  playSound("start");
  resetGame(); // Ensure a fresh start
  showGameStartMessage();
}


function nextPattern() {
  if(gamePattern.length >= 50){
    gameStart.textContent='maximum level reached';
    showGameOverMessage();
    resetGame();
    return;
  }
  const randomNum = Math.floor(Math.random() * 4);
  const randomChosenColor = buttonColors[randomNum];
  gamePattern.push(randomChosenColor); // Add a random color to the pattern
  playSound(randomChosenColor);
  showNextPattern(randomChosenColor); // Highlight the color
  console.log("Game Pattern:", gamePattern);
  changeLevel();
  userClickPattern = []; // Reset user's pattern for the new level
}

async function showNextPattern(color) {
  isDisplayingPattern = true;
  const box = document.getElementById(color);
  box.classList.add("disappear");
  playSound(color);

  await new Promise((resolve)=> setTimeout(resolve,500));
  box.classList.remove('disappear');
  isDisplayingPattern = false;
}


function changeLevel() {
  const levelTitle = document.getElementById("levelTitle");
  levelCounter++;
  levelTitle.textContent = `Level : ${levelCounter}`;
}

// Handle user clicks
box1.addEventListener("click", () => handleUserClick("red"));
box2.addEventListener("click", () => handleUserClick("blue"));
box3.addEventListener("click", () => handleUserClick("green"));
box4.addEventListener("click", () => handleUserClick("yellow"));

//debounce
let canClick = true;
function handleUserClick(color) {
  
  if(!canClick) return;
  canClick = false;
  setTimeout(()=> canClick = true, 500 );
  playSound(color);

  // If gamePattern is empty, this is the first click
  if (gamePattern.length === 0) {
    gamePattern.push(color); // Add the first click to the pattern
    console.log("first click added to gamePattern:", gamePattern);
    removeGameStartMessage();
    nextPattern(); // Generate the random pattern after the first click
    return;
  }

  userClickPattern.push(color); // Add the user's input to the click pattern
  console.log("User Click Pattern:", userClickPattern);
  showNextPattern(color); // Highlight user's click

  const currentIndex = userClickPattern.length - 1;

  // Check if the user's input matches the game's pattern
  if (userClickPattern[currentIndex] !== gamePattern[currentIndex]) {
    console.log("wrong sequence! Game over");
    document.body.style.backgroundColor = "red";
    playSound("wrong");
    showGameOverMessage();
    gameOver = true;
    return;
  }

  // If user completes the sequence correctly
  if (userClickPattern.length === gamePattern.length) {
    console.log("Correct sequence! Moving to the next pattern.");
    setTimeout(nextPattern, 1000); // Generate the next pattern after a delay
  }
}

let currentAudio = null;

function playSound(color){
  if(currentAudio){
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio= new Audio(sounds[color]);

  currentAudio.play();
}

function showGameStartMessage(message) {
  const gameStart = document.getElementById("gameStart");
  gameStart.classList.add("gameStart");
  gameStart.textContent = message || "Press a key to Start";
}

function removeGameStartMessage() {
  const gameStart = document.getElementById("gameStart");
  gameStart.classList.remove("gameStart");
  gameStart.textContent = "";
}

function showGameOverMessage() {
  const gameOver = document.getElementById("gameOver");
  gameOver.classList.add("gameOver");
  gameOver.textContent = "Game Over, Press Any Key to Restart";
}

function resetGame() {
  console.log("Resetting game...");
  document.body.style.backgroundColor = "rgb(67, 67, 250)";
  gamePattern = []; 
  userClickPattern = []; 
  levelCounter = 0; 
  gameOver = false;
  const levelTitle = document.getElementById("levelTitle");
  levelTitle.textContent = `Level : ${levelCounter}`;
  removeGameOverMessage();
  
}

function removeGameOverMessage() {
  const gameOver = document.getElementById("gameOver");
  gameOver.classList.remove("gameOver");
  gameOver.textContent = "";
}

// Initialize the game state
function initializeGame() {
  const levelTitle = document.getElementById("levelTitle");
  levelTitle.textContent = `Level : ${levelCounter}`;
  showGameStartMessage();
}

initializeGame();
