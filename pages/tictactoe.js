import TicTacToe from '../components/TicTacToe';

export default function GamePage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Tic-Tac-Toe</h1>
            <TicTacToe />
        </div>
    );
}