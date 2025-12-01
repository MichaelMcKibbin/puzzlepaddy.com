import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-6">Welcome to Puzzle Paddy</h1>
                <p className="text-xl text-gray-600 mb-8">Challenge your mind with interactive games and puzzles</p>
                <Link href="/games" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                    Play Games
                </Link>
            </div>
        </div>
    );
}