/**
 * Sokoban Utility Functions
 * Pure functions for game logic
 */

// Direction vectors
export const DIRECTIONS = {
  UP: { dr: -1, dc: 0 },
  DOWN: { dr: 1, dc: 0 },
  LEFT: { dr: 0, dc: -1 },
  RIGHT: { dr: 0, dc: 1 }
};

/**
 * Parse ASCII level map into game state
 * @param {string[]} mapLines - Array of strings representing the level
 * @returns {Object} Game state with walls, goals, boxes, player position, grid dimensions
 */
export function parseLevel(mapLines) {
  const walls = new Set();
  const goals = new Set();
  const boxes = new Set();
  let player = { r: 0, c: 0 };

  let maxCols = 0;
  const rows = mapLines.length;

  mapLines.forEach((line, r) => {
    maxCols = Math.max(maxCols, line.length);
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      const key = `${r},${c}`;

      switch (char) {
        case '#':
          walls.add(key);
          break;
        case '.':
          goals.add(key);
          break;
        case '$':
          boxes.add(key);
          break;
        case '@':
          player = { r, c };
          break;
        case '+': // player on goal
          player = { r, c };
          goals.add(key);
          break;
        case '*': // box on goal
          boxes.add(key);
          goals.add(key);
          break;
        // space or anything else is floor
      }
    }
  });

  return {
    walls,
    goals,
    boxes,
    player,
    rows,
    cols: maxCols
  };
}

/**
 * Create a position key from row and column
 */
function posKey(r, c) {
  return `${r},${c}`;
}

/**
 * Check if a position has a wall
 */
function hasWall(state, r, c) {
  return state.walls.has(posKey(r, c));
}

/**
 * Check if a position has a box
 */
function hasBox(state, r, c) {
  return state.boxes.has(posKey(r, c));
}

/**
 * Attempt to move the player in a direction
 * Returns new state if move succeeded, or null if blocked
 * Also returns if a push occurred
 * @param {Object} state - Current game state
 * @param {Object} direction - Direction object with dr, dc
 * @returns {Object|null} { newState, pushed } or null if blocked
 */
export function attemptMove(state, direction) {
  const { dr, dc } = direction;
  const newR = state.player.r + dr;
  const newC = state.player.c + dc;

  // Check if new position is a wall
  if (hasWall(state, newR, newC)) {
    return null; // Blocked by wall
  }

  // Check if new position has a box
  if (hasBox(state, newR, newC)) {
    // Try to push the box
    const boxNewR = newR + dr;
    const boxNewC = newC + dc;

    // Check if space beyond box is blocked
    if (hasWall(state, boxNewR, boxNewC) || hasBox(state, boxNewR, boxNewC)) {
      return null; // Cannot push box
    }

    // Push the box
    const newBoxes = new Set(state.boxes);
    newBoxes.delete(posKey(newR, newC));
    newBoxes.add(posKey(boxNewR, boxNewC));

    return {
      newState: {
        ...state,
        player: { r: newR, c: newC },
        boxes: newBoxes
      },
      pushed: true
    };
  }

  // Move to empty space
  return {
    newState: {
      ...state,
      player: { r: newR, c: newC },
      boxes: state.boxes
    },
    pushed: false
  };
}

/**
 * Check if all boxes are on goal tiles (win condition)
 */
export function isWon(state) {
  if (state.boxes.size !== state.goals.size) {
    return false;
  }

  for (const boxPos of state.boxes) {
    if (!state.goals.has(boxPos)) {
      return false;
    }
  }

  return true;
}

/**
 * Deep clone a game state (for undo functionality)
 */
export function cloneState(state) {
  return {
    walls: new Set(state.walls),
    goals: new Set(state.goals),
    boxes: new Set(state.boxes),
    player: { ...state.player },
    rows: state.rows,
    cols: state.cols
  };
}

/**
 * Get the cell type at a position for rendering
 * @returns {string} 'wall', 'goal', 'box', 'boxOnGoal', 'player', 'playerOnGoal', 'floor'
 */
export function getCellType(state, r, c) {
  const key = posKey(r, c);
  const isPlayer = state.player.r === r && state.player.c === c;
  const isWall = state.walls.has(key);
  const isGoal = state.goals.has(key);
  const isBox = state.boxes.has(key);

  if (isWall) return 'wall';
  if (isPlayer && isGoal) return 'playerOnGoal';
  if (isPlayer) return 'player';
  if (isBox && isGoal) return 'boxOnGoal';
  if (isBox) return 'box';
  if (isGoal) return 'goal';
  return 'floor';
}

/**
 * Check if a move is possible in any direction (for detecting game over)
 * Note: This is a simple check - Sokoban rarely has actual dead ends where no move is possible
 */
export function hasValidMoves(state) {
  const directions = Object.values(DIRECTIONS);

  for (const dir of directions) {
    if (attemptMove(state, dir) !== null) {
      return true;
    }
  }

  return false;
}

