// /pages/games/snake.js
import { useEffect, useState, useCallback } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

function getRandomFood(snake) {
    let food;
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
}

export default function SnakePage() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [food, setFood] = useState(() => getRandomFood(INITIAL_SNAKE));
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    const moveSnake = useCallback(() => {
        if (gameOver || !gameStarted) return;

        setSnake(currentSnake => {
            const newSnake = [...currentSnake];
            const head = { ...newSnake[0] };
            
            head.x += direction.x;
            head.y += direction.y;

            // Check wall collision
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                setGameOver(true);
                return currentSnake;
            }

            // Check self collision
            if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                setGameOver(true);
                return currentSnake;
            }

            newSnake.unshift(head);

            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 10);
                setFood(getRandomFood(newSnake));
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [direction, food, gameOver, gameStarted]);

    useEffect(() => {
        const gameInterval = setInterval(moveSnake, 150);
        return () => clearInterval(gameInterval);
    }, [moveSnake]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!gameStarted && e.key === ' ') {
                e.preventDefault();
                setGameStarted(true);
                return;
            }
            
            if (gameOver) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    if (direction.y === 0) setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (direction.y === 0) setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (direction.x === 0) setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (direction.x === 0) setDirection({ x: 1, y: 0 });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction, gameOver, gameStarted]);

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setFood(getRandomFood(INITIAL_SNAKE));
        setGameOver(false);
        setScore(0);
        setGameStarted(false);
    };

    const handleDirectionChange = (newDirection) => {
        if (gameOver) return;
        if (!gameStarted) {
            setGameStarted(true);
            return;
        }
        
        const { x, y } = newDirection;
        if ((direction.x === 0 && x !== 0) || (direction.y === 0 && y !== 0)) {
            setDirection(newDirection);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-800 font-mono flex flex-col items-center justify-start p-2 sm:justify-center sm:p-4">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-emerald-700">SNAKE</h1>
            
            <div className="mb-2 sm:mb-4 text-lg sm:text-xl">
                SCORE: {score}
            </div>

            <div 
                className="grid bg-gray-100 border-4 border-emerald-600 mb-2 sm:mb-4 max-w-full"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    width: 'min(90vw, 400px)',
                    height: 'min(90vw, 400px)'
                }}
            >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                    const x = index % GRID_SIZE;
                    const y = Math.floor(index / GRID_SIZE);
                    
                    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                    const isFood = food.x === x && food.y === y;
                    const isHead = snake[0] && snake[0].x === x && snake[0].y === y;

                    return (
                        <div
                            key={index}
                            className={`border border-gray-300 ${
                                isSnake 
                                    ? isHead 
                                        ? 'bg-emerald-700' 
                                        : 'bg-emerald-500'
                                    : isFood 
                                        ? 'bg-red-500' 
                                        : 'bg-white'
                            }`}
                        />
                    );
                })}
            </div>

            {!gameStarted && !gameOver && (
                <div className="text-center mb-2 sm:mb-4">
                    <div className="text-lg sm:text-2xl mb-1 sm:mb-2">PRESS SPACE OR TAP ARROW TO START</div>
                    <div className="text-sm sm:text-lg mb-1 sm:mb-2">USE ARROW KEYS OR BUTTONS TO MOVE</div>
                </div>
            )}

            {gameStarted && !gameOver && (
                <div className="text-center mb-2 sm:mb-4">
                    <div className="text-lg sm:text-2xl mb-1 sm:mb-2">Eat all the apples!</div>
                    <div className="text-sm sm:text-lg mb-1 sm:mb-2">Avoid the walls, and don't bite yourself!</div>
                </div>
            )}

            {gameOver && (
                <div className="text-center mb-2 sm:mb-4">
                    <div className="text-sm sm:text-lg mb-1 sm:mb-2">FINAL SCORE: {score}</div>
                    <div className="text-lg sm:text-2xl mb-1 sm:mb-2 text-red-400">GAME OVER</div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-2 sm:mb-4 w-32">
                <div></div>
                <button 
                    onClick={() => handleDirectionChange({ x: 0, y: -1 })}
                    className="w-10 h-10 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                    ↑
                </button>
                <div></div>
                <button 
                    onClick={() => handleDirectionChange({ x: -1, y: 0 })}
                    className="w-10 h-10 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                    ←
                </button>
                <div></div>
                <button 
                    onClick={() => handleDirectionChange({ x: 1, y: 0 })}
                    className="w-10 h-10 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                    →
                </button>
                <div></div>
                <button 
                    onClick={() => handleDirectionChange({ x: 0, y: 1 })}
                    className="w-10 h-10 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                    ↓
                </button>
                <div></div>
            </div>

            <button 
                onClick={resetGame}
                className="px-6 py-2 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition-colors"
            >
                NEW GAME
            </button>
        </div>
    );
}