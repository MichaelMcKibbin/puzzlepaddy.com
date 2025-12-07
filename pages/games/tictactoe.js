import { useState, useEffect } from 'react';

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

function getBestMove(squares, difficulty = 'hard') {
    const availableMoves = squares.map((square, index) => square === null ? index : null).filter(val => val !== null);
    
    // Easy: Random moves with occasional blocking
    if (difficulty === 'easy') {
        // 30% chance to block winning moves
        if (Math.random() < 0.3) {
            for (let move of availableMoves) {
                const testSquares = [...squares];
                testSquares[move] = 'X';
                if (calculateWinner(testSquares)) return move;
            }
        }
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    // Always try to win first (all difficulties)
    for (let move of availableMoves) {
        const testSquares = [...squares];
        testSquares[move] = 'O';
        if (calculateWinner(testSquares)) return move;
    }
    
    // Always block player from winning (medium and hard)
    for (let move of availableMoves) {
        const testSquares = [...squares];
        testSquares[move] = 'X';
        if (calculateWinner(testSquares)) return move;
    }
    
    // Medium: Basic strategy with some randomness
    if (difficulty === 'medium') {
        // Take center if available
        if (availableMoves.includes(4)) return 4;
        
        // Take corners with 70% probability
        const corners = [0, 2, 6, 8].filter(i => availableMoves.includes(i));
        if (corners.length > 0 && Math.random() < 0.7) {
            return corners[Math.floor(Math.random() * corners.length)];
        }
        
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    // Hard: Advanced strategy
    const corners = [0, 2, 6, 8];
    const playerCorners = corners.filter(i => squares[i] === 'X');
    
    // Counter corner trap strategy
    if ((squares[0] === 'X' && squares[8] === 'X') || (squares[2] === 'X' && squares[6] === 'X')) {
        const edges = [1, 3, 5, 7].filter(i => availableMoves.includes(i));
        if (edges.length > 0) return edges[Math.floor(Math.random() * edges.length)];
    }
    
    // Strategic center taking
    if (playerCorners.length === 1 && availableMoves.includes(4) && Math.random() < 0.3) {
        const edges = [1, 3, 5, 7].filter(i => availableMoves.includes(i));
        if (edges.length > 0) return edges[Math.floor(Math.random() * edges.length)];
    }
    
    if (availableMoves.includes(4)) return 4;
    
    // Block adjacent corner strategies
    if ((squares[0] === 'X' && squares[2] === 'X') || (squares[2] === 'X' && squares[8] === 'X') || 
        (squares[8] === 'X' && squares[6] === 'X') || (squares[6] === 'X' && squares[0] === 'X')) {
        const edges = [1, 3, 5, 7].filter(i => availableMoves.includes(i));
        if (edges.length > 0) return edges[Math.floor(Math.random() * edges.length)];
    }
    
    const availableCorners = corners.filter(i => availableMoves.includes(i));
    if (availableCorners.length > 0 && Math.random() < 0.8) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    const edges = [1, 3, 5, 7].filter(i => availableMoves.includes(i));
    if (edges.length > 0) return edges[Math.floor(Math.random() * edges.length)];
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

export default function TicTacToePage() {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winningLine, setWinningLine] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [vsComputer, setVsComputer] = useState(false);
    const [difficulty, setDifficulty] = useState('medium');

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
        } else if (vsComputer && !xIsNext && !gameOver) {
            // Computer's turn
            setTimeout(() => {
                const move = getBestMove(squares, difficulty);
                if (move !== undefined) {
                    const newSquares = [...squares];
                    newSquares[move] = 'O';
                    setSquares(newSquares);
                    setXIsNext(true);
                }
            }, 500);
        }
    }, [squares, xIsNext, vsComputer, gameOver]);

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
        ? `Winner: ${winner === 'X' ? (vsComputer ? 'You' : 'X') : (vsComputer ? 'Computer' : 'O')}`
        : vsComputer
            ? (xIsNext ? 'Your turn' : 'Computer thinking...')
            : `Next player: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Tic-Tac-Toe</h1>
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 flex gap-2">
                        <button
                            onClick={() => { setVsComputer(false); resetGame(); }}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                !vsComputer 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            2 Players
                        </button>
                        <button
                            onClick={() => { setVsComputer(true); resetGame(); }}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                vsComputer 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            vs Computer
                        </button>
                    </div>
                    {vsComputer && (
                        <div className="mb-4 flex gap-1">
                            {['easy', 'medium', 'hard'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => { setDifficulty(level); resetGame(); }}
                                    className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                                        difficulty === level 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}
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
            </div>
        </div>
    );
}