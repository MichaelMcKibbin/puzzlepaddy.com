// /pages/games/mastermind.js
import { useEffect, useState } from "react";

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];
const CODE_LENGTH = 4;
const MAX_TURNS = 10;

function randomCode() {
    return Array.from({ length: CODE_LENGTH }, () => {
        const idx = Math.floor(Math.random() * COLORS.length);
        return COLORS[idx];
    });
}

function evaluateGuess(secret, guess) {
    let exact = 0;
    let colorOnly = 0;

    const secretCopy = [...secret];
    const guessCopy = [...guess];

    // exact
    for (let i = 0; i < CODE_LENGTH; i++) {
        if (guessCopy[i] === secretCopy[i]) {
            exact++;
            secretCopy[i] = null;
            guessCopy[i] = null;
        }
    }

    // color-only
    for (let i = 0; i < CODE_LENGTH; i++) {
        if (!guessCopy[i]) continue;
        const idx = secretCopy.indexOf(guessCopy[i]);
        if (idx !== -1) {
            colorOnly++;
            secretCopy[idx] = null;
        }
    }

    return { exact, colorOnly };
}

export default function MastermindPage() {
    const [secret, setSecret] = useState([]);
    const [currentGuess, setCurrentGuess] = useState([]);
    const [history, setHistory] = useState([]);
    const [status, setStatus] = useState("");
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        restart();
    }, []);

    function restart() {
        setSecret(randomCode());
        setCurrentGuess([]);
        setHistory([]);
        setStatus("");
        setGameOver(false);
    }

    function addColor(color) {
        if (gameOver) return;
        if (currentGuess.length >= CODE_LENGTH) return;
        setCurrentGuess((g) => [...g, color]);
    }

    function undo() {
        if (gameOver) return;
        setCurrentGuess((g) => g.slice(0, -1));
    }

    function submitGuess() {
        if (gameOver || currentGuess.length !== CODE_LENGTH) return;

        const result = evaluateGuess(secret, currentGuess);
        const newEntry = { guess: currentGuess, result };
        const newHistory = [newEntry, ...history];
        setHistory(newHistory);
        setCurrentGuess([]);

        if (result.exact === CODE_LENGTH) {
            setStatus("🎉 You cracked the code!");
            setGameOver(true);
        } else if (newHistory.length >= MAX_TURNS) {
            setStatus("❌ Out of turns! The code was revealed.");
            setGameOver(true);
        } else {
            setStatus("");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Mastermind</h1>
                
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-6 text-xl font-bold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md text-center">
                        Guess the {CODE_LENGTH}-color code in {MAX_TURNS} turns
                    </div>

                    {/* Color buttons */}
                    <div className="flex justify-center gap-2 mb-6 flex-wrap">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => addColor(color)}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                aria-label={color}
                            />
                        ))}
                    </div>

                    {/* Current guess */}
                    <div className="flex justify-center gap-2 mb-6 p-4 bg-white rounded-xl shadow-lg">
                        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                                {currentGuess[i] && (
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: currentGuess[i] }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mb-6 space-x-2">
                        <button 
                            onClick={submitGuess}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            Submit Guess
                        </button>
                        <button 
                            onClick={undo}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
                        >
                            Undo
                        </button>
                        <button 
                            onClick={restart}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
                        >
                            Restart
                        </button>
                    </div>

                    {status && <p className="mb-4 text-lg font-semibold text-indigo-700">{status}</p>}

                    {/* Reveal secret when game over */}
                    {gameOver && (
                        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                            <p className="mb-2 font-semibold">Secret code:</p>
                            <div className="flex justify-center gap-2">
                                {secret.map((color, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* History */}
                    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
                        <h2 className="text-lg font-semibold mb-3 text-center">History</h2>
                        <div className="max-h-48 overflow-y-auto border-t border-gray-200 pt-3">
                            {history.length === 0 && (
                                <p className="text-sm text-gray-500 text-center">
                                    No guesses yet.
                                </p>
                            )}
                            {history.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded">
                                    <div className="flex gap-1">
                                        {entry.guess.map((color, i) => (
                                            <div
                                                key={i}
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-xs flex gap-2 text-gray-700">
                                        <span>● {entry.result.exact}</span>
                                        <span>○ {entry.result.colorOnly}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


