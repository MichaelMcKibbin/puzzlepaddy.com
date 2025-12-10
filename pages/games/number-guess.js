// /pages/games/number-guess.js
import { useState } from "react";

export default function NumberGuessPage() {
    const [gameMode, setGameMode] = useState("cpu-guesses"); // "cpu-guesses" or "player-guesses"
    const [gameState, setGameState] = useState("setup"); // "setup", "playing", "won"
    
    // CPU guesses player's number
    const [playerNumber, setPlayerNumber] = useState("");
    const [cpuGuess, setCpuGuess] = useState(null);
    const [cpuMin, setCpuMin] = useState(1);
    const [cpuMax, setCpuMax] = useState(100);
    const [cpuGuesses, setCpuGuesses] = useState([]);
    
    // Player guesses CPU's number
    const [cpuNumber, setCpuNumber] = useState(null);
    const [playerGuess, setPlayerGuess] = useState("");
    const [playerGuesses, setPlayerGuesses] = useState([]);

    function startCpuGuessesMode() {
        const firstGuess = Math.floor(Math.random() * 100) + 1;
        setCpuGuess(firstGuess);
        setCpuGuesses([firstGuess]);
        setGameState("playing");
    }

    function startPlayerGuessesMode() {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        setCpuNumber(randomNumber);
        setPlayerGuesses([]);
        setGameState("playing");
    }

    function handleCpuFeedback(feedback) {
        if (feedback === "correct") {
            setGameState("won");
            return;
        }

        let newMin = cpuMin;
        let newMax = cpuMax;

        if (feedback === "higher") {
            newMin = cpuGuess + 1;
        } else if (feedback === "lower") {
            newMax = cpuGuess - 1;
        }

        // Calculate midpoint with small random offset
        const midpoint = Math.floor((newMin + newMax) / 2);
        const randomOffset = Math.floor(Math.random() * 11) - 5; // -5 to +5
        let nextGuess = midpoint + randomOffset;
        
        // Keep within bounds
        nextGuess = Math.max(newMin, Math.min(newMax, nextGuess));

        setCpuMin(newMin);
        setCpuMax(newMax);
        setCpuGuess(nextGuess);
        setCpuGuesses([...cpuGuesses, nextGuess]);
    }

    function handlePlayerGuess() {
        const guess = parseInt(playerGuess);
        if (isNaN(guess) || guess < 1 || guess > 100) return;

        const newGuesses = [...playerGuesses, { guess, feedback: getFeedback(guess, cpuNumber) }];
        setPlayerGuesses(newGuesses);
        setPlayerGuess("");

        if (guess === cpuNumber) {
            setGameState("won");
        }
    }

    function getFeedback(guess, target) {
        if (guess === target) return "correct";
        if (guess < target) return "higher";
        return "lower";
    }

    function resetGame() {
        setGameState("setup");
        setPlayerNumber("");
        setCpuGuess(null);
        setCpuMin(1);
        setCpuMax(100);
        setCpuGuesses([]);
        setCpuNumber(null);
        setPlayerGuess("");
        setPlayerGuesses([]);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-orange-800">Number Guessing Game</h1>
                
                <div className="flex flex-col items-center justify-center">
                    {gameState === "setup" && (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <h2 className="text-2xl font-bold mb-6 text-orange-700">Choose Game Mode</h2>
                            
                            <div className="space-y-4 mb-6">
                                <button
                                    onClick={() => setGameMode("cpu-guesses")}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                                        gameMode === "cpu-guesses" 
                                            ? "border-orange-500 bg-orange-50" 
                                            : "border-gray-300 hover:border-orange-300"
                                    }`}
                                >
                                    <div className="font-bold text-lg">🤖 CPU Guesses Your Number</div>
                                    <div className="text-sm text-gray-600">You think of a number, CPU tries to guess it</div>
                                </button>
                                
                                <button
                                    onClick={() => setGameMode("player-guesses")}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                                        gameMode === "player-guesses" 
                                            ? "border-orange-500 bg-orange-50" 
                                            : "border-gray-300 hover:border-orange-300"
                                    }`}
                                >
                                    <div className="font-bold text-lg">🧠 You Guess CPU's Number</div>
                                    <div className="text-sm text-gray-600">CPU thinks of a number, you try to guess it</div>
                                </button>
                            </div>

                            {gameMode === "cpu-guesses" && (
                                <div>
                                    <p className="mb-6 text-gray-700">Think of a number between 1 and 100 and keep it secret!</p>
                                    <button
                                        onClick={startCpuGuessesMode}
                                        className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
                                    >
                                        I've Got My Number - Start Guessing!
                                    </button>
                                </div>
                            )}

                            {gameMode === "player-guesses" && (
                                <button
                                    onClick={startPlayerGuessesMode}
                                    className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Start Game
                                </button>
                            )}
                        </div>
                    )}

                    {gameState === "playing" && gameMode === "cpu-guesses" && (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <h2 className="text-2xl font-bold mb-6 text-orange-700">CPU is guessing your number!</h2>
                            
                            <div className="text-4xl font-bold mb-6 text-orange-800">
                                CPU guesses: {cpuGuess}
                            </div>
                            
                            <p className="mb-6 text-gray-700">Is your number higher, lower, or correct?</p>
                            
                            <div className="space-x-4 mb-6">
                                <button
                                    onClick={() => handleCpuFeedback("higher")}
                                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Higher ⬆️
                                </button>
                                <button
                                    onClick={() => handleCpuFeedback("lower")}
                                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Lower ⬇️
                                </button>
                                <button
                                    onClick={() => handleCpuFeedback("correct")}
                                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Correct! 🎉
                                </button>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p>Guesses so far: {cpuGuesses.join(", ")}</p>
                                <p>Range: {cpuMin} - {cpuMax}</p>
                            </div>
                        </div>
                    )}

                    {gameState === "playing" && gameMode === "player-guesses" && (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <h2 className="text-2xl font-bold mb-6 text-orange-700">Guess the CPU's number!</h2>
                            
                            <p className="mb-6 text-gray-700">The CPU has chosen a number between 1 and 100. Can you guess it?</p>
                            
                            <div className="mb-6">
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={playerGuess}
                                    onChange={(e) => setPlayerGuess(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handlePlayerGuess()}
                                    className="w-32 p-2 border border-gray-300 rounded text-center mr-4"
                                    placeholder="1-100"
                                />
                                <button
                                    onClick={handlePlayerGuess}
                                    className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Guess
                                </button>
                            </div>

                            {playerGuesses.length > 0 && (
                                <div className="text-left max-w-md mx-auto">
                                    <h3 className="font-bold mb-2">Your guesses:</h3>
                                    {playerGuesses.map((guess, i) => (
                                        <div key={i} className="flex justify-between items-center py-1">
                                            <span>{guess.guess}</span>
                                            <span className={`font-bold ${
                                                guess.feedback === "correct" ? "text-green-600" :
                                                guess.feedback === "higher" ? "text-blue-600" : "text-red-600"
                                            }`}>
                                                {guess.feedback === "correct" ? "🎉 Correct!" :
                                                 guess.feedback === "higher" ? "⬆️ Higher" : "⬇️ Lower"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {gameState === "won" && (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <h2 className="text-3xl font-bold mb-6 text-green-600">🎉 Game Won! 🎉</h2>
                            
                            {gameMode === "cpu-guesses" ? (
                                <div>
                                    <p className="text-lg mb-4">The CPU guessed your number correctly!</p>
                                    <p className="text-gray-600 mb-6">It took {cpuGuesses.length} guesses: {cpuGuesses.join(", ")}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-lg mb-4">You guessed the CPU's number {cpuNumber} correctly!</p>
                                    <p className="text-gray-600 mb-6">It took you {playerGuesses.length} guesses!</p>
                                </div>
                            )}
                            
                            <button
                                onClick={resetGame}
                                className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Play Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}