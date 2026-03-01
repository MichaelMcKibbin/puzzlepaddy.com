/**
 * Lights Out Game Utilities
 * Provides helper functions for game logic, seeded random generation, and board manipulation
 */

/**
 * Simple seeded PRNG (mulberry32)
 * @param {number} seed - Seed value
 * @returns {function} Random number generator function
 */
export function createSeededRNG(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Get deterministic seed based on date, size, and timezone
 * @param {number} size - Board size (3, 5, or 7)
 * @param {string} timezone - Timezone string (default: 'Europe/Dublin')
 * @returns {number} Seed value
 */
export function getDailySeed(size = 5, timezone = 'Europe/Dublin') {
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
    .filter((_, i) => i % 2 === 0)
    .join('');

  // Combine date with board size for seed
  return parseInt(dateStr, 10) + size;
}

/**
 * Create an initial board state (all lights off)
 * @param {number} size - Board size (3, 5, or 7)
 * @returns {boolean[][]} 2D array representing board state
 */
export function createEmptyBoard(size) {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));
}

/**
 * Toggle a cell and its orthogonal neighbors
 * @param {boolean[][]} board - Current board state
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean[][]} New board state with toggled cells
 */
export function toggleCell(board, row, col) {
  const size = board.length;
  const newBoard = board.map(r => [...r]); // Deep copy

  // Toggle the cell itself
  newBoard[row][col] = !newBoard[row][col];

  // Toggle neighbors (up, down, left, right)
  const neighbors = [
    [row - 1, col], // up
    [row + 1, col], // down
    [row, col - 1], // left
    [row, col + 1]  // right
  ];

  neighbors.forEach(([r, c]) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      newBoard[r][c] = !newBoard[r][c];
    }
  });

  return newBoard;
}

/**
 * Check if all lights are off (win condition)
 * @param {boolean[][]} board - Board state to check
 * @returns {boolean} True if all lights are off
 */
export function isWon(board) {
  return board.every(row => row.every(cell => !cell));
}

/**
 * Generate a solvable random puzzle
 * @param {number} size - Board size
 * @param {number} moves - Number of random toggles to apply
 * @param {function} rng - Random number generator function
 * @returns {boolean[][]} Generated puzzle board
 */
export function generateRandomPuzzle(size, moves, rng) {
  let board = createEmptyBoard(size);

  // Apply random moves
  for (let i = 0; i < moves; i++) {
    const row = Math.floor(rng() * size);
    const col = Math.floor(rng() * size);
    board = toggleCell(board, row, col);
  }

  return board;
}

/**
 * Generate a daily puzzle seeded by date
 * @param {number} size - Board size
 * @param {string} timezone - Timezone
 * @returns {boolean[][]} Generated daily puzzle
 */
export function generateDailyPuzzle(size, timezone = 'Europe/Dublin') {
  const seed = getDailySeed(size, timezone);
  const rng = createSeededRNG(seed);

  // Use move count based on board size for difficulty
  const moveCount = {
    3: 4,
    5: 8,
    7: 12
  }[size] || 8;

  return generateRandomPuzzle(size, moveCount, rng);
}

/**
 * Get suggested move counts for random generation
 * @param {number} size - Board size
 * @returns {number} Suggested number of random moves
 */
export function getSuggestedMoveCount(size) {
  return {
    3: 4,
    5: 8,
    7: 12
  }[size] || 8;
}

/**
 * Format time in seconds to readable string
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

/**
 * Compare two board states
 * @param {boolean[][]} board1 - First board
 * @param {boolean[][]} board2 - Second board
 * @returns {boolean} True if boards are identical
 */
export function boardsEqual(board1, board2) {
  if (board1.length !== board2.length) return false;
  return board1.every((row, i) =>
    row.every((cell, j) => cell === board2[i][j])
  );
}

/**
 * Calculate statistics about board difficulty
 * @param {boolean[][]} board - Board state
 * @returns {object} Statistics object
 */
export function calculateBoardStats(board) {
  const lightsOn = board.flat().filter(cell => cell).length;
  const totalLights = board.length * board.length;
  const percentage = Math.round((lightsOn / totalLights) * 100);

  return {
    lightsOn,
    totalLights,
    lightsOff: totalLights - lightsOn,
    percentageOn: percentage
  };
}

