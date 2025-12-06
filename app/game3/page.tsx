"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import Button from "@/components/Button";
import { useSettingsStore } from "@/lib/useSettingsStore";
import { useProgressStore } from "@/lib/useProgressStore";
import { getTranslation } from "@/lib/translations";
import { playSound } from "@/lib/sounds";

export default function Game3() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [contrast, setContrast] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [clicked, setClicked] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const difficulty = useSettingsStore((state) => state.difficulty);
  const sessionDuration = useSettingsStore((state) => state.sessionDuration);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const language = useSettingsStore((state) => state.language);
  const addSession = useProgressStore((state) => state.addSession);
  const t = getTranslation(language);

  // Start with very low contrast (nearly invisible) and increase
  // Easy: faster increase, Hard: slower increase
  const initialContrast = 0.05; // Start nearly invisible
  const contrastIncreaseSpeed =
    difficulty === "easy" ? 0.008 : difficulty === "medium" ? 0.005 : 0.003;

  const moveShape = useCallback(() => {
    if (!containerRef.current || !isPlaying || clicked) return;

    setPosition((prev) => {
      const container = containerRef.current!;
      const size = 100;
      const maxX = container.clientWidth - size;
      const maxY = container.clientHeight - size;

      const angle = Math.random() * Math.PI * 2;
      const distance = 3;

      let newX = prev.x + Math.cos(angle) * distance;
      let newY = prev.y + Math.sin(angle) * distance;

      // Bounce off walls
      if (newX < 0) newX = 0;
      if (newX > maxX) newX = maxX;
      if (newY < 0) newY = 0;
      if (newY > maxY) newY = maxY;

      return { x: newX, y: newY };
    });
  }, [isPlaying, clicked]);

  useEffect(() => {
    if (!isPlaying || clicked) return;

    const interval = setInterval(() => {
      moveShape();
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, clicked, moveShape]);

  useEffect(() => {
    if (!isPlaying || clicked) return;

    const interval = setInterval(() => {
      setContrast((prev) => {
        if (prev >= 1) return 1;
        return prev + contrastIncreaseSpeed;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPlaying, clicked, contrastIncreaseSpeed]);

  const startRound = () => {
    setContrast(initialContrast);
    setClicked(false);
    if (containerRef.current) {
      const container = containerRef.current;
      const size = 100;
      setPosition({
        x: Math.random() * (container.clientWidth - size),
        y: Math.random() * (container.clientHeight - size),
      });
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setRound(1);
    setScore(0);
    setGameStartTime(Date.now());
    startRound();
  };

  const handleShapeClick = () => {
    if (!isPlaying || clicked) return;

    setClicked(true);
    const points = Math.max(1, Math.floor((1 - contrast) * 100));
    setScore((prev) => prev + points);

    if (soundEnabled) {
      playSound("success");
    }

    setTimeout(() => {
      setRound((prev) => prev + 1);
      startRound();
    }, 2000);
  };

  const finishGame = () => {
    setIsPlaying(false);
    const duration = Math.floor((Date.now() - gameStartTime) / 1000);

    addSession({
      gameId: "game3",
      date: new Date().toISOString(),
      duration,
      score,
      hits: round,
      misses: 0,
      difficulty,
    });

    router.push("/");
  };

  const handleTimeUp = () => {
    finishGame();
  };

  const contrastPercentage = Math.floor(contrast * 100);
  const bgColor = `rgba(59, 130, 246, ${contrast})`; // blue-500 with contrast
  const borderColor = `rgba(37, 99, 235, ${contrast})`; // blue-600 with contrast

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
              {t.movingContrast}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">{t.clickWhenYouSee}</p>
            <div className="bg-blue-100 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 max-w-2xl mx-auto text-left">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                👨‍👩‍👧 {t.forParents}
              </h3>
              <p className="text-lg text-gray-700">{t.game3Benefit}</p>
            </div>
            <Button onClick={startGame} size="large" ariaLabel={t.start}>
              {t.start}
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Score Display */}
            <div className="mb-8 flex flex-wrap gap-3 sm:gap-6 justify-center">
              <div className="bg-blue-100 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-lg sm:text-2xl md:text-3xl font-bold w-[140px] sm:w-[160px] text-center tabular-nums">
                {t.level}: {round}
              </div>
              <div className="bg-green-100 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-lg sm:text-2xl md:text-3xl font-bold w-[140px] sm:w-[180px] text-center tabular-nums">
                {t.score}: {score}
              </div>
              <div className="bg-purple-100 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-lg sm:text-2xl md:text-3xl font-bold w-[140px] sm:w-[180px] text-center tabular-nums">
                {t.contrast}: {contrastPercentage}%
              </div>
            </div>

            <div className="relative w-full flex flex-col items-center pt-14">
              {/* Success Message overlay (no layout shift) */}
              <AnimatePresence>
                {clicked && (
                  <motion.div
                    className="absolute top-0 z-20 text-xl sm:text-2xl md:text-3xl font-bold text-green-700 bg-green-100/95 px-4 sm:px-6 py-3 rounded-2xl shadow-lg pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8, y: -12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -12 }}
                  >
                    ✅ {t.found}! +
                    {Math.max(1, Math.floor((1 - contrast) * 100))} {t.score}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game Area */}
              <div
                ref={containerRef}
                className="relative w-full max-w-5xl h-[60vh] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden cursor-crosshair"
              >
                <motion.div
                  className="absolute rounded-full border-4 cursor-pointer"
                  style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: "100px",
                    height: "100px",
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                  }}
                  animate={{
                    scale: clicked ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  onClick={handleShapeClick}
                  whileHover={!clicked ? { scale: 1.1 } : {}}
                  whileTap={!clicked ? { scale: 0.9 } : {}}
                />
              </div>

              {/* Instructions */}
              <p className="mt-6 text-xl text-gray-600 text-center">
                {t.clickWhenYouSee}
              </p>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}
