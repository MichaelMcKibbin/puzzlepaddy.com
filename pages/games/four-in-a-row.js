// javascript
// pages/games/four-in-a-row.js
import { useState } from "react";

const ROWS = 6;
const COLS = 7;
const PLAYER = "P";
const COMPUTER = "C";

function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function findAvailableRow(grid, col) {
  for (let r = ROWS - 1; r >= 0; r--) if (!grid[r][col]) return r;
  return -1;
}

function cloneGrid(grid) {
  return grid.map((row) => row.slice());
}

function getWinningLine(grid, player) {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] !== player) continue;
      for (const [dr, dc] of dirs) {
        const cells = [[r, c]];
        // forward
        let rr = r + dr;
        let cc = c + dc;
        while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && grid[rr][cc] === player) {
          cells.push([rr, cc]);
          rr += dr;
          cc += dc;
        }
        // backward
        rr = r - dr;
        cc = c - dc;
        while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && grid[rr][cc] === player) {
          cells.unshift([rr, cc]);
          rr -= dr;
          cc -= dc;
        }
        if (cells.length >= 4) return cells;
      }
    }
  }
  return null;
}

function checkWin(grid, player) {
  return !!getWinningLine(grid, player);
}

function isDraw(grid) {
  return grid.every((row) => row.every((cell) => cell !== null));
}

function computerChooseColumn(grid) {
  // 1) Win if possible
  for (let c = 0; c < COLS; c++) {
    const r = findAvailableRow(grid, c);
    if (r === -1) continue;
    const g = cloneGrid(grid);
    g[r][c] = COMPUTER;
    if (checkWin(g, COMPUTER)) return c;
  }
  // 2) Block player win
  for (let c = 0; c < COLS; c++) {
    const r = findAvailableRow(grid, c);
    if (r === -1) continue;
    const g = cloneGrid(grid);
    g[r][c] = PLAYER;
    if (checkWin(g, PLAYER)) return c;
  }
  // 3) Prefer center column, then random among available
  const preferred = [3, 2, 4, 1, 5, 0, 6];
  for (const c of preferred) {
    if (findAvailableRow(grid, c) !== -1) return c;
  }
  return -1;
}

export default function FourInARowGame() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("Your turn");
  const [turnLocked, setTurnLocked] = useState(false); // prevents double-clicks while AI thinking
  const [winningCells, setWinningCells] = useState([]); // array of "r-c" strings

  const handleDrop = (col) => {
    if (gameOver || turnLocked) return;
    const row = findAvailableRow(grid, col);
    if (row === -1) return;
    setTurnLocked(true);
    const newGrid = cloneGrid(grid);
    newGrid[row][col] = PLAYER;
    setGrid(newGrid);

    const playerWin = getWinningLine(newGrid, PLAYER);
    if (playerWin) {
      setGameOver(true);
      setMessage("You win!");
      setWinningCells(playerWin.map(([r, c]) => `${r}-${c}`));
      setTurnLocked(false);
      return;
    }

    if (isDraw(newGrid)) {
      setGameOver(true);
      setMessage("Draw");
      setTurnLocked(false);
      return;
    }

    setMessage("Computer thinking...");
    setTimeout(() => {
      const aiCol = computerChooseColumn(newGrid);
      if (aiCol === -1) {
        setGameOver(true);
        setMessage("Draw");
        setTurnLocked(false);
        return;
      }
      const aiRow = findAvailableRow(newGrid, aiCol);
      const afterAi = cloneGrid(newGrid);
      afterAi[aiRow][aiCol] = COMPUTER;
      setGrid(afterAi);

      const aiWin = getWinningLine(afterAi, COMPUTER);
      if (aiWin) {
        setGameOver(true);
        setMessage("Computer wins");
        setWinningCells(aiWin.map(([r, c]) => `${r}-${c}`));
      } else if (isDraw(afterAi)) {
        setGameOver(true);
        setMessage("Draw");
      } else {
        setMessage("Your turn");
      }
      setTurnLocked(false);
    }, 350);
  };

  const handleRestart = () => {
    setGrid(createEmptyGrid());
    setGameOver(false);
    setMessage("Your turn");
    setTurnLocked(false);
    setWinningCells([]);
  };

  // cell rendering helpers
  const cellColor = (cell) =>
    cell === PLAYER ? "bg-red-500" : cell === COMPUTER ? "bg-yellow-400" : "bg-transparent";

  return (
    <main className="min-h-screen flex items-start justify-center py-8" style={{ backgroundImage: "url('/images/ShamrocksBackground.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 mx-auto">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Four-in-a-row</h1>
            <p className="text-sm text-slate-500">Get 4 in a row — horizontal, vertical or diagonal.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Status</div>
            <div className="font-medium text-slate-700">{message}</div>
          </div>
        </header>

        <div className="mb-4">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: COLS }).map((_, colIndex) => (
              <button
                key={`col-${colIndex}`}
                onClick={() => handleDrop(colIndex)}
                disabled={gameOver || turnLocked || findAvailableRow(grid, colIndex) === -1}
                className="h-8 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:opacity-40"
                aria-label={`Drop in column ${colIndex + 1}`}
              >
                Drop
              </button>
            ))}
          </div>
        </div>

        <div className="bg-sky-50 p-3 rounded-lg">
          <div className="grid grid-rows-6 grid-cols-7 gap-2">
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const key = `${rIdx}-${cIdx}`;
                const isWinning = winningCells.includes(key);
                return (
                  <div
                    key={key}
                    className="w-14 h-14 flex items-center justify-center bg-slate-100 rounded-full border border-slate-200"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border ${cell ? "border-transparent" : "border-slate-200"} ${cellColor(
                        cell
                      )} ${isWinning ? "animate-pulse ring-4 ring-emerald-300 scale-105" : ""} flex items-center justify-center`}
                      aria-hidden="true"
                    >
                      {cell ? (
                        <img src="/images/shamrock_1.svg" alt="" aria-hidden="true" className="w-7 h-7 drop-shadow-sm" />
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={handleRestart} className="px-4 py-2 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700">
            Restart
          </button>
          <button
            onClick={() => {
              // give computer first move
              handleRestart();
              setTimeout(() => {
                const col = computerChooseColumn(createEmptyGrid());
                if (col !== -1) {
                  const g = createEmptyGrid();
                  const row = findAvailableRow(g, col);
                  g[row][col] = COMPUTER;
                  setGrid(g);
                  setMessage("Your turn");
                }
              }, 200);
            }}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Let computer start
          </button>
        </div>
      </div>
    </main>
  );
}