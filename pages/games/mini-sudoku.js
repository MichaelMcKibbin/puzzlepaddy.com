// /pages/games/mini-sudoku.js
import { useState } from "react";

const START_GRID = [
    [1, 0, 0, 4],
    [0, 0, 3, 0],
    [0, 3, 0, 0],
    [2, 0, 0, 1],
];

export default function MiniSudokuPage() {
    const [grid, setGrid] = useState(START_GRID.map((row) => [...row]));
    const [status, setStatus] = useState("");

    function handleChange(r, c, value) {
        if (START_GRID[r][c] !== 0) return; // pre-filled, not editable
        const num = parseInt(value, 10);
        const copy = grid.map((row) => [...row]);
        copy[r][c] = Number.isNaN(num) ? 0 : Math.min(Math.max(num, 0), 4);
        setGrid(copy);
        setStatus("");
    }

    function checkSolution() {
        if (!isValidSudoku(grid)) {
            setStatus("❌ Not a valid Sudoku.");
            return;
        }
        const allFilled = grid.every((row) => row.every((v) => v >= 1 && v <= 4));
        setStatus(allFilled ? "✅ Looks good!" : "⚠ Some cells are still empty.");
    }

    function reset() {
        setGrid(START_GRID.map((row) => [...row]));
        setStatus("");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Mini Sudoku (4×4)</h1>
                
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-6 text-xl font-bold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md text-center">
                        Fill 1–4 so each row, column and 2×2 block has no repeats
                    </div>

                    <div className="grid grid-cols-4 gap-0 mb-6 p-4 bg-white rounded-xl shadow-lg">
                        {grid.map((row, r) =>
                            row.map((value, c) => {
                                const isFixed = START_GRID[r][c] !== 0;
                                const borderRight = (c + 1) % 2 === 0 && c !== 3 ? "border-r-2 border-gray-600" : "border-r border-gray-300";
                                const borderBottom = (r + 1) % 2 === 0 && r !== 3 ? "border-b-2 border-gray-600" : "border-b border-gray-300";
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
                </div>
            </div>
        </div>
    );
}

function isValidSudoku(grid) {
    // rows
    for (let r = 0; r < 4; r++) {
        if (!noDuplicates(grid[r])) return false;
    }
    // cols
    for (let c = 0; c < 4; c++) {
        const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        if (!noDuplicates(col)) return false;
    }
    // 2x2 blocks
    for (let br = 0; br < 4; br += 2) {
        for (let bc = 0; bc < 4; bc += 2) {
            const block = [
                grid[br][bc],
                grid[br][bc + 1],
                grid[br + 1][bc],
                grid[br + 1][bc + 1],
            ];
            if (!noDuplicates(block)) return false;
        }
    }
    return true;
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


