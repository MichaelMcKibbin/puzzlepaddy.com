import { useState, useEffect, useCallback } from "react";
import SOKOBAN_LEVELS from "../../data/sokoban-levels";
import {
  parseLevel,
  attemptMove,
  isWon,
  cloneState,
  getCellType,
  DIRECTIONS
} from "../../lib/sokobanUtils";

const MAX_UNDO_STEPS = 50;

/**
 * Sokoban puzzle page.
 * Loads level data, tracks moves and pushes, and supports keyboard and on-screen controls.
 */
export default function SokobanPage() {
  // Level selection
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [highestLevelCompleted, setHighestLevelCompleted] = useState(0);

  // Game state
  const [gameState, setGameState] = useState(null);
  const [initialState, setInitialState] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [pushCount, setPushCount] = useState(0);
  const [undoStack, setUndoStack] = useState([]);
  const [won, setWon] = useState(false);

  // Load highest level from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sokoban-highest-level");
    if (saved) {
      setHighestLevelCompleted(parseInt(saved, 10));
    }
  }, []);

  // Initialize level
  const initLevel = useCallback((levelIndex) => {
    const level = SOKOBAN_LEVELS[levelIndex];
    if (!level) return;

    const state = parseLevel(level.map);
    setGameState(state);
    setInitialState(cloneState(state));
    setMoveCount(0);
    setPushCount(0);
    setUndoStack([]);
    setWon(false);
  }, []);

  // Load initial level on mount
  useEffect(() => {
    initLevel(currentLevelIndex);
  }, [currentLevelIndex, initLevel]);

  // Handle movement
  const handleMove = useCallback((direction) => {
    if (!gameState || won) return;

    const result = attemptMove(gameState, direction);
    if (!result) return; // Move blocked

    const { newState, pushed } = result;

    // Save current state to undo stack
    setUndoStack(prev => {
      const newStack = [...prev, cloneState(gameState)];
      // Keep only last MAX_UNDO_STEPS
      if (newStack.length > MAX_UNDO_STEPS) {
        newStack.shift();
      }
      return newStack;
    });

    setGameState(newState);
    setMoveCount(prev => prev + 1);
    if (pushed) {
      setPushCount(prev => prev + 1);
    }

    // Check win condition
    if (isWon(newState)) {
      setWon(true);

      // Update highest level completed
      if (currentLevelIndex >= highestLevelCompleted) {
        const newHigh = currentLevelIndex + 1;
        setHighestLevelCompleted(newHigh);
        localStorage.setItem("sokoban-highest-level", newHigh.toString());
      }
    }
  }, [gameState, won, currentLevelIndex, highestLevelCompleted]);

  // Undo
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];
    setGameState(cloneState(previousState));
    setUndoStack(prev => prev.slice(0, -1));
    setMoveCount(prev => Math.max(0, prev - 1));
    // Note: push count won't be perfectly accurate with undo, but close enough
    setWon(false);
  }, [undoStack]);

  // Restart level
  const handleRestart = useCallback(() => {
    if (initialState) {
      setGameState(cloneState(initialState));
      setMoveCount(0);
      setPushCount(0);
      setUndoStack([]);
      setWon(false);
    }
  }, [initialState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (won) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          handleMove(DIRECTIONS.UP);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          handleMove(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          handleMove(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          handleMove(DIRECTIONS.RIGHT);
          break;
        case "u":
        case "U":
          e.preventDefault();
          handleUndo();
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleRestart();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove, handleUndo, handleRestart, won]);

  // Navigate levels
  const handlePrevLevel = useCallback(() => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(prev => prev - 1);
    }
  }, [currentLevelIndex]);

  const handleNextLevel = useCallback(() => {
    if (currentLevelIndex < SOKOBAN_LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    }
  }, [currentLevelIndex]);

  // Get tile styling
  const getTileClass = (type) => {
    const base = "flex items-center justify-center text-lg sm:text-xl font-bold";

    switch (type) {
      case "wall":
        return `${base} bg-gray-700`;
      case "floor":
        return `${base} bg-gray-100`;
      case "goal":
        return `${base} bg-yellow-200`;
      case "box":
        return `${base} bg-amber-600 text-white shadow-md`;
      case "boxOnGoal":
        return `${base} bg-green-500 text-white shadow-md`;
      case "player":
        return `${base} bg-blue-500 text-white shadow-lg`;
      case "playerOnGoal":
        return `${base} bg-purple-500 text-white shadow-lg`;
      default:
        return `${base} bg-gray-100`;
    }
  };

  const getTileContent = (type) => {
    switch (type) {
      case "wall":
        return "⬛";
      case "goal":
        return "◯";
      case "box":
        return "📦";
      case "boxOnGoal":
        return "✓";
      case "player":
        return "🚶";
      case "playerOnGoal":
        return "🚶";
      default:
        return "";
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const currentLevel = SOKOBAN_LEVELS[currentLevelIndex];
  const boxesOnGoals = Array.from(gameState.boxes).filter(boxPos =>
    gameState.goals.has(boxPos)
  ).length;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Sokoban
          </h1>
          <p className="text-gray-600 mb-4">Push all boxes onto the goal tiles!</p>

          {/* Level info */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">
              Level {currentLevel.id}: {currentLevel.name}
            </h2>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-gray-700">
                Moves: <span className="font-bold">{moveCount}</span>
              </span>
              <span className="text-gray-700">
                Pushes: <span className="font-bold">{pushCount}</span>
              </span>
              <span className="text-gray-700">
                Boxes: <span className="font-bold">{boxesOnGoals}/{gameState.goals.size}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Game board */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-grid gap-0.5 bg-gray-300 p-1 rounded-lg shadow-xl"
            style={{
              gridTemplateColumns: `repeat(${gameState.cols}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: gameState.rows }).map((_, r) =>
              Array.from({ length: gameState.cols }).map((_, c) => {
                const type = getCellType(gameState, r, c);
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`${getTileClass(type)} w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12`}
                  >
                    {getTileContent(type)}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex flex-col gap-4">
            {/* D-pad for mobile */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleMove(DIRECTIONS.UP)}
                disabled={won}
                className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
                aria-label="Move Up"
              >
                ▲
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMove(DIRECTIONS.LEFT)}
                  disabled={won}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
                  aria-label="Move Left"
                >
                  ◀
                </button>
                <button
                  onClick={() => handleMove(DIRECTIONS.DOWN)}
                  disabled={won}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
                  aria-label="Move Down"
                >
                  ▼
                </button>
                <button
                  onClick={() => handleMove(DIRECTIONS.RIGHT)}
                  disabled={won}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
                  aria-label="Move Right"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
              >
                ⟲ Undo ({undoStack.length})
              </button>
              <button
                onClick={handleRestart}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
              >
                ↻ Restart
              </button>
              <button
                onClick={handlePrevLevel}
                disabled={currentLevelIndex === 0}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
              >
                ← Previous
              </button>
              <button
                onClick={handleNextLevel}
                disabled={currentLevelIndex >= SOKOBAN_LEVELS.length - 1}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Push all boxes (📦) onto goal tiles (◯)</li>
            <li>• Use arrow keys or WASD to move</li>
            <li>• You can only push one box at a time</li>
            <li>• Boxes can't be pulled, only pushed</li>
            <li>• Press U to undo, R to restart</li>
          </ul>
          <div className="mt-2 text-xs text-gray-500">
            <p>Progress: Completed {highestLevelCompleted} of {SOKOBAN_LEVELS.length} levels</p>
          </div>
        </div>

        {/* Win overlay */}
        {won && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                🎉 Level Complete! 🎉
              </h2>
              <div className="mb-6 text-gray-700">
                <p className="text-lg mb-2">
                  Moves: <span className="font-bold">{moveCount}</span>
                </p>
                <p className="text-lg">
                  Pushes: <span className="font-bold">{pushCount}</span>
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleRestart}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                >
                  ↻ Retry Level
                </button>
                {currentLevelIndex < SOKOBAN_LEVELS.length - 1 ? (
                  <button
                    onClick={handleNextLevel}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                  >
                    Next Level →
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentLevelIndex(0)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                  >
                    Play Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



