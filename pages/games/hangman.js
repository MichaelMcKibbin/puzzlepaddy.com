// /pages/games/hangman.js
import { useState } from "react";

const WORDS = [
    "JAVASCRIPT", "REACT", "PUZZLE", "CODING", "WEBSITE", "COMPUTER", 
    "KEYBOARD", "MONITOR", "BROWSER", "INTERNET", "DEVELOPER", "PROGRAM",
    "FUNCTION", "VARIABLE", "ARRAY", "OBJECT", "STRING", "NUMBER",
    "BOOLEAN", "ALGORITHM", "DATABASE", "SERVER", "CLIENT", "FRAMEWORK"
];

function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function HangmanPage() {
    const [word, setWord] = useState(getRandomWord());
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [gameStatus, setGameStatus] = useState("playing"); // playing, won, lost

    const maxWrongGuesses = 6;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const displayWord = word
        .split("")
        .map(letter => guessedLetters.has(letter) ? letter : "_")
        .join(" ");

    const wrongLetters = Array.from(guessedLetters).filter(letter => !word.includes(letter));

    function guessLetter(letter) {
        if (guessedLetters.has(letter) || gameStatus !== "playing") return;

        const newGuessedLetters = new Set([...guessedLetters, letter]);
        setGuessedLetters(newGuessedLetters);

        if (!word.includes(letter)) {
            const newWrongGuesses = wrongGuesses + 1;
            setWrongGuesses(newWrongGuesses);
            
            if (newWrongGuesses >= maxWrongGuesses) {
                setGameStatus("lost");
            }
        } else {
            // Check if word is complete
            const isComplete = word.split("").every(letter => newGuessedLetters.has(letter));
            if (isComplete) {
                setGameStatus("won");
            }
        }
    }

    function newGame() {
        setWord(getRandomWord());
        setGuessedLetters(new Set());
        setWrongGuesses(0);
        setGameStatus("playing");
    }

    const hangmanStages = [
        "", // 0 wrong
        "😟", // 1 wrong
        "😰", // 2 wrong
        "😨", // 3 wrong
        "😱", // 4 wrong
        "💀", // 5 wrong
        "☠️"  // 6 wrong - game over
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">Hangman</h1>
                
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-6 text-xl font-bold text-purple-700 bg-white px-6 py-3 rounded-lg shadow-md text-center">
                        Guess the word letter by letter!
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
                        {/* Hangman visual */}
                        <div className="text-8xl mb-4">
                            {hangmanStages[wrongGuesses]}
                        </div>
                        
                        {/* Wrong guesses counter */}
                        <div className="text-lg mb-4 text-gray-600">
                            Wrong guesses: {wrongGuesses} / {maxWrongGuesses}
                        </div>

                        {/* Word display */}
                        <div className="text-3xl font-mono font-bold mb-6 text-purple-800 tracking-wider">
                            {displayWord}
                        </div>

                        {/* Game status */}
                        {gameStatus === "won" && (
                            <div className="text-2xl font-bold text-green-600 mb-4">
                                🎉 You Won! 🎉
                            </div>
                        )}
                        
                        {gameStatus === "lost" && (
                            <div className="text-2xl font-bold text-red-600 mb-4">
                                💀 Game Over! The word was: {word}
                            </div>
                        )}

                        {/* Wrong letters */}
                        {wrongLetters.length > 0 && (
                            <div className="mb-4">
                                <span className="text-gray-600">Wrong letters: </span>
                                <span className="text-red-600 font-mono">
                                    {wrongLetters.join(", ")}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Alphabet buttons */}
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 mb-6 max-w-2xl">
                        {alphabet.map(letter => (
                            <button
                                key={letter}
                                onClick={() => guessLetter(letter)}
                                disabled={guessedLetters.has(letter) || gameStatus !== "playing"}
                                className={`w-10 h-10 font-bold rounded transition-colors ${
                                    guessedLetters.has(letter)
                                        ? word.includes(letter)
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                        : gameStatus === "playing"
                                            ? "bg-purple-600 text-white hover:bg-purple-700"
                                            : "bg-gray-300 text-gray-500"
                                }`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>

                    {/* New game button */}
                    <button 
                        onClick={newGame}
                        className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                    >
                        New Game
                    </button>
                </div>
            </div>
        </div>
    );
}