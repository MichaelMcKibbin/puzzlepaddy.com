// File: `pages/puzzles/word-scramble.js`
import { useEffect, useState } from "react";
import THEME_TYPES from "../../data/theme-lists.json";

function shuffleWord(word) {
  if (!word) return "";
  const shuffleOnce = (w) => {
    const arr = w.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  let scrambled = shuffleOnce(word);
  let attempts = 0;
  while (scrambled === word && attempts < 10) {
    scrambled = shuffleOnce(word);
    attempts++;
  }
  return scrambled;
}

export default function WordScramblePage() {
  const typeKeys = Object.keys(THEME_TYPES);
  const [themeType, setThemeType] = useState(typeKeys[0] || "");
  const themeLists = THEME_TYPES[themeType] || {};
  const themeKeys = Object.keys(themeLists);
  const [theme, setTheme] = useState(themeKeys[0] || "");
  const [answer, setAnswer] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const firstTheme = Object.keys(THEME_TYPES[themeType] || {})[0] || "";
    setTheme(firstTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeType]);

  function newPuzzle() {
    const list = (THEME_TYPES[themeType] && THEME_TYPES[themeType][theme]) || [];
    if (!list || list.length === 0) {
      setAnswer("");
      setScrambled("");
      setGuess("");
      setMessage("");
      return;
    }
    const word = list[Math.floor(Math.random() * list.length)];
    setAnswer(word);
    setScrambled(shuffleWord(word));
    setGuess("");
    setMessage("");
  }

  useEffect(() => {
    if (theme) newPuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, themeType]);

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
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Word Scramble</h1>

          <div className="flex flex-col items-center justify-center">
            <label className="mb-4 w-full max-w-md flex items-center gap-2">
              <span className="font-semibold text-indigo-700">Type:</span>
              <select
                  value={themeType}
                  onChange={(e) => setThemeType(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
              >
                {typeKeys.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                ))}
              </select>
            </label>

            <label className="mb-4 w-full max-w-md flex items-center gap-2">
              <span className="font-semibold text-indigo-700">Theme:</span>
              <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
              >
                {themeKeys.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                ))}
              </select>
            </label>

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

            <div className="flex gap-2">
              <button
                  onClick={newPuzzle}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-semibold"
              >
                New Word
              </button>
              <button
                  onClick={() => {
                    const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
                    const themes = Object.keys(THEME_TYPES[randomType] || {});
                    const randomTheme = themes[Math.floor(Math.random() * themes.length)] || "";
                    setThemeType(randomType);
                    setTheme(randomTheme);
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-semibold"
              >
                Random Theme
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}