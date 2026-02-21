const board = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let scores = JSON.parse(localStorage.getItem("tttScores")) || {
  X: 0,
  O: 0,
  draws: 0
};

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick(e) {
  const clickedCell = e.target;
  const cellIndex = clickedCell.getAttribute("data-index");
  if (gameState[cellIndex] !== "" || !gameActive) {
    return;
  }
  gameState[cellIndex] = currentPlayer;
  clickedCell.innerText = currentPlayer;
  checkResult();
  statusText.innerText = `Player ${currentPlayer}'s turn`;
}

function checkResult() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (
      gameState[a] === "" ||
      gameState[b] === "" ||
      gameState[c] === ""
    ) {
      continue;
    }
    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
  statusText.innerText = `Player ${currentPlayer} wins!`;
  scores[currentPlayer]++;
  updateLeaderboard();
  gameActive = false;
  return;
}
 if (!gameState.includes("")) {
  statusText.innerText = "It's a draw!";
  scores.draws++;
  updateLeaderboard();
  gameActive = false;
}
}
function updateLeaderboard() {
  document.getElementById("scoreX").innerText = scores.X;
  document.getElementById("scoreO").innerText = scores.O;
  document.getElementById("scoreDraw").innerText = scores.draws;

  localStorage.setItem("tttScores", JSON.stringify(scores));
}

document.getElementById("resetScores").addEventListener("click", () => {
  scores = { X: 0, O: 0, draws: 0 };
  localStorage.removeItem("tttScores"); // IMPORTANT
  updateLeaderboard();
});

function resetGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusText.innerText = `Player X's turn`;
  board.forEach(cell => cell.innerText = ""); // ✅ FIX: clear board visually
}

board.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);
updateLeaderboard();