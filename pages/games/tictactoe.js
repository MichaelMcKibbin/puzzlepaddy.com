import TicTacToe from '../../components/TicTacToe';

export default function GamePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Tic-Tac-Toe</h1>
                <TicTacToe />
            </div>
        </div>
    );
}