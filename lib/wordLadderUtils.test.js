/**
 * Tests for Word Ladder utilities
 * Run with: node lib/wordLadderUtils.test.js
 */

import {
  differsByOneLetter,
  getNeighbors,
  findShortestPath,
  getNextWordHint,
  validateWordMove,
  getDailySeed,
  getDifficultySettings
} from './wordLadderUtils.js';

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

// Tests for differsByOneLetter
test('differsByOneLetter: CAT -> CAR should be true', () => {
  assertTrue(differsByOneLetter('CAT', 'CAR'));
});

test('differsByOneLetter: CAT -> CAT should be false', () => {
  assertFalse(differsByOneLetter('CAT', 'CAT'));
});

test('differsByOneLetter: CAT -> DOG should be false', () => {
  assertFalse(differsByOneLetter('CAT', 'DOG'));
});

test('differsByOneLetter: CAT -> CATS should be false', () => {
  assertFalse(differsByOneLetter('CAT', 'CATS'));
});

test('differsByOneLetter: empty strings should be false', () => {
  assertFalse(differsByOneLetter('', ''));
});

test('differsByOneLetter: CAT -> BAT should be true', () => {
  assertTrue(differsByOneLetter('CAT', 'BAT'));
});

test('differsByOneLetter: CAT -> CAN should be true', () => {
  assertTrue(differsByOneLetter('CAT', 'CAN'));
});

test('differsByOneLetter: CAT -> COT should be true', () => {
  assertTrue(differsByOneLetter('CAT', 'COT'));
});

// Tests for getNeighbors
test('getNeighbors: CAT should find BAT, CAR, CAN, etc.', () => {
  const dictionary = ['CAT', 'BAT', 'CAR', 'CAN', 'COT', 'DOG', 'CATS'];
  const neighbors = getNeighbors('CAT', dictionary);
  assertEqual(neighbors.length, 5); // BAT, CAR, CAN, COT, but not CAT itself or DOG or CATS
  assertTrue(neighbors.includes('BAT'));
  assertTrue(neighbors.includes('CAR'));
  assertTrue(neighbors.includes('CAN'));
  assertTrue(neighbors.includes('COT'));
});

// Tests for findShortestPath
test('findShortestPath: CAT -> DOG should find valid path', () => {
  const dictionary = ['CAT', 'BAT', 'BIT', 'BOT', 'DOG'];
  const path = findShortestPath('CAT', 'DOG', dictionary);
  assertTrue(path !== null);
  assertEqual(path[0], 'CAT');
  assertEqual(path[path.length - 1], 'DOG');
});

test('findShortestPath: same word should return single word', () => {
  const dictionary = ['CAT'];
  const path = findShortestPath('CAT', 'CAT', dictionary);
  assertEqual(path, ['CAT']);
});

test('findShortestPath: different lengths should return null', () => {
  const dictionary = ['CAT', 'DOGS'];
  const path = findShortestPath('CAT', 'DOGS', dictionary);
  assertEqual(path, null);
});

test('findShortestPath: unreachable word should return null', () => {
  const dictionary = ['CAT', 'DOG', 'RUN'];
  const path = findShortestPath('CAT', 'RUN', dictionary);
  // These are not connected in this small dictionary
  assertEqual(path, null);
});

// Tests for validateWordMove
test('validateWordMove: valid move should pass', () => {
  const dictionary = ['CAT', 'BAT', 'CAR'];
  const result = validateWordMove('BAT', 'CAT', ['CAT'], dictionary);
  assertTrue(result.isValid);
});

test('validateWordMove: word not in dictionary should fail', () => {
  const dictionary = ['CAT', 'BAT'];
  const result = validateWordMove('ZZZ', 'CAT', ['CAT'], dictionary);
  assertFalse(result.isValid);
});

test('validateWordMove: word not differing by one letter should fail', () => {
  const dictionary = ['CAT', 'DOG'];
  const result = validateWordMove('DOG', 'CAT', ['CAT'], dictionary);
  assertFalse(result.isValid);
});

test('validateWordMove: duplicate word should fail', () => {
  const dictionary = ['CAT', 'BAT'];
  const result = validateWordMove('BAT', 'CAT', ['CAT', 'BAT'], dictionary);
  assertFalse(result.isValid);
});

// Tests for getDifficultySettings
test('getDifficultySettings: should have Easy, Medium, Hard', () => {
  const settings = getDifficultySettings();
  assertTrue(settings.Easy);
  assertTrue(settings.Medium);
  assertTrue(settings.Hard);
  assertEqual(settings.Easy.wordLength, 3);
  assertEqual(settings.Medium.wordLength, 4);
  assertEqual(settings.Hard.wordLength, 5);
});

// Tests for getDailySeed
test('getDailySeed: should return a number', () => {
  const seed = getDailySeed();
  assertTrue(typeof seed === 'number');
});

test('getDailySeed: same day should return same seed', () => {
  const seed1 = getDailySeed();
  const seed2 = getDailySeed();
  assertEqual(seed1, seed2);
});

console.log('\n✓ All tests passed!');

