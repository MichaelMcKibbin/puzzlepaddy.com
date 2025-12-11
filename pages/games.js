// /pages/games.js
import Link from "next/link";

const games = [
    { slug: 'tictactoe', name: 'Tic Tac Toe' },
    { slug: 'nonogram', name: 'Nonogram' },
    { slug: 'snake', name: 'Snake' },
    { slug: 'hangman', name: 'Hangman' },
    { slug: 'number-guess', name: 'Number Guessing' },
    { slug: 'dog-rescue', name: 'Dog Rescue'}
];

export default function Games() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Games</h2>
            <p>Here you'll find fun interactive games like Tic-Tac-Toe and more coming soon.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {games.map(game => (
                    <Link key={game.slug} href={`/games/${game.slug}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-300">
                        <h3 className="text-lg font-semibold text-gray-800">{game.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}