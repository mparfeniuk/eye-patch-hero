"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { useSettingsStore } from "@/lib/useSettingsStore";
import { getTranslation } from "@/lib/translations";

interface GameLayoutProps {
  children: ReactNode;
  onFinish?: () => void;
  showTimer?: boolean;
  initialTime?: number; // in seconds
  onTimeUp?: () => void;
}

export default function GameLayout({
  children,
  onFinish,
  showTimer = true,
  initialTime,
  onTimeUp,
}: GameLayoutProps) {
  const router = useRouter();
  const language = useSettingsStore((state) => state.language);
  const t = getTranslation(language);
  const [timeLeft, setTimeLeft] = useState(initialTime || 0);
  const [isPaused, setIsPaused] = useState(false);
  const onTimeUpRef = useRef(onTimeUp);

  // keep latest onTimeUp without retriggering timer effect
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Reset timer when showTimer becomes true (game starts)
  useEffect(() => {
    if (showTimer && initialTime) {
      setTimeLeft(initialTime);
      setIsPaused(false);
    }
  }, [showTimer, initialTime]);

  useEffect(() => {
    if (!showTimer || !initialTime || isPaused || timeLeft <= 0) return;

    const timeout = setTimeout(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          onTimeUpRef.current?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [showTimer, initialTime, isPaused, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
          <Button
            onClick={() => router.push("/")}
            variant="secondary"
            size="medium"
            className="w-full sm:w-auto"
            ariaLabel={t.back}
          >
            ← {t.back}
          </Button>

          {showTimer && initialTime && (
            <div className="flex items-center gap-2 sm:gap-4 justify-center">
              <motion.div
                className="text-xl sm:text-3xl font-bold text-gray-800 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-md"
                animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: timeLeft <= 10 ? Infinity : 0 }}
              >
                ⏱️ {formatTime(timeLeft)}
              </motion.div>
              <Button
                onClick={() => setIsPaused(!isPaused)}
                variant="secondary"
                size="small"
                className="min-w-[60px]"
                ariaLabel={isPaused ? t.resume : t.pause}
              >
                {isPaused ? "▶️" : "⏸️"}
              </Button>
            </div>
          )}

          {onFinish && (
            <Button
              onClick={onFinish}
              variant="success"
              size="medium"
              className="w-full sm:w-auto"
              ariaLabel={t.finish}
            >
              {t.finish}
            </Button>
          )}
        </div>

        {/* Game Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key="game-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

