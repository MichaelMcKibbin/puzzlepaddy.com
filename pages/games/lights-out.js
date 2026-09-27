import { useEffect, useState, useCallback, useRef } from "react";
import {
  toggleCell,
  isWon,
  generateRandomPuzzle,
  generateDailyPuzzle,
  getSuggestedMoveCount,
  formatTime,
  createSeededRNG,
} from "../../lib/lightsOutUtils";

/**
 * Lights Out puzzle page.
 * Lets the player choose a board size and mode, then toggle cells to clear the board.
 */
export default function LightsOutPage() {
  // Game configuration
  const [boardSize, setBoardSize] = useState(5);
  const [mode, setMode] = useState("Random"); // Random or Daily

  // Game state
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [undoHistory, setUndoHistory] = useState([]);

  // UI state
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");

  const timerRef = useRef(null);

  // Initialize game
  const initializeGame = useCallback((newSize, newMode) => {
    let newBoard;

    if (newMode === "Daily") {
      newBoard = generateDailyPuzzle(newSize);
    } else {
      // Random mode
      const rng = createSeededRNG(Date.now());
      const moves = getSuggestedMoveCount(newSize);
      newBoard = generateRandomPuzzle(newSize, moves, rng);
    }

    setBoard(newBoard);
    setInitialBoard(JSON.parse(JSON.stringify(newBoard))); // Deep copy
    setMoveCount(0);
    setElapsedTime(0);
    setGameWon(false);
    setUndoHistory([]);
    setGameStarted(true);
    setMessage("");
  }, []);

  // Start timer
  useEffect(() => {
    if (!gameStarted || gameWon) {
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedTime(t => t + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameStarted, gameWon]);

  // Handle cell click
  const handleCellClick = useCallback((row, col) => {
    if (gameWon) return;

    setUndoHistory(prev => [...prev, JSON.parse(JSON.stringify(board))]);

    const newBoard = toggleCell(board, row, col);
    setBoard(newBoard);
    setMoveCount(prev => prev + 1);

    // Check win condition
    if (isWon(newBoard)) {
      setGameWon(true);
      setMessage("🎉 All lights off! You won!");
    }
  }, [board, gameWon]);

  // Undo
  const handleUndo = useCallback(() => {
    if (undoHistory.length === 0) {
      setMessage("❌ No moves to undo");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const previousBoard = undoHistory[undoHistory.length - 1];
    setBoard(previousBoard);
    setMoveCount(prev => Math.max(0, prev - 1));
    setUndoHistory(prev => prev.slice(0, -1));
    setMessage("↶ Move undone");
    setTimeout(() => setMessage(""), 1500);
  }, [undoHistory]);

  // Reset to initial state
  const handleReset = useCallback(() => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setMoveCount(0);
    setElapsedTime(0);
    setUndoHistory([]);
    setGameWon(false);
    setMessage("↻ Reset to initial state");
    setTimeout(() => setMessage(""), 1500);
  }, [initialBoard]);

  // New game
  const handleNewGame = useCallback(() => {
    if (!gameStarted) {
      initializeGame(boardSize, mode);
    } else {
      initializeGame(boardSize, mode);
    }
  }, [boardSize, mode, gameStarted, initializeGame]);

  // Setup phase
  if (!gameStarted) {
    return (
      <div className="min-h-screen py-8" style={{
        backgroundImage: 'url(/images/ShamrocksBackground.jpg)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}>
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2 text-indigo-800">Lights Out</h1>
          <p className="text-center text-gray-700 mb-8">Turn off all the lights by clicking cells. Each click toggles the cell and its neighbors!</p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            {/* Board Size Selection */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-indigo-800 mb-4 text-center">Select Board Size</h2>
              <div className="flex justify-center gap-4">
                {[3, 5, 7].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBoardSize(size)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      boardSize === size
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-indigo-800 mb-4 text-center">Select Mode</h2>
              <div className="flex justify-center gap-4">
                {["Random", "Daily"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      mode === m
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {m} Mode
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleNewGame}
              className="w-full px-6 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Game
            </button>
          </div>

          {/* How to Play */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">How to Play</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Click any light to toggle it and its neighbors (up, down, left, right)</li>
              <li>✓ Goal: Turn off all the lights</li>
              <li>✓ Track your moves and time</li>
              <li>✓ Use undo to step back (up to 20 moves)</li>
              <li>✓ Daily Mode: Same puzzle every day</li>
              <li>✓ Random Mode: New puzzle each time</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  return (
    <div className="min-h-screen py-8" style={{
      backgroundImage: 'url(/images/ShamrocksBackground.jpg)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
    }}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-800">Lights Out</h1>

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Moves</p>
            <p className="text-2xl font-bold text-indigo-800">{moveCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Time</p>
            <p className="text-2xl font-bold text-indigo-800">{formatTime(elapsedTime)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Board Size</p>
            <p className="text-2xl font-bold text-indigo-800">{boardSize}×{boardSize}</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="text-center mb-4 text-lg font-semibold">
            {message}
          </div>
        )}

        {/* Game Board */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex justify-center">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
              gap: '8px',
              maxWidth: `${Math.min(boardSize * 80, 500)}px`
            }}
          >
            {board.map((row, rowIdx) =>
              row.map((isOn, colIdx) => (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                  aria-label={`Row ${rowIdx + 1} Column ${colIdx + 1} light ${isOn ? 'on' : 'off'}`}
                  className={`aspect-square rounded-lg font-bold text-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isOn
                      ? 'bg-yellow-400 text-yellow-900 shadow-lg hover:shadow-xl focus:ring-yellow-500'
                      : 'bg-gray-300 text-gray-600 shadow-md hover:shadow-lg focus:ring-gray-500'
                  }`}
                >
                  {isOn ? '💡' : '◯'}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleUndo}
            disabled={undoHistory.length === 0 || gameWon}
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            ↶ Undo ({Math.min(undoHistory.length, 20)})
          </button>
          <button
            onClick={handleReset}
            disabled={gameWon}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            ↻ Reset
          </button>
          <button
            onClick={() => {
              setGameStarted(false);
              setMode("Random");
              setBoardSize(5);
            }}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            New Game
          </button>
          <button
            onClick={handleNewGame}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            New {mode}
          </button>
        </div>

        {/* Win Overlay */}
        {gameWon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h2 className="text-3xl font-bold text-indigo-800 mb-6">You Won!</h2>

              <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Moves</p>
                    <p className="text-2xl font-bold text-indigo-800">{moveCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-2xl font-bold text-indigo-800">{formatTime(elapsedTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Board</p>
                    <p className="text-2xl font-bold text-indigo-800">{boardSize}×{boardSize}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleNewGame}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  New {mode}
                </button>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setMode("Random");
                    setBoardSize(5);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


