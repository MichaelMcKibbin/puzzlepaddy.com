// file: `pages/games/hangman.js` (top)
// javascript
import { useEffect, useState } from "react";
import ENGLISH from "../../data/theme-lists-english.json";
import US_ENGLISH from "../../data/theme-lists-us-english.json";

const LANGUAGE_MAP = {
  English: ENGLISH,
  "US English": US_ENGLISH,
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const WRONG_EMOJI_STAGES = [
      "", // 0 wrong
      "😟", // 1 wrong
      "😰", // 2 wrong
      "😨", // 3 wrong
      "😱", // 4 wrong
      "💀", // 5 wrong
      "☠️"  // 6 wrong - game over
    ];


function collectThemeList(languageMap, language, themeType, theme) {
  const groups = languageMap[language] || {};
  if (!themeType) {
    // flatten all words
    return Object.values(groups)
      .flatMap((cat) => Object.values(cat || {}))
      .flat();
  }
  const typeObj = groups[themeType] || {};
  if (!theme) {
    return Object.values(typeObj).flat();
  }
  return typeObj[theme] || [];
}

export default function HangmanPage() {
  const languageKeys = Object.keys(LANGUAGE_MAP);
  const [language, setLanguage] = useState(languageKeys[0] || "English");

  // derive theme groups
  const themeGroups = LANGUAGE_MAP[language] || {};
  const typeKeys = Object.keys(themeGroups);
  const [themeType, setThemeType] = useState(typeKeys[0] || "");
  const themeLists = themeGroups[themeType] || {};
  const themeKeys = Object.keys(themeLists);
  const [theme, setTheme] = useState(themeKeys[0] || "");

  const [answer, setAnswer] = useState("");
  const [guessed, setGuessed] = useState(() => new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const maxWrong = 6;
  const [message, setMessage] = useState("");

  // build current word list based on selections
  function getCurrentWords() {
    const list = collectThemeList(LANGUAGE_MAP, language, themeType, theme) || [];
    // normalize: strings, uppercase, dedupe
    const cleaned = Array.from(new Set(list.map((w) => String(w).toUpperCase())));
    return cleaned;
  }

  function pickRandomWord() {
    const words = getCurrentWords();
    if (!words || words.length === 0) return "";
    return words[Math.floor(Math.random() * words.length)];
  }

  function newGame() {
    const w = pickRandomWord();
    setAnswer(w);
    setGuessed(new Set());
    setWrongCount(0);
    setMessage("");
  }

  // reset themeType and theme when language changes
  useEffect(() => {
    const firstType = Object.keys(LANGUAGE_MAP[language] || {})[0] || "";
    setThemeType(firstType);
    const firstTheme = Object.keys(LANGUAGE_MAP[language]?.[firstType] || {})[0] || "";
    setTheme(firstTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // reset theme when themeType changes
  useEffect(() => {
    const firstTheme = Object.keys(LANGUAGE_MAP[language]?.[themeType] || {})[0] || "";
    setTheme(firstTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeType]);

  // start a new game whenever the selected theme changes
  useEffect(() => {
    if (theme) newGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, themeType, theme]);

  function handleGuessLetter(letter) {
    if (!answer || guessed.has(letter) || wrongCount >= maxWrong) return;
    const next = new Set(guessed);
    next.add(letter);
    setGuessed(next);

    if (!answer.includes(letter)) {
      setWrongCount((c) => c + 1);
    }

    // check win
    const lettersInAnswer = new Set(answer.replace(/[^A-Z]/gi, "").split(""));
    const allGuessed = [...lettersInAnswer].every((l) => next.has(l));
    if (allGuessed) {
      setMessage("✅ You win!");
    } else if (wrongCount + (answer.includes(letter) ? 0 : 1) >= maxWrong) {
      setMessage(`❌ Game over — answer: ${answer}`);
    }
  }

  function displayMasked() {
    if (!answer) return "";
    return answer
      .split("")
      .map((ch) => {
        const upper = ch.toUpperCase();
        if (!/[A-Z]/.test(upper)) return ch; // show non-letters (spaces, hyphens)
        return guessed.has(upper) ? upper : "_";
      })
      .join(" ");
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Hangman</h1>

        <div className="flex flex-col items-center justify-center">
          <label className="mb-4 w-full max-w-md flex items-center gap-2">
            <span className="font-semibold text-indigo-700">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
            >
              {languageKeys.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </label>

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

          <label className="mb-6 w-full max-w-md flex items-center gap-2">
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
            Guess the word letter by letter!
          </div>

          <div className="text-4xl font-bold tracking-widest mb-6 text-indigo-800 bg-white px-8 py-4 rounded-xl shadow-lg">
            {displayMasked() || "—"}
          </div>

<div className="mb-4">
  <div className="flex items-center gap-4" aria-hidden>
    <div className="text-2xl">
      {WRONG_EMOJI_STAGES[Math.min(wrongCount, WRONG_EMOJI_STAGES.length - 1)]}
    </div>

    <div className="flex items-center gap-2">
      {Array.from({ length: maxWrong }).map((_, i) => (
        <span
          key={i}
          className={i < wrongCount ? "text-red-500 text-xl" : "text-green-500 text-xl"}
          aria-hidden
        >
          {i < wrongCount ? "❌" : "❔"}
        </span>
      ))}
    </div>
  </div>
</div>

  <div className="flex flex-wrap gap-2 max-w-md">
    {ALPHABET.map((letter) => {
      const isGuessed = guessed.has(letter);
      const gameOverOrWin = wrongCount >= maxWrong || message.startsWith("✅");
      const disabled = isGuessed || gameOverOrWin;
      const isCorrect = isGuessed && answer.includes(letter);

      const btnClass = isGuessed
        ? (isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white")
        : (gameOverOrWin ? "bg-gray-200 text-gray-500" : "bg-indigo-600 text-white hover:bg-indigo-700");

      return (
        <button
          key={letter}
          onClick={() => handleGuessLetter(letter)}
          disabled={disabled}
          className={`px-3 py-2 rounded-md font-semibold shadow-md ${btnClass}`}
        >
          {letter}
        </button>
      );
    })}
  </div>
</div>

        {message && (
            <div className="w-full flex justify-center mt-4 mb-6">
              <p className="inline-block text-lg font-semibold text-indigo-700 bg-white px-4 py-2 rounded-lg shadow-md">
                {message}
              </p>
            </div>
        )}
          <div className="mt-6 w-full flex gap-2 justify-center">
                <button
                  onClick={newGame}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-semibold"
                >
                  New Word
                </button>
                <button
                  onClick={() => {
                    const types = Object.keys(LANGUAGE_MAP[language] || {});
                    const randomType = types[Math.floor(Math.random() * types.length)] || "";
                    const themes = Object.keys(LANGUAGE_MAP[language]?.[randomType] || {});
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

  );
}