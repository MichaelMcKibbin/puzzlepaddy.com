// /pages/games.js
import Link from "next/link";

export default function Games() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Games</h2>
            <p>Here you'll find fun interactive games like Tic-Tac-Toe and more coming soon.</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
                <li><Link className="text-indigo-600 hover:underline" href="/games/tictactoe">Play Tic-Tac-Toe</Link></li>
                <li><Link className="text-indigo-600 hover:underline" href="/games/mastermind">Play Mastermind</Link></li>
                <li><Link className="text-indigo-600 hover:underline" href="/games/word-scramble">Play Word Scramble</Link></li>
                <li><Link className="text-indigo-600 hover:underline" href="/games/mini-sudoku">Play Mini Sudoku</Link></li>
                <li><Link className="text-indigo-600 hover:underline" href="/games/nonogram">Play Nonogram</Link></li>
                <li><Link className="text-indigo-600 hover:underline" href="/games/sliding-tile">Play Sliding Tile Puzzle</Link></li>
            </ul>
        </div>
    );
}