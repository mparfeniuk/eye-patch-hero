"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import Button from "@/components/Button";
import {
  useSettingsStore,
  getSpeedForDifficulty,
} from "@/lib/useSettingsStore";
import { useProgressStore } from "@/lib/useProgressStore";
import { getTranslation } from "@/lib/translations";
import { playSound } from "@/lib/sounds";

interface Point {
  x: number;
  y: number;
}

export default function Game6() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [path, setPath] = useState<Point[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const difficulty = useSettingsStore((state) => state.difficulty);
  const sessionDuration = useSettingsStore((state) => state.sessionDuration);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const language = useSettingsStore((state) => state.language);
  const addSession = useProgressStore((state) => state.addSession);
  const t = getTranslation(language);

  const speed = getSpeedForDifficulty(difficulty);
  const pathLength =
    difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;
  // Default speed (ms per step) based on difficulty
  const defaultStepDuration =
    difficulty === "easy" ? 1200 : difficulty === "medium" ? 900 : 700;
  const [stepDuration, setStepDuration] = useState(defaultStepDuration);

  // Sync slider with difficulty change
  useEffect(() => {
    setStepDuration(defaultStepDuration);
  }, [defaultStepDuration]);

  const generatePath = useCallback((): Point[] => {
    if (!containerRef.current) return [];

    const container = containerRef.current;
    // Safe margin so points don't stick to edges on small screens
    const margin = Math.max(
      24,
      Math.min(80, container.clientWidth / 4, container.clientHeight / 4)
    );
    const points: Point[] = [];

    for (let i = 0; i < pathLength; i++) {
      points.push({
        x: margin + Math.random() * (container.clientWidth - margin * 2),
        y: margin + Math.random() * (container.clientHeight - margin * 2),
      });
    }

    return points;
  }, [pathLength]);

  useEffect(() => {
    if (!isPlaying || path.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= path.length - 1) {
          const newPath = generatePath();
          setPath(newPath);
          setScore((s) => s + 10);
          if (soundEnabled) playSound("success");
          return 0;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isPlaying, path, stepDuration, generatePath, soundEnabled]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setMisses(0);
    setGameStartTime(Date.now());
    setPath([]);
    setCurrentIndex(0);
  };

  // Build path once the game area exists in the DOM
  useEffect(() => {
    if (!isPlaying) return;
    const newPath = generatePath();
    if (newPath.length > 0) {
      setPath(newPath);
      setCurrentIndex(0);
    }
  }, [isPlaying, generatePath]);

  // Recalculate path on resize while playing to avoid zero-size container issues
  useEffect(() => {
    if (!isPlaying) return;
    const handleResize = () => {
      const newPath = generatePath();
      if (newPath.length > 0) {
        setPath(newPath);
        setCurrentIndex(0);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPlaying, generatePath]);

  const handlePathClick = (index: number) => {
    if (!isPlaying) return;

    if (index === currentIndex) {
      setScore((s) => s + 20);
      if (soundEnabled) {
        playSound("success");
      }
    } else {
      setMisses((m) => m + 1);
      if (soundEnabled) {
        playSound("miss");
      }
    }
  };

  const finishGame = () => {
    setIsPlaying(false);
    const duration = Math.floor((Date.now() - gameStartTime) / 1000);
    const finalScore = score - misses * 5;

    addSession({
      gameId: "game6",
      date: new Date().toISOString(),
      duration,
      score: finalScore,
      hits: score / 20,
      misses,
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
              {t.game6Title}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">{t.game6Description}</p>
            {/* Speed control */}
            <div className="bg-white/80 border border-gray-200 rounded-2xl p-5 shadow-sm max-w-xl mx-auto mb-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-800">
                  {language === "uk" ? "Швидкість руху" : "Movement speed"}
                </span>
                <span className="text-lg font-bold tabular-nums">
                  {(1000 / stepDuration).toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min={400}
                max={1400}
                step={50}
                value={stepDuration}
                onChange={(e) => setStepDuration(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500"
                aria-label="Speed slider"
              />
              <p className="text-sm text-gray-600 mt-2">
                {language === "uk"
                  ? "Менше значення — швидше перемикання точок. Більше — повільніше."
                  : "Lower value = faster steps. Higher = slower."}
              </p>
            </div>
            <div className="bg-blue-100 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 max-w-2xl mx-auto text-left">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                👨‍👩‍👧 {t.forParents}
              </h3>
              <p className="text-lg text-gray-700">{t.game6Benefit}</p>
            </div>
            <Button onClick={startGame} size="large" ariaLabel={t.start}>
              {t.start}
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Score Display */}
            <div className="mb-8 flex flex-wrap gap-3 sm:gap-6 justify-center">
              <div className="bg-green-100 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-lg sm:text-2xl md:text-3xl font-bold w-[140px] sm:w-[180px] text-center tabular-nums">
                {t.score}: {score}
              </div>
              <div className="bg-red-100 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-lg sm:text-2xl md:text-3xl font-bold w-[140px] sm:w-[180px] text-center tabular-nums">
                {t.misses}: {misses}
              </div>
            </div>

            {/* Game Area */}
            <div
              ref={containerRef}
              className="relative w-full max-w-5xl h-[60vh] bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl overflow-hidden"
            >
              {/* Path */}
              {path.length > 0 && (
                <svg className="absolute inset-0 w-full h-full">
                  <motion.polyline
                    points={path
                      .slice(0, Math.min(path.length, currentIndex + 2))
                      .map((p) => `${p.x},${p.y}`)
                      .join(" ")}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              )}

              {/* Points */}
              {path.map((point, index) => (
                <motion.button
                  key={index}
                  className={`
                    absolute rounded-full border-4 cursor-pointer transition-all
                    ${
                      index === currentIndex
                        ? "bg-yellow-400 border-yellow-600 scale-125 z-10"
                        : index < currentIndex
                          ? "bg-green-400 border-green-600"
                          : "bg-gray-300 border-gray-500"
                    }
                  `}
                  style={{
                    left: `${point.x - 15}px`,
                    top: `${point.y - 15}px`,
                    width: "30px",
                    height: "30px",
                  }}
                  onClick={() => handlePathClick(index)}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: index === currentIndex ? 1.25 : 1,
                    opacity:
                      index === currentIndex
                        ? 1
                        : index < currentIndex
                          ? 0.9
                          : 0.65,
                  }}
                  transition={{ duration: 0.25 }}
                  whileHover={
                    index === currentIndex ? { scale: 1.35 } : { scale: 1.05 }
                  }
                  aria-label={`Path point ${index + 1}`}
                />
              ))}
            </div>

            {/* Instruction */}
            <p className="mt-6 text-xl text-gray-600 text-center">
              {t.clickWhenYouSee}
            </p>
          </>
        )}
      </div>
    </GameLayout>
  );
}
