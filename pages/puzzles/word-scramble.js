// /pages/games/word-scramble.js
import { useEffect, useState } from "react";

const WORDS = [
    "apple",
    "breeze",
    "castle",
    "planet",
    "silver",
    "forest",
    "rocket",
    "wonder",
    "bridge",
    "throne",
    "candle",
    "danger",
    "energy",
    "fluent",
    "helmet",
    "jungle",
    "laptop",
    "matrix",
    "nature",
    "ocean",
    "pencil",
    "quest",
    "random",
    "signal",
    "tunnel",
    "united",
    "violet",
    "wisdom",
    "yellow",
    "zephyr",
    "anchor",
    "bubble",
    "crystal",
    "dragon",
    "emerald",
    "frozen",
    "glider",
    "harbor",
    "impact",
    "jacket",
    "kitten",
    "legend",
    "magnet",
    "nickel",
    "origin",
    "pirate",
    "ribbon",
    "summer",
    "trophy",
    "vector"
];

function shuffleWord(word) {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
}

export default function WordScramblePage() {
    const [answer, setAnswer] = useState("");
    const [scrambled, setScrambled] = useState("");
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");

    function newPuzzle() {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        setAnswer(word);
        setScrambled(shuffleWord(word));
        setGuess("");
        setMessage("");
    }

    useEffect(() => {
        newPuzzle();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        if (!guess.trim()) return;
        if (guess.trim().toLowerCase() === answer.toLowerCase()) {
            setMessage("✅ Correct! Nice one.");
        } else {
            setMessage("❌ Not quite. Try again!");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Word Scramble</h1>
                
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-6 text-xl font-bold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md">
                        Unscramble the word:
                    </div>

                    <div className="text-4xl font-bold tracking-widest mb-8 text-indigo-800 bg-white px-8 py-4 rounded-xl shadow-lg">
                        {scrambled}
                    </div>

                    <form onSubmit={handleSubmit} className="flex gap-2 mb-6 w-full max-w-md">
                        <input
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Your guess..."
                        />
                        <button 
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            Guess
                        </button>
                    </form>

                    {message && (
                        <p className="mb-6 text-lg font-semibold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md">
                            {message}
                        </p>
                    )}

                    <button 
                        onClick={newPuzzle}
                        className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-semibold"
                    >
                        New Word
                    </button>
                </div>
            </div>
        </div>
    );
}


