const teamFlags = {
  brazil: "https://img.icons8.com/fluency/48/brazil-circular.png",
  germany: "https://img.icons8.com/fluency/48/germany-circular.png",
  italy: "https://img.icons8.com/fluency/48/italy-circular.png",
  argentina: "https://img.icons8.com/fluency/48/argentina-circular.png",
  uruguay: "https://img.icons8.com/fluency/48/uruguay-circular.png",
  france: "https://img.icons8.com/fluency/48/france-circular.png",
  spain: "https://img.icons8.com/fluency/48/spain-circular.png",
  england: "https://img.icons8.com/fluency/48/england-circular.png",
};

const msgGol = document.getElementById('msg-gol');
const msgDefesa = document.getElementById('msg-defesa');
const player = document.getElementById("player");
const teamsSelect = document.getElementById("teams");
const startBtn = document.getElementById("start-btn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const defesaSom = new Audio("/narracaoGol.m4a");
const golacaoSom = new Audio("/gol.mp3");

const ball = document.getElementById("ball");
const goalkeeper = document.getElementById("goalkeeper");
const goal = document.getElementById("goal");
const field = document.getElementById("field");
const msg = document.getElementById("msg");
const placar = document.getElementById("high-score");

let qtdeDefesas = 0;
let qtdeGols = 0;
let isBallKicked = false;
let playerPosition = { left: 135, bottom: 50 };
let ballPosition = { left: 150, bottom: 90 };
let goalkeeperPosition = { left: 135, top: 50 };
let goalkeeperDirection = 1;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
placar.innerText = highScore;

const step = 10;
const ballStep = 10;

startBtn.addEventListener("click", () => {
  const selectedTeam = teamsSelect.value;
  const flagUrl = teamFlags[selectedTeam];

  player.style.backgroundImage = `url(${flagUrl})`;
  player.style.width = "42px";
  player.style.height = "42px";

  menu.style.display = "none";
  game.style.display = "block";

  startGame();
});

document.getElementById("reset-btn").addEventListener("click", resetGame);
document.getElementById("change-btn").addEventListener("click", () => window.location.href = "/");
document.addEventListener("keydown", handleKeyPress);

function startGame() {
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  setupGame();
}

function setupGame() {
  player.style.bottom = "50px";
  player.style.left = "135px";
}

function movePlayer(direction) {
  if (direction === "left" && playerPosition.left > 0) {
    playerPosition.left -= step;
  } else if (
    direction === "right" &&
    playerPosition.left < field.clientWidth - 30
  ) {
    playerPosition.left += step;
  } else if (
    direction === "up" &&
    playerPosition.bottom < field.clientHeight - 50
  ) {
    playerPosition.bottom += step;
  } else if (direction === "down" && playerPosition.bottom > 0) {
    playerPosition.bottom -= step;
  }

  player.style.left = `${playerPosition.left}px`;
  player.style.bottom = `${playerPosition.bottom}px`;

  if (!isBallKicked) {
    ballPosition.left = playerPosition.left + 10;
    ballPosition.bottom = playerPosition.bottom + 40;
    ball.style.left = `${ballPosition.left}px`;
    ball.style.bottom = `${ballPosition.bottom}px`;
  }
}

function handleKeyPress(event) {
  if (event.key === "ArrowLeft") movePlayer("left");
  if (event.key === "ArrowRight") movePlayer("right");
  if (event.key === "ArrowUp") movePlayer("up");
  if (event.key === "ArrowDown") movePlayer("down");
  if (event.key === " ") kickBall();
}

function kickBall() {
  if (isBallKicked) return;

  isBallKicked = true;

  const interval = setInterval(() => {
    ballPosition.bottom += ballStep;

    ball.style.bottom = `${ballPosition.bottom}px`;

    if (
      ballPosition.bottom >= goalkeeperPosition.top - 10 &&
      ballPosition.left >= goalkeeperPosition.left &&
      ballPosition.left <= goalkeeperPosition.left + 30
    ) {

        resetAudio();
      ballPosition.bottom += 50;
      ball.style.bottom = `${ballPosition.bottom}px`;

      defesaSom.play();
      msgDefesa.style.display = 'block';
      msgDefesa.style.animation = 'none';
      msgDefesa.offsetHeight;
      msgDefesa.style.animation = 'showGol 2s forwards';
      qtdeDefesas++;

      if(qtdeDefesas > 3) {
        showMessage("Você perdeu o goleiro defendeu mais de 3 chutes");
        resetAudio();
        resetGame();
      }

      resetBall();

      clearInterval(interval);
    }

    if (
      ballPosition.bottom >= field.clientHeight - 10 &&
      ballPosition.left >= 100 &&
      ballPosition.left <= 200
    ) {
        resetAudio();

      score++;
      updateScore();
      resetAudio();
      golacaoSom.play();
      msgGol.style.display = 'block';
      msgGol.style.animation = 'none';
      msgGol.offsetHeight;
      msgGol.style.animation = 'showGol 2s forwards';

      qtdeGols++;

      if(qtdeGols > 4) {
        showMessage("Você fez mais de 4 gols e venceu o jogo");
        qtdeGols = 0;
        qtdeDefesas = 0;
        resetGame();

        resetAudio();
      }
      resetBall();

      clearInterval(interval);
    }

    if (ballPosition.bottom >= field.clientHeight) {
      resetBall();
      clearInterval(interval);
    }
  }, 50);
}

function resetAudio() {
    golacaoSom.pause();
    defesaSom.pause();
    defesaSom.currentTime = 0;
    golacaoSom.currentTime = 0;

    msgGol.style.display = 'none';
    msgDefesa.style.display = 'none';
}

function resetBall() {
  ballPosition = {
    left: playerPosition.left + 10,
    bottom: playerPosition.bottom + 40,
  };
  ball.style.left = `${ballPosition.left}px`;
  ball.style.bottom = `${ballPosition.bottom}px`;
  isBallKicked = false;
}

function moveGoalkeeper() {
  goalkeeperPosition.left += goalkeeperDirection * 5;
  if (
    goalkeeperPosition.left < 0 ||
    goalkeeperPosition.left > field.clientWidth - 30
  ) {
    goalkeeperDirection *= -1;
  }
  goalkeeper.style.left = `${goalkeeperPosition.left}px`;
}

function updateScore() {
  document.getElementById("score").innerText = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  placar.innerText = highScore;
}

function showMessage(message) {
  msg.className = "message";
  msg.innerText = message;

  setTimeout(() => {
    msg.innerText = "";
  }, 2000);
}

function resetGame() {
  score = 0;
  updateScore();
  setupGame();
  playerPosition = { left: 135, bottom: 50 };
  ballPosition = { left: 150, bottom: 90 };
  goalkeeperPosition = { left: 135, top: 50 };
  goalkeeperDirection = 1;

  player.style.left = `${playerPosition.left}px`;
  player.style.bottom = `${playerPosition.bottom}px`;
  ball.style.left = `${ballPosition.left}px`;
  ball.style.bottom = `${ballPosition.bottom}px`;
  goalkeeper.style.left = `${goalkeeperPosition.left}px`;
}

setInterval(moveGoalkeeper, 50);