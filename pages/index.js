import Link from "next/link";

export default function Home() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Welcome to Puzzle Paddy</h1>
            <p className="mt-4">Play <Link href="/tictactoe" className="text-blue-600 underline">Tic-Tac-Toe</Link> ?.</p>
        </div>
    );
}