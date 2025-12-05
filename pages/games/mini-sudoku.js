// /pages/games/mini-sudoku.js
import { useState, useEffect } from "react";

export default function MiniSudokuPage() {
    const [size, setSize] = useState(4);
    const [startGrid, setStartGrid] = useState(() => generatePuzzle(size));
    const [grid, setGrid] = useState(() => startGrid.map((row) => [...row]));
    const [status, setStatus] = useState("");
    const [puzzleWarning, setPuzzleWarning] = useState("");

    // Generate new puzzle when size changes
    useEffect(() => {
        const newPuzzle = generatePuzzle(size);
        setStartGrid(newPuzzle);
        setGrid(newPuzzle.map((row) => [...row]));
        setStatus("");
        setPuzzleWarning("");
    }, [size]);

    function handleChange(r, c, value) {
        if (startGrid[r][c] !== 0) return; // pre-filled, not editable
        const num = parseInt(value, 10);
        const copy = grid.map((row) => [...row]);
        copy[r][c] = Number.isNaN(num) ? 0 : Math.min(Math.max(num, 0), size);
        setGrid(copy);
        setStatus("");
    }

    function checkSolution() {
        const validation = validateSudokuDetailed(grid, size);
        if (!validation.valid) {
            setStatus(`❌ ${validation.error}`);
            return;
        }
        const allFilled = grid.every((row) => row.every((v) => v >= 1 && v <= size));
        setStatus(allFilled ? "✅ Looks good!" : "⚠ Some cells are still empty.");
    }

    function reset() {
        const newPuzzle = generatePuzzle(size);
        setStartGrid(newPuzzle);
        setGrid(newPuzzle.map((row) => [...row]));
        setStatus("");
        setPuzzleWarning("");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Sudoku ({size}×{size})</h1>
                
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-6 space-x-2">
                        <button 
                            onClick={() => setSize(4)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                size === 4 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            4×4
                        </button>
                        <button 
                            onClick={() => setSize(6)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                size === 6 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            6×6
                        </button>
                    </div>
                    
                    <div className="mb-6 text-xl font-bold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md text-center">
                        Fill 1–{size} so each row, column and {size === 4 ? '2×2' : '2×3'} block has no repeats
                    </div>

                    <div className={`grid gap-0 mb-6 p-4 bg-white rounded-xl shadow-lg`} style={{gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`}}>
                        {grid.map((row, r) =>
                            row.map((value, c) => {
                                const isFixed = startGrid[r][c] !== 0;
                                // For 4x4: 2x2 blocks, For 6x6: 2x3 blocks
                                const blockRows = size === 4 ? 2 : 2;
                                const blockCols = size === 4 ? 2 : 3;
                                const borderRight = (c + 1) % blockCols === 0 && c !== size - 1 ? "border-r-2 border-gray-800" : "border-r border-gray-300";
                                const borderBottom = (r + 1) % blockRows === 0 && r !== size - 1 ? "border-b-2 border-gray-800" : "border-b border-gray-300";
                                return (
                                    <input
                                        key={`${r}-${c}`}
                                        value={value === 0 ? "" : value}
                                        onChange={(e) => handleChange(r, c, e.target.value)}
                                        className={`w-12 h-12 text-center text-xl outline-none focus:ring-2 focus:ring-indigo-500 ${
                                            isFixed ? "bg-gray-200 font-bold" : "bg-white font-normal"
                                        } ${borderRight} ${borderBottom}`}
                                        maxLength={1}
                                    />
                                );
                            })
                        )}
                    </div>

                    <div className="mb-6 space-x-2">
                        <button 
                            onClick={checkSolution}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            Check
                        </button>
                        <button 
                            onClick={reset}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
                        >
                            Reset
                        </button>
                    </div>

                    {status && (
                        <p className="text-lg font-semibold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md">
                            {status}
                        </p>
                    )}
                    
                    {puzzleWarning && (
                        <p className="text-lg font-semibold text-red-700 bg-red-100 px-6 py-3 rounded-lg shadow-md border border-red-300">
                            {puzzleWarning}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function isValidSudoku(grid, size) {
    return validateSudokuDetailed(grid, size).valid;
}

function validateSudokuDetailed(grid, size) {
    // rows
    for (let r = 0; r < size; r++) {
        if (!noDuplicates(grid[r])) {
            return { valid: false, error: `Duplicate in row ${r + 1}` };
        }
    }
    // cols
    for (let c = 0; c < size; c++) {
        const col = [];
        for (let r = 0; r < size; r++) {
            col.push(grid[r][c]);
        }
        if (!noDuplicates(col)) {
            return { valid: false, error: `Duplicate in column ${c + 1}` };
        }
    }
    // blocks
    const blockRows = size === 4 ? 2 : 2;
    const blockCols = size === 4 ? 2 : 3;
    let blockNum = 1;
    for (let br = 0; br < size; br += blockRows) {
        for (let bc = 0; bc < size; bc += blockCols) {
            const block = [];
            for (let r = br; r < br + blockRows; r++) {
                for (let c = bc; c < bc + blockCols; c++) {
                    block.push(grid[r][c]);
                }
            }
            if (!noDuplicates(block)) {
                return { valid: false, error: `Duplicate in ${blockRows}×${blockCols} block ${blockNum}` };
            }
            blockNum++;
        }
    }
    return { valid: true };
}

function noDuplicates(arr) {
    const seen = new Set();
    for (const v of arr) {
        if (v === 0) continue;
        if (seen.has(v)) return false;
        seen.add(v);
    }
    return true;
}

function isSolvable(grid, size) {
    // First check if the starting grid is already invalid
    if (!isValidSudoku(grid, size)) {
        return false;
    }
    // Create a copy to avoid modifying original
    const copy = grid.map(row => [...row]);
    return solveSudoku(copy, size);
}

function solveSudoku(grid, size) {
    // Find empty cell
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) {
                // Try numbers 1-size
                for (let num = 1; num <= size; num++) {
                    if (isValidMove(grid, r, c, num, size)) {
                        grid[r][c] = num;
                        if (solveSudoku(grid, size)) return true;
                        grid[r][c] = 0; // backtrack
                    }
                }
                return false; // no valid number found
            }
        }
    }
    return true; // all cells filled
}

function isValidMove(grid, row, col, num, size) {
    // Check bounds
    if (!grid || row >= grid.length || col >= grid[0]?.length) return false;
    
    // Check row
    for (let c = 0; c < size; c++) {
        if (grid[row][c] === num) return false;
    }
    // Check column
    for (let r = 0; r < size; r++) {
        if (grid[r] && grid[r][col] === num) return false;
    }
    // Check block
    const blockRows = size === 4 ? 2 : 2;
    const blockCols = size === 4 ? 2 : 3;
    const blockRow = Math.floor(row / blockRows) * blockRows;
    const blockCol = Math.floor(col / blockCols) * blockCols;
    for (let r = blockRow; r < blockRow + blockRows; r++) {
        for (let c = blockCol; c < blockCol + blockCols; c++) {
            if (grid[r] && grid[r][c] === num) return false;
        }
    }
    return true;
}

function generatePuzzle(size) {
    let attempts = 0;
    while (attempts < 100) {
        const puzzle = createRandomPuzzle(size);
        if (isSolvable(puzzle, size)) {
            return puzzle;
        }
        attempts++;
    }
    // Fallback to a known good puzzle
    if (size === 4) {
        return [
            [0, 3, 0, 2],
            [0, 0, 4, 3],
            [2, 0, 3, 0],
            [3, 4, 0, 0],
        ];
    } else {
        return [
            [0, 0, 3, 0, 0, 6],
            [5, 6, 0, 0, 0, 0],
            [0, 1, 0, 0, 6, 0],
            [0, 4, 0, 0, 2, 0],
            [0, 0, 0, 0, 3, 4],
            [2, 0, 0, 5, 0, 0],
        ];
    }
}

function createRandomPuzzle(size) {
    // Start with empty grid
    const grid = Array.from({ length: size }, () => Array(size).fill(0));
    
    // Fill some random positions with valid numbers
    const positions = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            positions.push([r, c]);
        }
    }
    
    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Try to place numbers randomly (more clues for larger grids)
    const numClues = Math.floor(size * 1.5) + Math.floor(Math.random() * 3);
    let placed = 0;
    
    for (const [r, c] of positions) {
        if (placed >= numClues) break;
        
        const numbers = Array.from({ length: size }, (_, i) => i + 1);
        // Shuffle numbers
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        
        for (const num of numbers) {
            if (isValidMove(grid, r, c, num, size)) {
                grid[r][c] = num;
                placed++;
                break;
            }
        }
    }
    
    return grid;
}