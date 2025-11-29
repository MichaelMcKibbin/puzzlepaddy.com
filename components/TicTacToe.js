import { useState, useEffect } from 'react';

export default function TicTacToe() {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winningLine, setWinningLine] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const result = calculateWinner(squares);
        const isBoardFull = squares.every(Boolean);

        if (result) {
            setWinningLine(result.line);
            setGameOver(true);

            setTimeout(() => {
                resetGame();
            }, 2000);
        } else if (isBoardFull) {
            setGameOver(true);

            setTimeout(() => {
                resetGame();
            }, 2000);
        }
    }, [squares]);

    function resetGame() {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
        setWinningLine([]);
        setGameOver(false);
    }

    function handleClick(i) {
        if (squares[i] || gameOver) return;

        const newSquares = squares.slice();
        newSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(newSquares);
        setXIsNext(!xIsNext);
    }

    function renderSquare(i) {
        const isWinningSquare = winningLine.includes(i);
        return (
            <button
                key={i}
                className={`w-20 h-20 text-3xl font-bold flex items-center justify-center transition-all duration-300 rounded-lg border-2 ${
                    isWinningSquare 
                        ? 'bg-green-200 border-green-400 shadow-lg' 
                        : squares[i] 
                            ? 'bg-gray-50 border-gray-300' 
                            : 'bg-white border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md'
                } ${squares[i] === 'X' ? 'text-blue-600' : 'text-red-500'}`}
                onClick={() => handleClick(i)}
            >
                <span className={`${squares[i] ? 'animate-pulse' : ''}`}>
                    {squares[i]}
                </span>
            </button>
        );
    }

    const winner = winningLine.length > 0 ? squares[winningLine[0]] : null;
    const status = winner
        ? `Winner: ${winner}`
        : `Next player: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="mb-6 text-2xl font-bold text-indigo-700 bg-white px-6 py-3 rounded-lg shadow-md">
                {status}
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 bg-white rounded-xl shadow-lg">
                {Array.from({ length: 9 }).map((_, i) => renderSquare(i))}
            </div>
            <button 
                onClick={resetGame}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
                New Game
            </button>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line };
        }
    }
    return null;
}
