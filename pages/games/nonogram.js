// /pages/games/nonogram.js
import { useState } from "react";

// 5x5 puzzle – 1 = filled, 0 = empty
const SOLUTION = [
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 1, 1, 0],
];

const ROW_CLUES = [
    [3],
    [1, 1, 1],
    [5],
    [1, 1, 1],
    [3],
];

const COL_CLUES = [
    [3],
    [1,1,1],
    [5],
    [1,1,1],
    [3],
];

export default function NonogramPage() {
    const [grid, setGrid] = useState(
        Array.from({ length: 5 }, () => Array(5).fill(0))
    );
    const [status, setStatus] = useState("");

    function toggleCell(r, c) {
        const copy = grid.map((row) => [...row]);
        copy[r][c] = copy[r][c] ? 0 : 1;
        setGrid(copy);
        setStatus("");
    }

    function checkSolution() {
        const correct =
            grid.length === SOLUTION.length &&
            grid.every((row, r) =>
                row.every((cell, c) => cell === SOLUTION[r][c])
            );
        setStatus(correct ? "✅ Correct! Picture revealed." : "❌ Not quite yet.");
    }

    function clearGrid() {
        setGrid(Array.from({ length: 5 }, () => Array(5).fill(0)));
        setStatus("");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Nonogram (5×5)</h1>
                
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-6 text-xl font-bold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md text-center">
                        Click squares to fill them and match the clues
                    </div>

                    <div className="flex items-start mb-6 p-4 bg-white rounded-xl shadow-lg">
                        {/* Row clues */}
                        <div className="flex flex-col justify-items-end text-sm pr-2">
                            {/* Spacer for column clues */}
                            <div className="h-8 mb-1"></div>
                            {/* Row clues aligned with grid rows */}
                            {ROW_CLUES.map((clue, i) => (
                                <div key={i} className="min-w-10 text-right h-8 flex items-center justify-end">
                                    {clue.join(" ")}
                                </div>
                            ))}
                        </div>

                        {/* Column clues + grid */}
                        <div>
                            <div className="grid grid-cols-5 mb-1">
                                {COL_CLUES.map((clue, i) => (
                                    <div key={i} className="whitespace-pre text-xs text-center h-8 w-8 flex items-end justify-center">
                                        {clue.join("\n")}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-5 grid-rows-5 border border-gray-400">
                                {grid.map((row, r) =>
                                    row.map((cell, c) => (
                                        <div
                                            key={`${r}-${c}`}
                                            onClick={() => toggleCell(r, c)}
                                            className={`w-8 h-8 border border-gray-300 cursor-pointer hover:opacity-80 transition-colors ${
                                                cell ? "bg-gray-800" : "bg-white"
                                            }`}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 space-x-2">
                        <button 
                            onClick={checkSolution}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            Check
                        </button>
                        <button 
                            onClick={clearGrid}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
                        >
                            Clear
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


