// /pages/games/sliding-tile.js
import { useEffect, useState } from "react";

const SIZE = 3;

function createSolvedBoard() {
    // 0 is the empty tile
    return Array.from({ length: SIZE * SIZE }, (_, i) => (i + 1) % (SIZE * SIZE));
}

function getNeighbors(index) {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const neighbors = [];
    if (row > 0) neighbors.push(index - SIZE);
    if (row < SIZE - 1) neighbors.push(index + SIZE);
    if (col > 0) neighbors.push(index - 1);
    if (col < SIZE - 1) neighbors.push(index + 1);
    return neighbors;
}

export default function SlidingTilePage() {
    const [board, setBoard] = useState(createSolvedBoard);
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);

    // Shuffle by doing random valid moves from solved state (always solvable)
    useEffect(() => {
        const shuffled = [...createSolvedBoard()];
        let emptyIndex = shuffled.indexOf(0);

        for (let i = 0; i < 100; i++) {
            const neighbors = getNeighbors(emptyIndex);
            const swapWith = neighbors[Math.floor(Math.random() * neighbors.length)];
            [shuffled[emptyIndex], shuffled[swapWith]] = [
                shuffled[swapWith],
                shuffled[emptyIndex],
            ];
            emptyIndex = swapWith;
        }

        setBoard(shuffled);
        setMoves(0);
        setWon(false);
    }, []);

    function handleTileClick(index) {
        if (won) return;
        const emptyIndex = board.indexOf(0);
        const neighbors = getNeighbors(emptyIndex);
        if (!neighbors.includes(index)) return;

        const newBoard = [...board];
        [newBoard[emptyIndex], newBoard[index]] = [
            newBoard[index],
            newBoard[emptyIndex],
        ];
        setBoard(newBoard);
        setMoves((m) => m + 1);

        if (isSolved(newBoard)) setWon(true);
    }

    function isSolved(b) {
        const solved = createSolvedBoard();
        return b.every((v, i) => v === solved[i]);
    }

    function reset() {
        const solved = createSolvedBoard();
        setBoard(solved);
        setMoves(0);
        setWon(false);
    }

    function scramble() {
        const shuffled = [...createSolvedBoard()];
        let emptyIndex = shuffled.indexOf(0);

        for (let i = 0; i < 100; i++) {
            const neighbors = getNeighbors(emptyIndex);
            const swapWith = neighbors[Math.floor(Math.random() * neighbors.length)];
            [shuffled[emptyIndex], shuffled[swapWith]] = [
                shuffled[swapWith],
                shuffled[emptyIndex],
            ];
            emptyIndex = swapWith;
        }

        setBoard(shuffled);
        setMoves(0);
        setWon(false);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Sliding Tile Puzzle</h1>
                
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-6 text-xl font-bold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md text-center">
                        Click tiles next to the empty space to slide them
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-white rounded-xl shadow-lg">
                        {board.map((value, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleTileClick(idx)}
                                className={`w-16 h-16 rounded-xl border border-gray-300 text-2xl font-bold cursor-pointer bg-gray-200 hover:bg-gray-300 transition-colors shadow-md ${
                                    value === 0 ? "invisible" : "visible"
                                }`}
                            >
                                {value !== 0 ? value : ""}
                            </button>
                        ))}
                    </div>

                    <div className="mb-6 text-lg font-semibold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md">
                        Moves: {moves}
                    </div>
                    
                    {won && (
                        <div className="mb-6 text-xl font-bold text-green-700 bg-green-100 px-6 py-3 rounded-lg shadow-md">
                            🎉 Solved!
                        </div>
                    )}

                    <div className="space-x-2">
                        <button 
                            onClick={scramble}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            New Game
                        </button>
                        <button 
                            onClick={reset}
                            className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-semibold"
                        >
                            Reset to Solved
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


