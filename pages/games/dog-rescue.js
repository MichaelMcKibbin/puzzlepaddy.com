// pages/dog-rescue.js
import { useState } from "react";

const ACTIONS = [
    { id: "food", label: "Give food", icon: "🦴" },
    { id: "water", label: "Give water", icon: "💧" },
    { id: "rest", label: "Let them rest", icon: "🛏️" },
    { id: "play", label: "Play with them", icon: "🎾" },
];

const DOG_SCENES = [
    {
        id: 1,
        name: "Buddy",
        emoji: "🐶",
        mood: "hungry",
        description: "Buddy is licking their lips and staring at the food bowl.",
        correctActionId: "food",
    },
    {
        id: 2,
        name: "Luna",
        emoji: "🐕",
        mood: "thirsty",
        description: "Luna just came back from a walk and is panting heavily.",
        correctActionId: "water",
    },
    {
        id: 3,
        name: "Milo",
        emoji: "🐕‍🦺",
        mood: "tired",
        description: "Milo’s eyes are droopy and they keep circling their bed.",
        correctActionId: "rest",
    },
    {
        id: 4,
        name: "Poppy",
        emoji: "🐩",
        mood: "bored",
        description: "Poppy keeps nudging your hand and dropping a ball at your feet.",
        correctActionId: "play",
    },
    {
        id: 5,
        name: "Max",
        emoji: "🦮",
        mood: "hungry",
        description: "Max’s tummy is rumbling and they’re sniffing around the kitchen.",
        correctActionId: "food",
    },
    {
        id: 6,
        name: "Daisy",
        emoji: "🐕",
        mood: "thirsty",
        description: "Daisy just finished zoomies and is staring at the empty water bowl.",
        correctActionId: "water",
    },
];

const ACHIEVEMENTS = [
    {
        threshold: 10,
        title: "Paw-some Nurse 🎖️",
        message:
            "You’ve cared for 10 dogs! The ward is already wagging their tails in your honour.",
    },
    {
        threshold: 25,
        title: "Golden Collar Award 🥇",
        message:
            "25 dogs rescued! You’re officially the favourite nurse in the doggy hospital.",
    },
    {
        threshold: 50,
        title: "Legendary Dog Guardian 🌟",
        message:
            "50 dogs! That’s a whole hospital wing of happy pups thanks to you. The dogs (and humans) are so grateful.",
    },
];

function getRandomDogIndex(excludeIndex) {
    const available = DOG_SCENES
        .map((_, idx) => idx)
        .filter((idx) => idx !== excludeIndex);
    return available[Math.floor(Math.random() * available.length)];
}

export default function DogRescueGame() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [rescues, setRescues] = useState(0);
    const [feedback, setFeedback] = useState(null); // { type: "correct" | "wrong", message: string }
    const [hasAnswered, setHasAnswered] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState(null);

    const currentDog = DOG_SCENES[currentIndex];

    const handleAction = (actionId) => {
        if (hasAnswered) return;

        if (actionId === currentDog.correctActionId) {
            setScore((s) => s + 1);
            const newRescues = rescues + 1;
            setRescues(newRescues);

            // Check for new achievement
            const newlyUnlocked = ACHIEVEMENTS.find(
                (a) => a.threshold === newRescues
            );
            if (newlyUnlocked) {
                setUnlockedAchievement(newlyUnlocked);
            }

            setFeedback({
                type: "correct",
                message: `Perfect! ${currentDog.name} feels much better ❤️`,
            });
        } else {
            setFeedback({
                type: "wrong",
                message:
                    "Not quite. Try thinking like a nurse looking after a tired little dog 🐾",
            });
        }
        setHasAnswered(true);
    };

    const handleNextDog = () => {
        const nextIndex = getRandomDogIndex(currentIndex);
        setCurrentIndex(nextIndex);
        setFeedback(null);
        setHasAnswered(false);
    };

    const handleReset = () => {
        setScore(0);
        setRescues(0);
        setFeedback(null);
        setHasAnswered(false);
        setCurrentIndex(0);
        setUnlockedAchievement(null);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                            Nurse&apos;s Dog Rescue 🩺🐶
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base mt-1">
                            Choose the best way to care for each dog. Perfect for a kind-hearted nurse in recovery 💙
                        </p>
                    </div>
                    <div className="flex flex-col items-end text-right">
                        <span className="text-sm text-slate-500">Rescues</span>
                        <span className="text-lg font-semibold text-emerald-600">
              {rescues} <span className="text-rose-500">♥</span>
            </span>
                        <span className="text-xs text-slate-400 mt-1">
              Score: {score}
            </span>
                    </div>
                </header>

                {unlockedAchievement && (
                    <div className="mb-4 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base shadow-sm">
                        <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">
                🐕‍🦺
              </span>
                            <div>
                                <h3 className="font-semibold text-violet-800">
                                    {unlockedAchievement.title}
                                </h3>
                                <p className="text-violet-700 text-sm sm:text-base">
                                    {unlockedAchievement.message}
                                </p>
                                <p className="text-violet-500 text-xs mt-1">
                                    Keep going – the dogs adore you.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <section className="mb-6">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="text-5xl sm:text-6xl" aria-hidden="true">
                            {currentDog.emoji}
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                                {currentDog.name}
                            </h2>
                            <p className="text-sm text-slate-500">
                                This dog needs a little nurse-style care...
                            </p>
                        </div>
                    </div>
                    <p className="text-slate-700 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                        {currentDog.description}
                    </p>
                </section>

                <section className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                    {ACTIONS.map((action) => (
                        <button
                            key={action.id}
                            type="button"
                            onClick={() => handleAction(action.id)}
                            className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-sm sm:text-base font-medium transition
              ${
                                hasAnswered
                                    ? "cursor-default"
                                    : "hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                            }
              ${
                                hasAnswered && action.id === currentDog.correctActionId
                                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                                    : "border-slate-200 bg-white text-slate-700"
                            }`}
                            disabled={hasAnswered}
                        >
              <span className="text-2xl" aria-hidden="true">
                {action.icon}
              </span>
                            <span>{action.label}</span>
                        </button>
                    ))}
                </section>

                {feedback && (
                    <div
                        className={`mb-4 rounded-xl px-4 py-3 text-sm sm:text-base ${
                            feedback.type === "correct"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                    >
                        {feedback.message}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-2">
                    <button
                        type="button"
                        onClick={handleNextDog}
                        className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm sm:text-base font-semibold text-white shadow hover:bg-sky-700 transition"
                    >
                        Next dog 🐾
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                    >
                        Reset game
                    </button>
                </div>

                <p className="mt-4 text-xs text-center text-slate-400">
                    Made with love for a very special nurse 💙
                </p>
            </div>
        </main>
    );
}
