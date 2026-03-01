/**
 * Word Ladder Game Utilities
 * Provides helper functions for word ladder logic, graph building, and pathfinding
 */

/**
 * Check if two words differ by exactly one letter
 * @param {string} word1 - First word
 * @param {string} word2 - Second word
 * @returns {boolean} True if words differ by exactly one letter
 */
export function differsByOneLetter(word1, word2) {
  if (!word1 || !word2 || word1.length !== word2.length) {
    return false;
  }

  let differences = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) {
      differences++;
      if (differences > 1) {
        return false;
      }
    }
  }

  return differences === 1;
}

/**
 * Get all neighbors of a word (words that differ by one letter)
 * @param {string} word - The word to find neighbors for
 * @param {string[]} dictionary - List of valid words
 * @returns {string[]} Array of neighboring words
 */
export function getNeighbors(word, dictionary) {
  return dictionary.filter(w => differsByOneLetter(word, w));
}

/**
 * Find the shortest path between two words using BFS
 * @param {string} start - Starting word
 * @param {string} target - Target word
 * @param {string[]} dictionary - List of valid words
 * @returns {string[]|null} Shortest path including start and target, or null if no path exists
 */
export function findShortestPath(start, target, dictionary) {
  if (start === target) {
    return [start];
  }

  if (start.length !== target.length) {
    return null;
  }

  const dictSet = new Set(dictionary.map(w => w.toUpperCase()));
  const upperStart = start.toUpperCase();
  const upperTarget = target.toUpperCase();

  if (!dictSet.has(upperStart) || !dictSet.has(upperTarget)) {
    return null;
  }

  const queue = [[upperStart]];
  const visited = new Set([upperStart]);

  while (queue.length > 0) {
    const path = queue.shift();
    const currentWord = path[path.length - 1];

    if (currentWord === upperTarget) {
      return path;
    }

    const neighbors = getNeighbors(currentWord, dictionary.map(w => w.toUpperCase()));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return null;
}

/**
 * Get the next word hint (next step in shortest path)
 * @param {string} currentWord - Current word in the ladder
 * @param {string} target - Target word
 * @param {string[]} dictionary - List of valid words
 * @param {string[]} usedWords - Words already used in the ladder
 * @returns {string|null} The next word to use, or null if no valid hint exists
 */
export function getNextWordHint(currentWord, target, dictionary, usedWords = []) {
  const path = findShortestPath(currentWord, target, dictionary);

  if (!path || path.length < 2) {
    return null;
  }

  // Return the second word in the path (the next step)
  const hint = path[1];

  // Make sure it's not already used in the ladder
  if (usedWords.includes(hint)) {
    return null;
  }

  return hint;
}

/**
 * Generate a deterministic seed based on date and timezone
 * @param {string} timezone - Timezone string (e.g., 'Europe/Dublin')
 * @returns {number} Seed value
 */
export function getDailySeed(timezone = 'Europe/Dublin') {
  // Create a date in the specified timezone
  const now = new Date();

  // Get date parts in the specified timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(now);
  const dateStr = parts
    .map(p => p.value)
    .filter((_, i) => i % 2 === 0) // Get only the values, not the literals
    .join('');

  return parseInt(dateStr, 10);
}

/**
 * Seeded random number generator for consistent daily puzzles
 * @param {number} seed - Seed value
 * @returns {number} Random number between 0 and 1
 */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Pick a random item from an array using a seed
 * @param {any[]} array - Array to pick from
 * @param {number} seed - Seed value
 * @returns {any} Random item from array
 */
export function pickRandomWithSeed(array, seed) {
  if (!array || array.length === 0) {
    return null;
  }
  const index = Math.floor(seededRandom(seed) * array.length);
  return array[index];
}

/**
 * Generate a daily word ladder puzzle
 * @param {string[]} words - List of available words
 * @param {number} length - Word length to use
 * @param {number} seed - Seed for consistent daily puzzles
 * @returns {object} Object with start and target words
 */
export function generateDailyPuzzle(words, length, seed) {
  const wordsOfLength = words.filter(w => w.length === length);

  if (wordsOfLength.length < 2) {
    return null;
  }

  const start = pickRandomWithSeed(wordsOfLength, seed);
  const target = pickRandomWithSeed(wordsOfLength, seed + 1);

  // Ensure they're different
  if (start === target) {
    const altTarget = pickRandomWithSeed(
      wordsOfLength.filter(w => w !== start),
      seed + 2
    );
    return { start, target: altTarget };
  }

  return { start, target };
}

/**
 * Get difficulty settings
 * @returns {object} Object with difficulty levels and their settings
 */
export function getDifficultySettings() {
  return {
    Easy: {
      wordLength: 3,
      moveLimit: 8
    },
    Medium: {
      wordLength: 4,
      moveLimit: 10
    },
    Hard: {
      wordLength: 5,
      moveLimit: 12
    }
  };
}

/**
 * Validate a word move
 * @param {string} word - Word to validate
 * @param {string} previousWord - Previous word in the ladder
 * @param {string[]} usedWords - Words already used
 * @param {string[]} dictionary - Valid words
 * @returns {object} Validation result with isValid flag and error message
 */
export function validateWordMove(word, previousWord, usedWords, dictionary) {
  const upperWord = word.toUpperCase();
  const upperPrevious = previousWord.toUpperCase();

  // Check if word exists in dictionary
  if (!dictionary.map(w => w.toUpperCase()).includes(upperWord)) {
    return {
      isValid: false,
      error: 'Word not in dictionary'
    };
  }

  // Check if word differs by exactly one letter
  if (!differsByOneLetter(upperWord, upperPrevious)) {
    return {
      isValid: false,
      error: 'Must change exactly one letter'
    };
  }

  // Check if word was already used
  if (usedWords.includes(upperWord)) {
    return {
      isValid: false,
      error: 'Word already used'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Format time elapsed into a readable string
 * @param {number} seconds - Number of seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

