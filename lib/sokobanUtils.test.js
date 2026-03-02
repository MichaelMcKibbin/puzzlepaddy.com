/**
 * Tests for Sokoban utility functions
 */

const {
  parseLevel,
  attemptMove,
  isWon,
  cloneState,
  getCellType,
  DIRECTIONS
} = require('./sokobanUtils');

describe('Sokoban Utils', () => {
  describe('parseLevel', () => {
    test('parses simple level correctly', () => {
      const map = [
        "####",
        "#@.#",
        "#$ #",
        "####"
      ];

      const state = parseLevel(map);

      expect(state.player).toEqual({ r: 1, c: 1 });
      expect(state.goals.has('1,2')).toBe(true);
      expect(state.boxes.has('2,1')).toBe(true);
      expect(state.walls.has('0,0')).toBe(true);
      expect(state.rows).toBe(4);
      expect(state.cols).toBe(4);
    });

    test('parses player on goal (+)', () => {
      const map = [
        "####",
        "#+$#",
        "# .#",
        "####"
      ];

      const state = parseLevel(map);

      expect(state.player).toEqual({ r: 1, c: 1 });
      expect(state.goals.has('1,1')).toBe(true); // player is on a goal
    });

    test('parses box on goal (*)', () => {
      const map = [
        "####",
        "#@*#",
        "# .#",
        "####"
      ];

      const state = parseLevel(map);

      expect(state.boxes.has('1,2')).toBe(true);
      expect(state.goals.has('1,2')).toBe(true); // box is on a goal
    });
  });

  describe('attemptMove', () => {
    test('player can move to empty space', () => {
      const map = [
        "####",
        "#@ #",
        "# .#",
        "####"
      ];
      const state = parseLevel(map);

      const result = attemptMove(state, DIRECTIONS.RIGHT);

      expect(result).not.toBeNull();
      expect(result.newState.player).toEqual({ r: 1, c: 2 });
      expect(result.pushed).toBe(false);
    });

    test('player blocked by wall', () => {
      const map = [
        "####",
        "#@ #",
        "####"
      ];
      const state = parseLevel(map);

      const result = attemptMove(state, DIRECTIONS.LEFT);

      expect(result).toBeNull();
    });

    test('player can push box to empty space', () => {
      const map = [
        "#####",
        "#@$ #",
        "#####"
      ];
      const state = parseLevel(map);

      const result = attemptMove(state, DIRECTIONS.RIGHT);

      expect(result).not.toBeNull();
      expect(result.newState.player).toEqual({ r: 1, c: 2 });
      expect(result.newState.boxes.has('1,3')).toBe(true);
      expect(result.newState.boxes.has('1,2')).toBe(false);
      expect(result.pushed).toBe(true);
    });

    test('player cannot push box into wall', () => {
      const map = [
        "#####",
        "#@$##",
        "#####"
      ];
      const state = parseLevel(map);

      const result = attemptMove(state, DIRECTIONS.RIGHT);

      expect(result).toBeNull();
    });

    test('player cannot push box into another box', () => {
      const map = [
        "######",
        "#@$$ #",
        "######"
      ];
      const state = parseLevel(map);

      const result = attemptMove(state, DIRECTIONS.RIGHT);

      expect(result).toBeNull();
    });

    test('player can push box onto goal', () => {
      const map = [
        "#####",
        "#@$.#",
        "#####"
      ];
      const state = parseLevel(map);

      const result = attemptMove(state, DIRECTIONS.RIGHT);

      expect(result).not.toBeNull();
      expect(result.newState.boxes.has('1,3')).toBe(true);
      expect(result.pushed).toBe(true);
    });
  });

  describe('isWon', () => {
    test('returns true when all boxes on goals', () => {
      const map = [
        "####",
        "#@.#",
        "#* #",
        "####"
      ];
      const state = parseLevel(map);

      expect(isWon(state)).toBe(true);
    });

    test('returns false when not all boxes on goals', () => {
      const map = [
        "####",
        "#@.#",
        "#$ #",
        "####"
      ];
      const state = parseLevel(map);

      expect(isWon(state)).toBe(false);
    });

    test('returns false when box counts mismatch', () => {
      const map = [
        "#####",
        "#@. #",
        "#$$ #",
        "#####"
      ];
      const state = parseLevel(map);

      expect(isWon(state)).toBe(false);
    });
  });

  describe('getCellType', () => {
    test('identifies all cell types correctly', () => {
      const map = [
        "####",
        "#+*#",
        "#$ #",
        "####"
      ];
      const state = parseLevel(map);

      expect(getCellType(state, 0, 0)).toBe('wall');
      expect(getCellType(state, 1, 1)).toBe('playerOnGoal');
      expect(getCellType(state, 1, 2)).toBe('boxOnGoal');
      expect(getCellType(state, 2, 1)).toBe('box');
      expect(getCellType(state, 2, 2)).toBe('floor');
    });
  });

  describe('cloneState', () => {
    test('creates independent copy of state', () => {
      const map = [
        "####",
        "#@$#",
        "# .#",
        "####"
      ];
      const state = parseLevel(map);
      const clone = cloneState(state);

      // Modify clone
      clone.player.r = 99;
      clone.boxes.add('99,99');

      // Original should be unchanged
      expect(state.player.r).toBe(1);
      expect(state.boxes.has('99,99')).toBe(false);
    });
  });
});

