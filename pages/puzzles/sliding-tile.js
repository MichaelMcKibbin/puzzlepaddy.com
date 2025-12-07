// /pages/games/sliding-tile.js
import { useEffect, useState } from "react";

function createSolvedBoard(size) {
    // 0 is the empty tile
    return Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
}

function getNeighbors(index, size) {
    const row = Math.floor(index / size);
    const col = index % size;
    const neighbors = [];
    if (row > 0) neighbors.push(index - size);
    if (row < size - 1) neighbors.push(index + size);
    if (col > 0) neighbors.push(index - 1);
    if (col < size - 1) neighbors.push(index + 1);
    return neighbors;
}

export default function SlidingTilePage() {
    const [size, setSize] = useState(3);
    const [board, setBoard] = useState(() => createSolvedBoard(3));
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);

    // Shuffle by doing random valid moves from solved state (always solvable)
    useEffect(() => {
        const shuffled = [...createSolvedBoard(size)];
        let emptyIndex = shuffled.indexOf(0);

        for (let i = 0; i < 100; i++) {
            const neighbors = getNeighbors(emptyIndex, size);
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
    }, [size]);

    function handleTileClick(index) {
        if (won) return;
        const emptyIndex = board.indexOf(0);
        const neighbors = getNeighbors(emptyIndex, size);
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
        const solved = createSolvedBoard(size);
        return b.every((v, i) => v === solved[i]);
    }

    function solve() {
        const solved = createSolvedBoard(size);
        setBoard(solved);
        setMoves(0);
        setWon(false);
    }

    function scramble() {
        const shuffled = [...createSolvedBoard(size)];
        let emptyIndex = shuffled.indexOf(0);

        for (let i = 0; i < 100; i++) {
            const neighbors = getNeighbors(emptyIndex, size);
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

                    <div className="mb-6 flex gap-2">
                        {[3, 4, 5].map(s => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    size === s 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {s}×{s}
                            </button>
                        ))}
                    </div>

                    <div className={`grid gap-2 mb-6 p-4 bg-white rounded-xl shadow-lg`} style={{gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`}}>
                        {board.map((value, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleTileClick(idx)}
                                className={`${size === 3 ? 'w-16 h-16 text-2xl' : size === 4 ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm'} rounded-xl border border-gray-300 font-bold cursor-pointer bg-gray-200 hover:bg-gray-300 transition-colors shadow-md ${
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
                            onClick={solve}
                            className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-semibold"
                        >
                            Solve it!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


