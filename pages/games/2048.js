// pages/games/2048.js
import { useState, useEffect, useCallback } from "react";

/**
 * 2048 game page.
 * Implements the classic sliding-grid merge mechanics with keyboard controls and score tracking.
 */
const GRID_SIZE = 4;

// Tile colors based on value
const getTileColor = (value) => {
  const colors = {
    2: "bg-yellow-100 text-gray-800",
    4: "bg-yellow-200 text-gray-800",
    8: "bg-orange-300 text-white",
    16: "bg-orange-400 text-white",
    32: "bg-orange-500 text-white",
    64: "bg-red-500 text-white",
    128: "bg-yellow-400 text-white",
    256: "bg-yellow-500 text-white",
    512: "bg-yellow-600 text-white",
    1024: "bg-yellow-700 text-white",
    2048: "bg-yellow-800 text-white",
  };
  return colors[value] || "bg-gray-800 text-white";
};

// Pure functions for game logic

// Create empty grid
function createEmptyGrid() {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
}

// Get empty cells
function getEmptyCells(grid) {
  const empty = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  return empty;
}

// Add random tile (90% chance of 2, 10% chance of 4)
function addRandomTile(grid) {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;

  const newGrid = grid.map(row => [...row]);
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

// Initialize grid with 2 random tiles
function initializeGrid() {
  let grid = createEmptyGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
}

// Compare two grids
function gridsEqual(grid1, grid2) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid1[r][c] !== grid2[r][c]) return false;
    }
  }
  return true;
}

// Compress row (move all non-zero values to the left)
function compressRow(row) {
  const filtered = row.filter(val => val !== 0);
  const zeros = Array(GRID_SIZE - filtered.length).fill(0);
  return [...filtered, ...zeros];
}

// Merge row (merge equal adjacent values, can only merge once per move)
function mergeRow(row) {
  let newRow = [...row];
  let scoreGained = 0;

  for (let i = 0; i < GRID_SIZE - 1; i++) {
    if (newRow[i] !== 0 && newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      scoreGained += newRow[i];
      newRow[i + 1] = 0;
      i++; // Skip next cell to ensure only one merge per move
    }
  }

  return { row: newRow, score: scoreGained };
}

// Process a single row (compress, merge, compress)
function processRow(row) {
  let compressed = compressRow(row);
  const { row: merged, score } = mergeRow(compressed);
  compressed = compressRow(merged);
  return { row: compressed, score };
}

// Rotate grid 90 degrees clockwise
function rotateGridClockwise(grid) {
  const newGrid = createEmptyGrid();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[c][GRID_SIZE - 1 - r] = grid[r][c];
    }
  }
  return newGrid;
}

// Rotate grid 90 degrees counter-clockwise
function rotateGridCounterClockwise(grid) {
  const newGrid = createEmptyGrid();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[GRID_SIZE - 1 - c][r] = grid[r][c];
    }
  }
  return newGrid;
}

// Move left
function moveLeft(grid) {
  let newGrid = [];
  let totalScore = 0;

  for (let r = 0; r < GRID_SIZE; r++) {
    const { row, score } = processRow(grid[r]);
    newGrid.push(row);
    totalScore += score;
  }

  return { grid: newGrid, score: totalScore };
}

// Move right (rotate 180, move left, rotate 180 back)
function moveRight(grid) {
  let rotated = rotateGridClockwise(rotateGridClockwise(grid));
  const { grid: moved, score } = moveLeft(rotated);
  rotated = rotateGridClockwise(rotateGridClockwise(moved));
  return { grid: rotated, score };
}

// Move up (rotate counter-clockwise, move left, rotate clockwise)
function moveUp(grid) {
  let rotated = rotateGridCounterClockwise(grid);
  const { grid: moved, score } = moveLeft(rotated);
  rotated = rotateGridClockwise(moved);
  return { grid: rotated, score };
}

// Move down (rotate clockwise, move left, rotate counter-clockwise)
function moveDown(grid) {
  let rotated = rotateGridClockwise(grid);
  const { grid: moved, score } = moveLeft(rotated);
  rotated = rotateGridCounterClockwise(moved);
  return { grid: rotated, score };
}

// Check if any moves are possible
function canMove(grid) {
  // Check for empty cells
  if (getEmptyCells(grid).length > 0) return true;

  // Check for possible merges horizontally
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 1; c++) {
      if (grid[r][c] === grid[r][c + 1]) return true;
    }
  }

  // Check for possible merges vertically
  for (let r = 0; r < GRID_SIZE - 1; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === grid[r + 1][c]) return true;
    }
  }

  return false;
}

// Main component
export default function Game2048() {
  const [grid, setGrid] = useState(initializeGrid);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("2048-best-score");
    if (saved) setBestScore(parseInt(saved, 10));
  }, []);

  // Save best score to localStorage
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("2048-best-score", score.toString());
    }
  }, [score, bestScore]);

  // Check for game over
  useEffect(() => {
    if (!canMove(grid)) {
      setGameOver(true);
    }
  }, [grid]);

  // Handle move
  const handleMove = useCallback((direction) => {
    if (gameOver) return;

    let result;
    switch (direction) {
      case "left":
        result = moveLeft(grid);
        break;
      case "right":
        result = moveRight(grid);
        break;
      case "up":
        result = moveUp(grid);
        break;
      case "down":
        result = moveDown(grid);
        break;
      default:
        return;
    }

    // Check if move was valid (grid changed)
    if (!gridsEqual(grid, result.grid)) {
      const newGrid = addRandomTile(result.grid);
      setGrid(newGrid);
      setScore(prev => prev + result.score);
      setMoveCount(prev => prev + 1);
    }
  }, [grid, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const direction = e.key.replace("Arrow", "").toLowerCase();
        handleMove(direction);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove]);

  // New game
  const startNewGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setMoveCount(0);
    setGameOver(false);
  };

  // Keep playing (dismiss game over overlay)
  const keepPlaying = () => {
    setGameOver(false);
  };

  return (
    <div className="min-h-screen py-4 sm:py-8 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-orange-600 mb-2">2048</h1>
          <p className="text-gray-600 text-sm sm:text-base">Join the tiles, get to 2048!</p>
        </div>

        {/* Score and controls */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <div className="bg-orange-400 text-white px-6 py-3 rounded-lg shadow-md text-center min-w-[100px]">
            <div className="text-xs uppercase font-semibold opacity-90">Score</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
          <div className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md text-center min-w-[100px]">
            <div className="text-xs uppercase font-semibold opacity-90">Best</div>
            <div className="text-2xl font-bold">{bestScore}</div>
          </div>
          <div className="bg-orange-300 text-white px-6 py-3 rounded-lg shadow-md text-center min-w-[100px]">
            <div className="text-xs uppercase font-semibold opacity-90">Moves</div>
            <div className="text-2xl font-bold">{moveCount}</div>
          </div>
        </div>

        {/* New Game and Instructions buttons */}
        <div className="flex gap-3 justify-center mb-6">
          <button
            onClick={startNewGame}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md font-semibold"
            aria-label="Start new game"
          >
            New Game
          </button>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md font-semibold"
            aria-label="Toggle instructions"
          >
            {showInstructions ? "Hide" : "How to Play"}
          </button>
        </div>

        {/* Instructions */}
        {showInstructions && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-orange-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">How to Play</h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">▸</span>
                <span>Use your <strong>arrow keys</strong> (or on-screen buttons) to move tiles.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">▸</span>
                <span>When two tiles with the same number touch, they <strong>merge into one</strong>!</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">▸</span>
                <span>After each move, a new tile appears randomly.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">▸</span>
                <span>Your goal is to create a tile with the number <strong>2048</strong>.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">▸</span>
                <span>The game ends when you can't make any more moves.</span>
              </li>
            </ul>
          </div>
        )}

        {/* Game Grid */}
        <div className="bg-orange-400 p-3 sm:p-4 rounded-xl shadow-2xl mb-6 mx-auto max-w-md relative">
          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-white bg-opacity-95 z-10 rounded-xl flex flex-col items-center justify-center p-6">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-red-600 mb-4">Game Over!</h2>
                <p className="text-xl text-gray-700 mb-2">Final Score: <strong>{score}</strong></p>
                <p className="text-lg text-gray-600 mb-6">Moves: {moveCount}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={startNewGame}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md font-semibold"
                    aria-label="Restart game"
                  >
                    Restart
                  </button>
                  <button
                    onClick={keepPlaying}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md font-semibold"
                    aria-label="Keep playing"
                  >
                    Keep Playing
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {grid.map((row, r) =>
              row.map((value, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`aspect-square rounded-lg shadow-md flex items-center justify-center text-2xl sm:text-3xl font-bold transition-all duration-150 ${
                    value === 0
                      ? "bg-orange-200 bg-opacity-50"
                      : getTileColor(value)
                  }`}
                >
                  {value !== 0 && value}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="max-w-md mx-auto">
          <p className="text-center text-sm text-gray-600 mb-3">Mobile Controls</p>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div></div>
            <button
              onClick={() => handleMove("up")}
              className="aspect-square bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center text-3xl text-orange-600 font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300"
              aria-label="Move up"
            >
              ▲
            </button>
            <div></div>
            <button
              onClick={() => handleMove("left")}
              className="aspect-square bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center text-3xl text-orange-600 font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300"
              aria-label="Move left"
            >
              ◀
            </button>
            <button
              onClick={() => handleMove("down")}
              className="aspect-square bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center text-3xl text-orange-600 font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300"
              aria-label="Move down"
            >
              ▼
            </button>
            <button
              onClick={() => handleMove("right")}
              className="aspect-square bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center text-3xl text-orange-600 font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300"
              aria-label="Move right"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Keyboard hint for desktop */}
        <p className="text-center text-sm text-gray-500 mt-6 hidden sm:block">
          💡 Use arrow keys to play
        </p>
      </div>
    </div>
  );
}


