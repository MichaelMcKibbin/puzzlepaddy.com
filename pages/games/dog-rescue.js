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
        emoji: "🐕🦺",
        mood: "tired",
        description: "Milo's eyes are droopy and they keep circling their bed.",
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
        description: "Max's tummy is rumbling and they're sniffing around the kitchen.",
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
    {
        id: 7,
        name: "Charlie",
        emoji: "🐕🦺",
        mood: "tired",
        description: "Charlie just yawned and is slowly walking toward their favorite blanket.",
        correctActionId: "rest",
    },
    {
        id: 8,
        name: "Bella",
        emoji: "🐶",
        mood: "hungry",
        description: "Bella is whimpering softly and pawing at the treat cupboard.",
        correctActionId: "food",
    },
    {
        id: 9,
        name: "Rocky",
        emoji: "🐕",
        mood: "bored",
        description: "Rocky is spinning in circles and barking at their favorite toy.",
        correctActionId: "play",
    },
    {
        id: 10,
        name: "Rosie",
        emoji: "🐩",
        mood: "thirsty",
        description: "Rosie keeps looking between you and the water dish with hopeful eyes.",
        correctActionId: "water",
    },
    {
        id: 11,
        name: "Oscar",
        emoji: "🦮",
        mood: "tired",
        description: "Oscar is lying down but his eyes keep closing as he fights sleep.",
        correctActionId: "rest",
    },
    {
        id: 12,
        name: "Molly",
        emoji: "🐶",
        mood: "bored",
        description: "Molly is pawing at you and doing little play bows to get your attention.",
        correctActionId: "play",
    },
    {
        id: 13,
        name: "Zeus",
        emoji: "🐕🦺",
        mood: "hungry",
        description: "Zeus is sitting perfectly but drooling while staring at the food cabinet.",
        correctActionId: "food",
    },
    {
        id: 14,
        name: "Ruby",
        emoji: "🐕",
        mood: "thirsty",
        description: "Ruby's tongue is hanging out and she's pacing near the water fountain.",
        correctActionId: "water",
    },
    {
        id: 15,
        name: "Cooper",
        emoji: "🐩",
        mood: "tired",
        description: "Cooper is curled up in a ball but keeps shifting uncomfortably.",
        correctActionId: "rest",
    },
    {
        id: 16,
        name: "Sadie",
        emoji: "🦮",
        mood: "bored",
        description: "Sadie brought you three different toys and is wagging expectantly.",
        correctActionId: "play",
    },
    {
        id: 17,
        name: "Duke",
        emoji: "🐶",
        mood: "hungry",
        description: "Duke is doing his best 'starving puppy' eyes while his stomach gurgles.",
        correctActionId: "food",
    },
    {
        id: 18,
        name: "Coco",
        emoji: "🐕",
        mood: "thirsty",
        description: "Coco just finished playing fetch and is breathing heavily with her mouth open.",
        correctActionId: "water",
    },
    {
        id: 19,
        name: "Bear",
        emoji: "🐕🦺",
        mood: "tired",
        description: "Bear is standing but swaying slightly, clearly ready for a nap.",
        correctActionId: "rest",
    },
    {
        id: 20,
        name: "Penny",
        emoji: "🐩",
        mood: "bored",
        description: "Penny is doing zoomies around the room and keeps looking at you hopefully.",
        correctActionId: "play",
    },
    {
        id: 21,
        name: "Tucker",
        emoji: "🦮",
        mood: "hungry",
        description: "Tucker is sitting by his empty bowl and giving you the most pitiful look.",
        correctActionId: "food",
    },
    {
        id: 22,
        name: "Lily",
        emoji: "🐶",
        mood: "thirsty",
        description: "Lily keeps licking her lips and nosing at the water bowl hopefully.",
        correctActionId: "water",
    },
    {
        id: 23,
        name: "Buster",
        emoji: "🐕",
        mood: "tired",
        description: "Buster's head is nodding as he tries to stay awake while sitting.",
        correctActionId: "rest",
    },
    {
        id: 24,
        name: "Nala",
        emoji: "🐕🦺",
        mood: "bored",
        description: "Nala is bouncing around with a rope toy, clearly wanting someone to play tug.",
        correctActionId: "play",
    },
    {
        id: 25,
        name: "Finn",
        emoji: "🐩",
        mood: "hungry",
        description: "Finn is pacing back and forth between you and the food storage area.",
        correctActionId: "food",
    },
    {
        id: 26,
        name: "Zoe",
        emoji: "🦮",
        mood: "thirsty",
        description: "Zoe just woke up from a nap and is smacking her lips, looking parched.",
        correctActionId: "water",
    },
];

const ACHIEVEMENTS = [
    {
        threshold: 10,
        title: "Paw-some Nurse 🎖️",
        message:
            "You've cared for 10 dogs! The ward is already wagging their tails in your honour.",
    },
    {
        threshold: 25,
        title: "Golden Collar Award 🥇",
        message:
            "25 dogs rescued! You're officially the favourite nurse in the doggy hospital.",
    },
    {
        threshold: 50,
        title: "Legendary Dog Guardian 🌟",
        message:
            "50 dogs! That's a whole hospital wing of happy pups thanks to you. The dogs (and humans) are so grateful.",
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
    const [showAchievementPopup, setShowAchievementPopup] = useState(false);

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
                setShowAchievementPopup(true);
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
        setShowAchievementPopup(false);
    };

    const handleContinuePlaying = () => {
        setShowAchievementPopup(false);
    };

    const handleTakeBreak = () => {
        setShowAchievementPopup(false);
        handleReset();
    };

    return (
        <>
            {/* Achievement Popup */}
            {showAchievementPopup && unlockedAchievement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <div className="text-center">
                            <div className="text-4xl mb-3">🐕🦺</div>
                            <h3 className="text-xl font-bold text-violet-800 mb-2">
                                {unlockedAchievement.title}
                            </h3>
                            <p className="text-violet-700 text-sm mb-4">
                                {unlockedAchievement.message}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleContinuePlaying}
                                    className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-sky-700 transition"
                                >
                                    Keep Playing 🐾
                                </button>
                                <button
                                    onClick={handleTakeBreak}
                                    className="flex-1 border border-slate-300 text-slate-600 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 transition"
                                >
                                    Take a Break
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <main className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <header className="flex flex-row items-center justify-between gap-3 mb-6">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-3xl font-bold text-slate-800">
                                Dog Rescue 🩺🐶
                            </h1>
                            <p className="text-slate-600 text-xs sm:text-base mt-1">
                                Care for each dog 💙
                            </p>
                        </div>
                        <div className="flex flex-col items-end text-right shrink-0">
                            <span className="text-sm text-slate-500">Rescues</span>
                            <span className="text-lg font-semibold text-emerald-600">
                                {rescues} <span className="text-rose-500">♥</span>
                            </span>
                            <span className="text-xs text-slate-400 mt-1">
                                Score: {score}
                            </span>
                        </div>
                    </header>

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

                    {/* Feedback message area with fixed height */}
                    <div className="min-h-[70px] mb-4">
                        {feedback && (
                            <div
                                className={`rounded-xl px-4 py-3 text-sm sm:text-base ${
                                    feedback.type === "correct"
                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                        : "bg-amber-50 text-amber-800 border border-amber-200"
                                }`}
                            >
                                {feedback.message}
                            </div>
                        )}
                    </div>

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
                        Made with love for my very special aunt Pegeen 💙
                    </p>
                </div>
            </main>
        </>
    );
}