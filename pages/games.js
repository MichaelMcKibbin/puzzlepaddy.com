// /pages/games.js
export default function Games() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Games</h2>
            <p>Here you'll find fun interactive games like Tic-Tac-Toe and more coming soon.</p>
            <ul className="list-disc list-inside mt-4">
                <li><a className="text-indigo-600 hover:underline" href="/tictactoe">Play Tic-Tac-Toe</a></li>
                {/* Future games can be added here */}
            </ul>
        </div>
    );
}