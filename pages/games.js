// /pages/games.js
import Link from "next/link";

export default function Games() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Games</h2>
            <p>Here you'll find fun interactive games like Tic-Tac-Toe and more coming soon.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Link href="/games/tictactoe" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-300">
                    <h3 className="text-lg font-semibold text-gray-800">Tic-Tac-Toe</h3>
                </Link>
                <Link href="/games/mastermind" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-300">
                    <h3 className="text-lg font-semibold text-gray-800">Mastermind</h3>
                </Link>
                <Link href="/games/word-scramble" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-300">
                    <h3 className="text-lg font-semibold text-gray-800">Word Scramble</h3>
                </Link>
                <Link href="/games/mini-sudoku" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-300">
                    <h3 className="text-lg font-semibold text-gray-800">Mini Sudoku</h3>
                </Link>
                <Link href="/games/nonogram" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-300">
                    <h3 className="text-lg font-semibold text-gray-800">Nonogram</h3>
                </Link>
                <Link href="/games/sliding-tile" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-300">
                    <h3 className="text-lg font-semibold text-gray-800">Sliding Tile Puzzle</h3>
                </Link>
            </div>
        </div>
    );
}