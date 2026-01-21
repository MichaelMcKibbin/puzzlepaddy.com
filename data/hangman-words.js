// javascript
// file: data/hangman-words.js
import englishThemes from './theme-lists-english.json';
import usEnglishThemes from './theme-lists-us-english.json';

function collectAllWords(themeObj) {
  const out = [];
  for (const categoryKey in themeObj) {
    const category = themeObj[categoryKey];
    for (const themeKey in category) {
      out.push(...(category[themeKey] || []));
    }
  }
  return out;
}

function collectCategoryWords(themeObj, category) {
  const cat = themeObj[category];
  if (!cat) return [];
  return Object.values(cat).flat();
}

/**
 * Get hangman words from the existing theme lists.
 * - locale: 'english' (default) or 'us' / 'us-english'
 * - category: top-level category name (e.g. 'Kid-Friendly Themes') or null for all
 * - theme: sub-theme name (e.g. 'Body Parts') or null for entire category
 */
export default function getWords(locale = 'english', category = null, theme = null) {
  const source = /us/i.test(locale) ? usEnglishThemes : englishThemes;

  let words = [];
  if (!category) {
    words = collectAllWords(source);
  } else if (!theme) {
    words = collectCategoryWords(source, category);
  } else {
    const cat = source[category] || {};
    words = cat[theme] || [];
  }

  // dedupe and uppercase
  return Array.from(new Set(words.map(w => w.toString().toUpperCase())));
}
