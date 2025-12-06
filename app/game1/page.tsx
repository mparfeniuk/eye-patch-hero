"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import Button from "@/components/Button";
import { useSettingsStore, getSpeedForDifficulty, getSizeForDifficulty } from "@/lib/useSettingsStore";
import { useProgressStore } from "@/lib/useProgressStore";
import { getTranslation } from "@/lib/translations";
import { playSound } from "@/lib/sounds";

interface DotPosition {
  x: number;
  y: number;
  id: number;
}

export default function Game1() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ hits: 0, misses: 0 });
  const [dots, setDots] = useState<DotPosition[]>([]);
  const [gameStartTime, setGameStartTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const difficulty = useSettingsStore((state) => state.difficulty);
  const sessionDuration = useSettingsStore((state) => state.sessionDuration);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const language = useSettingsStore((state) => state.language);
  const addSession = useProgressStore((state) => state.addSession);
  const t = getTranslation(language);

  const speed = getSpeedForDifficulty(difficulty);
  const size = getSizeForDifficulty(difficulty);

  const generateNewDot = useCallback((): DotPosition => {
    if (!containerRef.current) return { x: 50, y: 50, id: Date.now() };
    
    const container = containerRef.current;
    const maxX = container.clientWidth - size;
    const maxY = container.clientHeight - size;
    
    return {
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      id: Date.now(),
    };
  }, [size]);

  const moveDot = useCallback((dot: DotPosition): DotPosition => {
    if (!containerRef.current) return dot;
    
    const container = containerRef.current;
    const maxX = container.clientWidth - size;
    const maxY = container.clientHeight - size;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = speed * 5;
    
    let newX = dot.x + Math.cos(angle) * distance;
    let newY = dot.y + Math.sin(angle) * distance;
    
    // Bounce off walls
    if (newX < 0 || newX > maxX) {
      newX = Math.max(0, Math.min(maxX, newX));
    }
    if (newY < 0 || newY > maxY) {
      newY = Math.max(0, Math.min(maxY, newY));
    }
    
    return { ...dot, x: newX, y: newY };
  }, [speed, size]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length === 0) {
          return [generateNewDot()];
        }
        return prev.map(moveDot);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, generateNewDot, moveDot]);

  const handleDotClick = (dotId: number) => {
    if (!isPlaying) return;
    
    setDots((prev) => prev.filter((dot) => dot.id !== dotId));
    setScore((prev) => ({ ...prev, hits: prev.hits + 1 }));
    
    if (soundEnabled) {
      playSound("click");
    }
    
    // Add new dot after a short delay
    setTimeout(() => {
      setDots((prev) => [...prev, generateNewDot()]);
    }, 300);
  };

  const handleMiss = () => {
    if (!isPlaying) return;
    setScore((prev) => ({ ...prev, misses: prev.misses + 1 }));
    if (soundEnabled) {
      playSound("miss");
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameStartTime(Date.now());
    setScore({ hits: 0, misses: 0 });
    setDots([generateNewDot()]);
  };

  const finishGame = () => {
    setIsPlaying(false);
    const duration = Math.floor((Date.now() - gameStartTime) / 1000);
    const finalScore = score.hits * 10 - score.misses * 2;
    
    addSession({
      gameId: "game1",
      date: new Date().toISOString(),
      duration,
      score: finalScore,
      hits: score.hits,
      misses: score.misses,
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
              {t.catchTheDot}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">
              {t.game1Description}
            </p>
            <div className="bg-blue-100 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 max-w-2xl mx-auto text-left">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                👨‍👩‍👧 {t.forParents}
              </h3>
              <p className="text-lg text-gray-700">{t.game1Benefit}</p>
            </div>
            <Button onClick={startGame} size="large" ariaLabel={t.start}>
              {t.start}
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Score Display */}
            <div className="mb-8 flex flex-nowrap gap-3 sm:gap-4 md:gap-6 justify-center overflow-x-auto px-2 py-1">
              <div className="bg-green-100 px-4 sm:px-5 md:px-6 py-2 sm:py-3 rounded-xl text-base sm:text-xl md:text-2xl font-bold min-w-[150px] sm:min-w-[180px] md:min-w-[200px] text-center tabular-nums flex items-center justify-center gap-2 whitespace-nowrap">
                <span>✅</span>
                <span>
                  {t.hits}: {score.hits}
                </span>
              </div>
              <div className="bg-red-100 px-4 sm:px-5 md:px-6 py-2 sm:py-3 rounded-xl text-base sm:text-xl md:text-2xl font-bold min-w-[150px] sm:min-w-[180px] md:min-w-[200px] text-center tabular-nums flex items-center justify-center gap-2 whitespace-nowrap">
                <span>❌</span>
                <span>
                  {t.misses}: {score.misses}
                </span>
              </div>
              <div className="bg-blue-100 px-4 sm:px-5 md:px-6 py-2 sm:py-3 rounded-xl text-base sm:text-xl md:text-2xl font-bold min-w-[170px] sm:min-w-[200px] md:min-w-[230px] text-center tabular-nums flex items-center justify-center gap-2 whitespace-nowrap">
                <span>{t.score}:</span>
                <span>{score.hits * 10 - score.misses * 2}</span>
              </div>
            </div>

            {/* Game Area */}
            <div
              ref={containerRef}
              className="relative w-full max-w-5xl h-[60vh] bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl overflow-hidden cursor-crosshair"
              onClick={handleMiss}
            >
              <AnimatePresence>
                {dots.map((dot) => (
                  <motion.div
                    key={dot.id}
                    className="absolute rounded-full bg-red-500 shadow-lg cursor-pointer"
                    style={{
                      left: `${dot.x}px`,
                      top: `${dot.y}px`,
                      width: `${size}px`,
                      height: `${size}px`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDotClick(dot.id);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}

