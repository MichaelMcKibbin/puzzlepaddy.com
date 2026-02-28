import Link from "next/link";

// Combined list of all games/puzzles
const allGames = [
    { slug: 'tictactoe', name: 'Tic Tac Toe', path: '/games/tictactoe', category: 'Strategy' },
    { slug: 'four-in-a-row', name: 'Four in a Row', path: '/games/four-in-a-row', category: 'Strategy' },
    { slug: 'hangman', name: 'Hangman', path: '/games/hangman', category: 'Word' },
    { slug: 'word-scramble', name: 'Word Scramble', path: '/puzzles/word-scramble', category: 'Word' },
    { slug: 'mastermind', name: 'Mastermind', path: '/puzzles/mastermind', category: 'Logic' },
    { slug: 'mini-sudoku', name: 'Mini Sudoku', path: '/puzzles/mini-sudoku', category: 'Logic' },
    { slug: 'nonogram', name: 'Nonogram', path: '/games/nonogram', category: 'Logic' },
    { slug: 'sliding-tile', name: 'Sliding Tile', path: '/puzzles/sliding-tile', category: 'Puzzle' },
    { slug: 'snake', name: 'Snake', path: '/games/snake', category: 'Arcade' },
    { slug: 'number-guess', name: 'Number Guessing', path: '/games/number-guess', category: 'Puzzle' },
    { slug: 'dog-rescue', name: 'Dog Rescue', path: '/games/dog-rescue', category: 'Puzzle' },
];

export default function Home() {
    return (
        <div className="flex flex-col" style={{minHeight: 'calc(100vh - 80px)'}}>
            <div className="flex-grow p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to Puzzle Paddy</h1>
                        <p className="text-lg sm:text-xl text-gray-600">Challenge your mind with interactive games and puzzles</p>
                    </div>

                    {/* Game Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {allGames.map(game => (
                            <Link
                                key={game.slug}
                                href={game.path}
                                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-indigo-400 flex flex-col"
                            >
                                {/* Thumbnail placeholder - can be replaced with actual images later */}
                                <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
                                    <div className="text-4xl sm:text-5xl opacity-50 group-hover:opacity-70 transition-opacity">
                                        🎮
                                    </div>
                                </div>

                                {/* Game info */}
                                <div className="p-3 sm:p-4 flex-grow flex flex-col">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors mb-1">
                                        {game.name}
                                    </h3>
                                    <span className="text-xs text-gray-500 mt-auto">{game.category}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            
            <footer className="bg-gray-100 border-t border-gray-200 py-6 px-8 mt-auto">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm text-gray-700 mb-2">
                        A Node.js server side rendered (SSR) web application built with Next.js, React, and Tailwind CSS, with automatic deployment via webhook.
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        An ongoing personal project to create a fun and engaging platform for puzzle enthusiasts.
                    </p>
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} PuzzlePaddy.com. • All rights reserved. • <a href="https://michaelmckibbin.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Michael McKibbin</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
