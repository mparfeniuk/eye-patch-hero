"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import Button from "@/components/Button";
import { useSettingsStore } from "@/lib/useSettingsStore";
import { useProgressStore } from "@/lib/useProgressStore";
import { getTranslation } from "@/lib/translations";
import { playSound } from "@/lib/sounds";

export default function Game5() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [circles, setCircles] = useState<
    { id: number; size: number; isLargest: boolean }[]
  >([]);
  const [found, setFound] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [timeToFind, setTimeToFind] = useState(0);

  const difficulty = useSettingsStore((state) => state.difficulty);
  const sessionDuration = useSettingsStore((state) => state.sessionDuration);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const language = useSettingsStore((state) => state.language);
  const addSession = useProgressStore((state) => state.addSession);
  const t = getTranslation(language);

  // More circles per difficulty
  const numCircles =
    difficulty === "easy" ? 8 : difficulty === "medium" ? 10 : 12;

  // Base size for circles and how much larger the biggest one is
  const baseSize = 70;
  // Default size difference depends on difficulty
  const defaultSizeDiff =
    difficulty === "easy" ? 0.3 : difficulty === "medium" ? 0.2 : 0.12;
  const [sizeDiff, setSizeDiff] = useState(defaultSizeDiff);

  // Update default when difficulty changes
  useEffect(() => {
    setSizeDiff(defaultSizeDiff);
  }, [defaultSizeDiff]);

  const generateLevel = useCallback(() => {
    // Pick which circle will be the largest
    const largestIndex = Math.floor(Math.random() * numCircles);

    // Small random variation for non-largest circles (±5px)
    const smallVariation = () => Math.random() * 10 - 5;

    // Create circles - one is clearly larger
    const newCircles = Array.from({ length: numCircles }, (_, index) => {
      const isLargest = index === largestIndex;
      const size = isLargest
        ? baseSize * (1 + sizeDiff) // Largest circle
        : baseSize + smallVariation(); // Other circles with small variation

      return {
        id: index,
        size: Math.round(size),
        isLargest,
      };
    });

    // Shuffle
    const shuffled = newCircles.sort(() => Math.random() - 0.5);
    setCircles(shuffled);
    setFound(false);
  }, [numCircles, sizeDiff]);

  const startLevel = () => {
    generateLevel();
    setStartTime(Date.now());
  };

  const startGame = () => {
    setIsPlaying(true);
    setLevel(1);
    startLevel();
  };

  const handleCircleClick = (circleId: number) => {
    if (!isPlaying || found) return;

    const circle = circles.find((c) => c.id === circleId);
    if (circle?.isLargest) {
      setFound(true);
      const timeTaken = (Date.now() - startTime) / 1000;
      setTimeToFind(timeTaken);

      if (soundEnabled) {
        playSound("success");
      }

      setTimeout(() => {
        setLevel((prev) => prev + 1);
        startLevel();
      }, 1500);
    } else {
      if (soundEnabled) {
        playSound("miss");
      }
    }
  };

  const finishGame = () => {
    setIsPlaying(false);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const finalScore = level * 100;

    addSession({
      gameId: "game5",
      date: new Date().toISOString(),
      duration,
      score: finalScore,
      hits: level,
      misses: 0,
      difficulty,
    });

    router.push("/");
  };

  const handleTimeUp = () => {
    finishGame();
  };

  return (
    <GameLayout
      onFinish={finishGame}
      showTimer={isPlaying}
      initialTime={sessionDuration * 60}
      onTimeUp={handleTimeUp}
    >
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        {!isPlaying ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-gray-800 mb-8">
              {t.game5Title}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">{t.game5Description}</p>
            {/* Size ratio control */}
            <div className="bg-white/80 border border-gray-200 rounded-2xl p-5 shadow-sm max-w-xl mx-auto mb-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-800">
                  {language === "uk" ? "Різниця розмірів" : "Size difference"}
                </span>
                <span className="text-lg font-bold tabular-nums">
                  {(sizeDiff * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.5}
                step={0.02}
                value={sizeDiff}
                onChange={(e) => setSizeDiff(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
                aria-label="Size difference slider"
              />
              <p className="text-sm text-gray-600 mt-2">
                {language === "uk"
                  ? "Більша різниця — легше знайти найбільший об'єкт. Менша — складніше."
                  : "Higher difference makes the largest circle easier to spot; lower makes it harder."}
              </p>
            </div>
            <div className="bg-blue-100 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 max-w-2xl mx-auto text-left">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                👨‍👩‍👧 {t.forParents}
              </h3>
              <p className="text-lg text-gray-700">{t.game5Benefit}</p>
            </div>
            <Button onClick={startGame} size="large" ariaLabel={t.start}>
              {t.start}
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Level Display */}
            <div className="mb-8 text-2xl sm:text-3xl md:text-4xl font-bold bg-blue-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl text-center">
              {t.level}: {level}
            </div>

            <div className="relative w-full flex flex-col items-center">
              {/* Success Message overlay (no layout shift) */}
              <AnimatePresence>
                {found && (
                  <motion.div
                    className="absolute top-0 z-20 text-xl sm:text-2xl md:text-3xl font-bold text-green-700 bg-green-100/95 px-4 sm:px-6 py-3 rounded-2xl shadow-lg pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  >
                    ✅ {t.found}! ({timeToFind.toFixed(1)}s)
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instruction */}
              <p className="text-2xl font-bold text-gray-800 mb-8 mt-12">
                {t.findTheDifferent}:
              </p>

              {/* Circles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl">
                {circles.map((circle, index) => (
                  <motion.button
                    key={circle.id}
                    className={`
                      rounded-full shadow-lg border-4 transition-all cursor-pointer
                      ${found && circle.isLargest ? "border-green-500 bg-green-400" : "border-gray-300 bg-blue-400"}
                      ${!found ? "hover:scale-110" : ""}
                    `}
                    style={{
                      width: `${circle.size}px`,
                      height: `${circle.size}px`,
                    }}
                    onClick={() => handleCircleClick(circle.id)}
                    disabled={found}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!found ? { scale: 1.1 } : {}}
                    whileTap={!found ? { scale: 0.9 } : {}}
                    aria-label={`Circle ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}
