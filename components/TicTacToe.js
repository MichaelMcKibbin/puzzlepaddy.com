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
                className={`w-24 h-24 min-w-[6rem] min-h-[6rem] border border-gray-500 text-4xl font-bold flex items-center justify-center transition-all duration-300 ${
                    isWinningSquare ? 'bg-green-300' : 'bg-white'
                }`}
                onClick={() => handleClick(i)}
            >
        <span className={`${squares[i] ? 'animate-fade-in' : ''}`}>
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
            <div className="mb-4 text-xl font-semibold">{status}</div>
            <div className="grid grid-cols-3 gap-0 border border-gray-500">
                {Array.from({ length: 9 }).map((_, i) => renderSquare(i))}
            </div>
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
