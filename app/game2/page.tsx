"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import Button from "@/components/Button";
import { useSettingsStore } from "@/lib/useSettingsStore";
import { useProgressStore } from "@/lib/useProgressStore";
import { getTranslation } from "@/lib/translations";
import { playSound } from "@/lib/sounds";

type Symbol = "●" | "○" | "■" | "□" | "▲" | "△" | "★" | "☆";

interface GridCell {
  symbol: Symbol;
  isDifferent: boolean;
  id: number;
}

export default function Game2() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [found, setFound] = useState(false);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [timeToFind, setTimeToFind] = useState(0);

  const difficulty = useSettingsStore((state) => state.difficulty);
  const sessionDuration = useSettingsStore((state) => state.sessionDuration);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const language = useSettingsStore((state) => state.language);
  const addSession = useProgressStore((state) => state.addSession);
  const t = getTranslation(language);

  const gridSize = difficulty === "easy" ? 4 : difficulty === "medium" ? 5 : 6;
  const symbols: Symbol[] = useMemo(
    () => ["●", "○", "■", "□", "▲", "△", "★", "☆"],
    []
  );

  const generateGrid = useCallback((): GridCell[] => {
    const cells: GridCell[] = [];
    const baseSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const differentSymbol = symbols.find((s) => s !== baseSymbol) || baseSymbol;
    const differentIndex = Math.floor(Math.random() * gridSize * gridSize);

    for (let i = 0; i < gridSize * gridSize; i++) {
      cells.push({
        symbol: i === differentIndex ? differentSymbol : baseSymbol,
        isDifferent: i === differentIndex,
        id: i,
      });
    }

    return cells;
  }, [gridSize, symbols]);

  const startLevel = () => {
    setFound(false);
    setGrid(generateGrid());
    setStartTime(Date.now());
  };

  const startGame = () => {
    setIsPlaying(true);
    setLevel(1);
    startLevel();
  };

  const handleCellClick = (cell: GridCell) => {
    if (!isPlaying || found) return;

    if (cell.isDifferent) {
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
      gameId: "game2",
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
              {t.focusGrid}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">{t.findTheDifferent}</p>
            <div className="bg-blue-100 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 max-w-2xl mx-auto text-left">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                👨‍👩‍👧 {t.forParents}
              </h3>
              <p className="text-lg text-gray-700">{t.game2Benefit}</p>
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

              {/* Grid */}
              <div
                className="grid gap-4 p-6 bg-white rounded-3xl shadow-lg"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {grid.map((cell) => (
                  <motion.button
                    key={cell.id}
                    className={`
                    aspect-square flex items-center justify-center text-6xl md:text-7xl
                    rounded-xl transition-all duration-200
                    ${cell.isDifferent && found ? "bg-green-300" : "bg-gray-100 hover:bg-gray-200"}
                    focus:outline-none focus:ring-4 focus:ring-blue-500
                  `}
                    onClick={() => handleCellClick(cell)}
                    disabled={found}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: cell.id * 0.02 }}
                    whileHover={!found ? { scale: 1.1 } : {}}
                    whileTap={!found ? { scale: 0.9 } : {}}
                    aria-label={cell.isDifferent ? t.findTheDifferent : ""}
                  >
                    {cell.symbol}
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}
