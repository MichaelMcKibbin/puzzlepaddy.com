import { useEffect, useState, useCallback, useMemo } from "react";
import WORD_LIST from "../../data/word-ladder-words.json";
import {
  differsByOneLetter,
  findShortestPath,
  getNextWordHint,
  validateWordMove,
  getDailySeed,
  generateDailyPuzzle,
  getDifficultySettings,
  formatTime,
} from "../../lib/wordLadderUtils";

const DIFFICULTY_SETTINGS = getDifficultySettings();

/**
 * Word Ladder page.
 * Generates target words, validates allowed moves, and tracks hints and scoring as the ladder grows.
 */
export default function WordLadderPage() {
  // Game state
  const [difficulty, setDifficulty] = useState("Easy");
  const [mode, setMode] = useState("Normal"); // Normal or Daily
  const [gameState, setGameState] = useState("setup"); // setup, playing, won, lost

  // Puzzle state
  const [startWord, setStartWord] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [ladder, setLadder] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [validationError, setValidationError] = useState(false);

  // Game tracking
  const [movesUsed, setMovesUsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Best stats (localStorage)
  const [bestMoves, setBestMoves] = useState(0);
  const [bestTime, setBestTime] = useState(0);

  // Get dictionary for current word length
  const dictionary = useMemo(() => {
    const length = DIFFICULTY_SETTINGS[difficulty].wordLength;
    return (WORD_LIST[length] || []).map(w => w.toUpperCase());
  }, [difficulty]);

  // Generate puzzle on mount or when difficulty/mode changes
  useEffect(() => {
    if (gameState === "setup") {
      if (mode === "Daily") {
        const seed = getDailySeed();
        const puzzle = generateDailyPuzzle(dictionary, DIFFICULTY_SETTINGS[difficulty].wordLength, seed);
        if (puzzle) {
          setStartWord(puzzle.start);
          setTargetWord(puzzle.target);
        }
      } else {
        // Random puzzle for Normal mode
        const length = DIFFICULTY_SETTINGS[difficulty].wordLength;
        const wordsOfLength = dictionary.filter(w => w.length === length);
        if (wordsOfLength.length >= 2) {
          const start = wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)];
          let target = wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)];
          while (target === start) {
            target = wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)];
          }
          setStartWord(start);
          setTargetWord(target);
        }
      }
    }
  }, [difficulty, mode, gameState, dictionary]);

  // Elapsed time effect
  useEffect(() => {
    if (gameState !== "playing" || !startTime) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, startTime]);

  // Load best stats from localStorage
  useEffect(() => {
    if (startWord && targetWord) {
      const key = `wordladder_${startWord}_${targetWord}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const { moves, time } = JSON.parse(saved);
        setBestMoves(moves);
        setBestTime(time);
      } else {
        setBestMoves(0);
        setBestTime(0);
      }
    }
  }, [startWord, targetWord]);

  const startGame = useCallback(() => {
    setGameState("playing");
    setLadder([startWord]);
    setMovesUsed(0);
    setHintsUsed(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setCurrentInput("");
    setValidationMessage("");
    setValidationError(false);
  }, [startWord]);

  const submitWord = useCallback(() => {
    if (!currentInput.trim()) {
      return;
    }

    const word = currentInput.toUpperCase();
    const previousWord = ladder[ladder.length - 1];
    const moveLimit = DIFFICULTY_SETTINGS[difficulty].moveLimit;

    // Validate move
    const validation = validateWordMove(word, previousWord, ladder, dictionary);

    if (!validation.isValid) {
      setValidationMessage(validation.error);
      setValidationError(true);
      return;
    }

    // Valid move
    setValidationError(false);
    setValidationMessage("✓ Valid word!");
    setCurrentInput("");

    const newLadder = [...ladder, word];
    setLadder(newLadder);
    setMovesUsed(newLadder.length - 1);

    // Check for win
    if (word === targetWord) {
      setGameState("won");
      saveStats(newLadder.length - 1, elapsedTime);
    } else if (newLadder.length - 1 >= moveLimit) {
      // Check if player exceeded move limit
      setGameState("lost");
    }
  }, [currentInput, ladder, difficulty, dictionary, elapsedTime]);

  const getHint = useCallback(() => {
    if (hintsUsed >= 3) {
      setValidationMessage("❌ No more hints available!");
      setValidationError(true);
      return;
    }

    const currentWord = ladder[ladder.length - 1];
    const hint = getNextWordHint(currentWord, targetWord, dictionary, ladder);

    if (hint) {
      setValidationMessage(`💡 Try: ${hint}`);
      setValidationError(false);
      setHintsUsed(hintsUsed + 1);
    } else {
      setValidationMessage("❌ No valid next word found!");
      setValidationError(true);
    }
  }, [ladder, targetWord, dictionary, hintsUsed]);

  const resetGame = useCallback(() => {
    setGameState("setup");
    setLadder([]);
    setCurrentInput("");
    setValidationMessage("");
    setValidationError(false);
    setMovesUsed(0);
    setHintsUsed(0);
    setStartTime(null);
    setElapsedTime(0);
  }, []);

  const newPuzzle = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const saveStats = useCallback((moves, time) => {
    if (startWord && targetWord) {
      const key = `wordladder_${startWord}_${targetWord}`;
      const existing = localStorage.getItem(key);
      let shouldSave = true;

      if (existing) {
        const { moves: existingMoves, time: existingTime } = JSON.parse(existing);
        // Save if fewer moves, or same moves but faster
        if (moves < existingMoves || (moves === existingMoves && time < existingTime)) {
          localStorage.setItem(key, JSON.stringify({ moves, time }));
        }
      } else {
        localStorage.setItem(key, JSON.stringify({ moves, time }));
      }
    }
  }, [startWord, targetWord]);

  const moveLimit = DIFFICULTY_SETTINGS[difficulty].moveLimit;
  const isGameOver = gameState === "won" || gameState === "lost";
  const canStartGame = gameState === "setup" && startWord && targetWord;
  const canSubmit = gameState === "playing" && currentInput.trim().length > 0;

  return (
    <div className="min-h-screen py-8" style={{
      backgroundImage: 'url(/images/ShamrocksBackground.jpg)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
    }}>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-800">Word Ladder</h1>
        <p className="text-center text-gray-700 mb-8">Transform one word into another, one letter at a time!</p>

        {/* Setup Phase */}
        {gameState === "setup" && (
          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            <div className="flex gap-4">
              {["Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-colors ${
                    difficulty === diff
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              {["Normal", "Daily"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-colors ${
                    mode === m
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {m} Mode
                </button>
              ))}
            </div>

            {startWord && targetWord && (
              <div className="bg-white rounded-lg shadow-lg p-6 w-full">
                <div className="flex justify-between gap-8 mb-4">
                  <div className="flex-1 text-center">
                    <p className="text-sm text-gray-600 mb-2">START</p>
                    <p className="text-3xl font-bold text-indigo-800">{startWord}</p>
                  </div>
                  <div className="flex items-center text-gray-400 text-2xl">→</div>
                  <div className="flex-1 text-center">
                    <p className="text-sm text-gray-600 mb-2">TARGET</p>
                    <p className="text-3xl font-bold text-indigo-800">{targetWord}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Move Limit: {moveLimit} | Dictionary Size: {dictionary.length}
                </p>
                <button
                  onClick={startGame}
                  className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Start Game
                </button>
              </div>
            )}
          </div>
        )}

        {/* Playing Phase */}
        {gameState === "playing" && (
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Stats Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 w-full flex justify-around text-center">
              <div>
                <p className="text-sm text-gray-600">Moves Used</p>
                <p className="text-2xl font-bold text-indigo-800">{movesUsed}/{moveLimit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hints Used</p>
                <p className="text-2xl font-bold text-indigo-800">{hintsUsed}/3</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-2xl font-bold text-indigo-800">{formatTime(elapsedTime)}</p>
              </div>
            </div>

            {/* Ladder Display */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-full">
              <p className="text-center text-sm text-gray-600 mb-3">Current Ladder:</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {ladder.map((word, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="px-4 py-2 bg-indigo-100 border-2 border-indigo-600 rounded-lg font-bold text-indigo-800">
                      {word}
                    </div>
                    {idx < ladder.length - 1 && <span className="mx-2 text-gray-400">→</span>}
                  </div>
                ))}
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-2">Target: <span className="font-bold text-indigo-800">{targetWord}</span></p>
              </div>

              {/* Input Section */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitWord();
                }}
                className="flex gap-2 mb-4"
              >
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => {
                    setCurrentInput(e.target.value.toUpperCase());
                    setValidationMessage("");
                  }}
                  placeholder="Enter next word..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-bold text-center"
                  disabled={movesUsed >= moveLimit}
                  maxLength={DIFFICULTY_SETTINGS[difficulty].wordLength}
                />
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors shadow-md"
                >
                  Submit
                </button>
              </form>

              {/* Validation Message */}
              {validationMessage && (
                <div className={`text-center py-2 px-4 rounded-lg mb-4 ${
                  validationError
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}>
                  {validationMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={getHint}
                  disabled={hintsUsed >= 3 || movesUsed >= moveLimit}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 transition-colors shadow-md"
                >
                  💡 Hint ({3 - hintsUsed} left)
                </button>
                <button
                  onClick={resetGame}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Move Limit Warning */}
            {movesUsed >= moveLimit && (
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 w-full text-center">
                <p className="text-red-800 font-bold">❌ Move limit reached!</p>
                <p className="text-red-700 text-sm">The answer was: <span className="font-bold">{targetWord}</span></p>
              </div>
            )}
          </div>
        )}

        {/* Won Phase */}
        {gameState === "won" && (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h2 className="text-3xl font-bold text-indigo-800 mb-4">You Won!</h2>

              <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Moves Used</p>
                    <p className="text-2xl font-bold text-indigo-800">{movesUsed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-2xl font-bold text-indigo-800">{formatTime(elapsedTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hints Used</p>
                    <p className="text-2xl font-bold text-indigo-800">{hintsUsed}</p>
                  </div>
                </div>

                {bestMoves > 0 && (
                  <div className="text-sm text-gray-600 border-t pt-4">
                    <p className="mb-2">Your best: <span className="font-bold text-indigo-800">{bestMoves} moves</span> in <span className="font-bold text-indigo-800">{formatTime(bestTime)}</span></p>
                    {movesUsed < bestMoves && <p className="text-green-600 font-bold">New personal best! 🏆</p>}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={newPuzzle}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  New Puzzle
                </button>
                <button
                  onClick={() => {
                    setDifficulty("Easy");
                    setMode("Normal");
                    resetGame();
                  }}
                  className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-semibold"
                >
                  Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lost Phase */}
        {gameState === "lost" && (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full text-center">
              <p className="text-5xl mb-4">😢</p>
              <h2 className="text-3xl font-bold text-indigo-800 mb-4">Game Over</h2>

              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-gray-700 mb-2">You've reached the move limit.</p>
                <p className="text-sm text-gray-600 mb-4">The target word was:</p>
                <p className="text-3xl font-bold text-indigo-800 mb-4">{targetWord}</p>
                <div className="text-sm text-gray-600">
                  <p>Moves used: {movesUsed}/{moveLimit}</p>
                  <p>Time: {formatTime(elapsedTime)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={newPuzzle}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Try Another
                </button>
                <button
                  onClick={() => {
                    setDifficulty("Easy");
                    setMode("Normal");
                    resetGame();
                  }}
                  className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-semibold"
                >
                  Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How to Play */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-indigo-800 mb-4">How to Play</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Transform the START word into the TARGET word</li>
            <li>✓ Each step must change exactly ONE letter</li>
            <li>✓ All words must be valid English words</li>
            <li>✓ You can't use the same word twice</li>
            <li>✓ Stay within the move limit to win</li>
            <li>✓ Use hints strategically (3 hints available)</li>
            <li>✓ Daily Mode shows the same puzzle every day</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

