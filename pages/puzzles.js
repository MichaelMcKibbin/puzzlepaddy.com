// /pages/puzzles.js
import Link from "next/link";

const puzzles = [
    { slug: 'mastermind', name: 'Mastermind' },
    { slug: 'mini-sudoku', name: 'Mini Sudoku' },
    { slug: 'sliding-tile', name: 'Sliding Tile Puzzle' },
    { slug: 'word-scramble', name: 'Word Scramble' }
];

export default function Puzzles() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Puzzles</h2>
            <p>Enjoy brain teasers, word games, and logic puzzles. More to come!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {puzzles.map(puzzle => (
                    <Link key={puzzle.slug} href={`/puzzles/${puzzle.slug}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-300">
                        <h3 className="text-lg font-semibold text-gray-800">{puzzle.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}