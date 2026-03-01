/**
 * Tests for Lights Out utilities
 * Run with: node lib/lightsOutUtils.test.js
 */

import {
  createSeededRNG,
  getDailySeed,
  createEmptyBoard,
  toggleCell,
  isWon,
  generateRandomPuzzle,
  generateDailyPuzzle,
  getSuggestedMoveCount,
  formatTime,
  boardsEqual,
  calculateBoardStats
} from './lightsOutUtils.js';

// Simple test runner
function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
    process.exit(1);
  }
}

function assertEqual(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`
    );
  }
}

function assertTrue(value, message = '') {
  if (!value) {
    throw new Error(`Expected true, got false. ${message}`);
  }
}

function assertFalse(value, message = '') {
  if (value) {
    throw new Error(`Expected false, got true. ${message}`);
  }
}

// Tests for createSeededRNG
test('createSeededRNG: same seed produces same sequence', () => {
  const rng1 = createSeededRNG(12345);
  const rng2 = createSeededRNG(12345);

  const seq1 = [rng1(), rng1(), rng1()];
  const seq2 = [rng2(), rng2(), rng2()];

  assertEqual(seq1, seq2);
});

test('createSeededRNG: different seeds produce different sequences', () => {
  const rng1 = createSeededRNG(12345);
  const rng2 = createSeededRNG(54321);

  const val1 = rng1();
  const val2 = rng2();

  assertFalse(val1 === val2);
});

test('createSeededRNG: generates values in [0, 1)', () => {
  const rng = createSeededRNG(999);

  for (let i = 0; i < 100; i++) {
    const val = rng();
    assertTrue(val >= 0 && val < 1, `Value ${val} out of range`);
  }
});

// Tests for getDailySeed
test('getDailySeed: same day produces same seed', () => {
  const seed1 = getDailySeed(5);
  const seed2 = getDailySeed(5);
  assertEqual(seed1, seed2);
});

test('getDailySeed: different sizes produce different seeds', () => {
  const seed3 = getDailySeed(3);
  const seed5 = getDailySeed(5);
  const seed7 = getDailySeed(7);

  assertFalse(seed3 === seed5);
  assertFalse(seed5 === seed7);
  assertFalse(seed3 === seed7);
});

test('getDailySeed: returns a number', () => {
  const seed = getDailySeed(5);
  assertTrue(typeof seed === 'number');
});

// Tests for createEmptyBoard
test('createEmptyBoard: creates correct size board', () => {
  const board3 = createEmptyBoard(3);
  const board5 = createEmptyBoard(5);
  const board7 = createEmptyBoard(7);

  assertEqual(board3.length, 3);
  assertEqual(board5.length, 5);
  assertEqual(board7.length, 7);
});

test('createEmptyBoard: all cells are false', () => {
  const board = createEmptyBoard(5);
  assertTrue(board.every(row => row.every(cell => cell === false)));
});

test('createEmptyBoard: each row has correct length', () => {
  const board = createEmptyBoard(5);
  board.forEach(row => {
    assertEqual(row.length, 5);
  });
});

// Tests for toggleCell
test('toggleCell: toggles center cell', () => {
  let board = createEmptyBoard(5);
  const original = JSON.stringify(board);

  board = toggleCell(board, 2, 2);
  assertTrue(board[2][2] === true);
});

test('toggleCell: toggles neighbors', () => {
  let board = createEmptyBoard(5);
  board = toggleCell(board, 2, 2);

  assertTrue(board[2][2] === true, 'Center should be on');
  assertTrue(board[1][2] === true, 'Up should be on');
  assertTrue(board[3][2] === true, 'Down should be on');
  assertTrue(board[2][1] === true, 'Left should be on');
  assertTrue(board[2][3] === true, 'Right should be on');
});

test('toggleCell: does not toggle diagonals', () => {
  let board = createEmptyBoard(5);
  board = toggleCell(board, 2, 2);

  assertFalse(board[1][1] === true, 'Top-left should be off');
  assertFalse(board[1][3] === true, 'Top-right should be off');
  assertFalse(board[3][1] === true, 'Bottom-left should be off');
  assertFalse(board[3][3] === true, 'Bottom-right should be off');
});

test('toggleCell: handles edge cells correctly', () => {
  let board = createEmptyBoard(5);
  board = toggleCell(board, 0, 0); // Top-left corner

  assertTrue(board[0][0] === true, 'Cell itself on');
  assertTrue(board[1][0] === true, 'Down neighbor on');
  assertTrue(board[0][1] === true, 'Right neighbor on');
  assertEqual(board.flat().filter(c => c).length, 3, 'Exactly 3 cells on');
});

test('toggleCell: double toggle returns to original', () => {
  let board = createEmptyBoard(5);
  const original = JSON.stringify(board);

  board = toggleCell(board, 2, 2);
  board = toggleCell(board, 2, 2);

  assertEqual(JSON.stringify(board), original);
});

test('toggleCell: does not mutate original board', () => {
  const board1 = createEmptyBoard(5);
  const board1Copy = JSON.stringify(board1);

  const board2 = toggleCell(board1, 2, 2);

  assertEqual(JSON.stringify(board1), board1Copy, 'Original board should not change');
  assertFalse(board1[2][2], 'Original board[2][2] should be false');
  assertTrue(board2[2][2], 'New board[2][2] should be true');
});

// Tests for isWon
test('isWon: empty board is won', () => {
  const board = createEmptyBoard(5);
  assertTrue(isWon(board));
});

test('isWon: board with one light on is not won', () => {
  let board = createEmptyBoard(5);
  board[2][2] = true;
  assertFalse(isWon(board));
});

test('isWon: board with all lights on is not won', () => {
  const board = createEmptyBoard(5).map(row => row.map(() => true));
  assertFalse(isWon(board));
});

// Tests for generateRandomPuzzle
test('generateRandomPuzzle: returns correct size board', () => {
  const rng = createSeededRNG(123);
  const board = generateRandomPuzzle(5, 5, rng);
  assertEqual(board.length, 5);
});

test('generateRandomPuzzle: with 0 moves creates empty board', () => {
  const rng = createSeededRNG(123);
  const board = generateRandomPuzzle(5, 0, rng);
  assertTrue(isWon(board));
});

test('generateRandomPuzzle: same seed produces same puzzle', () => {
  const rng1 = createSeededRNG(789);
  const rng2 = createSeededRNG(789);

  const board1 = generateRandomPuzzle(5, 5, rng1);
  const board2 = generateRandomPuzzle(5, 5, rng2);

  assertTrue(boardsEqual(board1, board2));
});

// Tests for generateDailyPuzzle
test('generateDailyPuzzle: returns correct size', () => {
  const board3 = generateDailyPuzzle(3);
  const board5 = generateDailyPuzzle(5);
  const board7 = generateDailyPuzzle(7);

  assertEqual(board3.length, 3);
  assertEqual(board5.length, 5);
  assertEqual(board7.length, 7);
});

test('generateDailyPuzzle: same size produces same board', () => {
  const board1 = generateDailyPuzzle(5);
  const board2 = generateDailyPuzzle(5);

  assertTrue(boardsEqual(board1, board2));
});

// Tests for getSuggestedMoveCount
test('getSuggestedMoveCount: returns correct counts', () => {
  assertEqual(getSuggestedMoveCount(3), 4);
  assertEqual(getSuggestedMoveCount(5), 8);
  assertEqual(getSuggestedMoveCount(7), 12);
});

// Tests for formatTime
test('formatTime: formats seconds', () => {
  assertEqual(formatTime(45), '45s');
});

test('formatTime: formats minutes and seconds', () => {
  assertEqual(formatTime(125), '2m 5s');
});

test('formatTime: formats hours, minutes, seconds', () => {
  assertEqual(formatTime(3665), '1h 1m 5s');
});

// Tests for boardsEqual
test('boardsEqual: identical boards are equal', () => {
  const board1 = createEmptyBoard(5);
  const board2 = createEmptyBoard(5);
  assertTrue(boardsEqual(board1, board2));
});

test('boardsEqual: different boards are not equal', () => {
  const board1 = createEmptyBoard(5);
  const board2 = createEmptyBoard(5);
  board2[0][0] = true;
  assertFalse(boardsEqual(board1, board2));
});

// Tests for calculateBoardStats
test('calculateBoardStats: empty board stats', () => {
  const board = createEmptyBoard(5);
  const stats = calculateBoardStats(board);

  assertEqual(stats.lightsOn, 0);
  assertEqual(stats.totalLights, 25);
  assertEqual(stats.lightsOff, 25);
  assertEqual(stats.percentageOn, 0);
});

test('calculateBoardStats: full board stats', () => {
  const board = createEmptyBoard(5).map(row => row.map(() => true));
  const stats = calculateBoardStats(board);

  assertEqual(stats.lightsOn, 25);
  assertEqual(stats.totalLights, 25);
  assertEqual(stats.lightsOff, 0);
  assertEqual(stats.percentageOn, 100);
});

test('calculateBoardStats: half board stats', () => {
  const board = createEmptyBoard(5);
  // Light up first 13 cells
  let count = 0;
  outer: for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (count < 13) {
        board[i][j] = true;
        count++;
      } else {
        break outer;
      }
    }
  }

  const stats = calculateBoardStats(board);
  assertEqual(stats.lightsOn, 13);
  assertEqual(stats.lightsOff, 12);
  assertEqual(stats.percentageOn, 52);
});

console.log('\n✓ All tests passed!');

