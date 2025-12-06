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

const colors = [
  { name: "red", value: "#ef4444" },
  { name: "blue", value: "#3b82f6" },
  { name: "green", value: "#10b981" },
  { name: "yellow", value: "#f59e0b" },
  { name: "purple", value: "#a855f7" },
  { name: "pink", value: "#ec4899" },
];

export default function Game4() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [targetColor, setTargetColor] = useState<string>("");
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [found, setFound] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [timeToFind, setTimeToFind] = useState(0);

  const difficulty = useSettingsStore((state) => state.difficulty);
  const sessionDuration = useSettingsStore((state) => state.sessionDuration);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const language = useSettingsStore((state) => state.language);
  const addSession = useProgressStore((state) => state.addSession);
  const t = getTranslation(language);

  const generateLevel = useCallback(() => {
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const options = shuffled.slice(
      0,
      difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 6
    );

    setTargetColor(target.value);
    setColorOptions(options.map((c) => c.value));
    setFound(false);
  }, [difficulty]);

  const startLevel = () => {
    generateLevel();
    setStartTime(Date.now());
  };

  const startGame = () => {
    setIsPlaying(true);
    setLevel(1);
    startLevel();
  };

  const handleColorClick = (color: string) => {
    if (!isPlaying || found) return;

    if (color === targetColor) {
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
      gameId: "game4",
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
              {t.game4Title}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">{t.game4Description}</p>
            <div className="bg-blue-100 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 max-w-2xl mx-auto text-left">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                👨‍👩‍👧 {t.forParents}
              </h3>
              <p className="text-lg text-gray-700">{t.game4Benefit}</p>
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

            <div className="relative w-full flex flex-col items-center pt-14">
              {/* Success Message overlay (no layout shift) */}
              <AnimatePresence>
                {found && (
                  <motion.div
                    className="absolute top-0 z-20 text-xl sm:text-2xl md:text-3xl font-bold text-green-700 bg-green-100/95 px-4 sm:px-6 py-3 rounded-2xl shadow-lg pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8, y: -12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -12 }}
                  >
                    ✅ {t.found}! ({timeToFind.toFixed(1)}s)
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Target Color */}
              <div className="mb-8">
                <p className="text-2xl font-bold text-gray-800 mb-4">
                  {t.findTheDifferent}:
                </p>
                <div
                  className="w-32 h-32 rounded-3xl shadow-lg border-4 border-gray-300 mx-auto"
                  style={{ backgroundColor: targetColor }}
                />
              </div>

              {/* Color Options */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl">
                {colorOptions.map((color, index) => (
                  <motion.button
                    key={index}
                    className={`
                    w-24 h-24 rounded-2xl shadow-lg border-4 transition-all
                    ${found && color === targetColor ? "border-green-500 scale-110" : "border-gray-300"}
                    ${!found ? "hover:scale-110 cursor-pointer" : ""}
                  `}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                    disabled={found}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!found ? { scale: 1.1 } : {}}
                    whileTap={!found ? { scale: 0.9 } : {}}
                    aria-label={`Color option ${index + 1}`}
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
