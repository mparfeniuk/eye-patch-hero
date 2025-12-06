import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "./translations";

export type Difficulty = "easy" | "medium" | "hard";

export interface Settings {
  difficulty: Difficulty;
  sessionDuration: 5 | 10 | 15;
  soundEnabled: boolean;
  language: Language;
  speed: number; // 1-5
  size: number; // 20-80px
  contrastLevel: number; // 0.1-1.0
}

const defaultSettings: Settings = {
  difficulty: "medium",
  sessionDuration: 10,
  soundEnabled: true,
  language: "uk",
  speed: 3,
  size: 50,
  contrastLevel: 0.5,
};

interface SettingsStore extends Settings {
  setDifficulty: (difficulty: Difficulty) => void;
  setSessionDuration: (duration: 5 | 10 | 15) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setLanguage: (language: Language) => void;
  setSpeed: (speed: number) => void;
  setSize: (size: number) => void;
  setContrastLevel: (level: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setDifficulty: (difficulty) => set({ difficulty }),
      setSessionDuration: (duration) => set({ sessionDuration: duration }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setLanguage: (language) => set({ language }),
      setSpeed: (speed) => set({ speed }),
      setSize: (size) => set({ size }),
      setContrastLevel: (level) => set({ contrastLevel: level }),
    }),
    {
      name: "eye-patch-hero-settings",
      version: 1,
    }
  )
);

// Helper functions to get difficulty-based values
export function getSpeedForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 2;
    case "medium":
      return 3;
    case "hard":
      return 5;
  }
}

export function getSizeForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 80;
    case "medium":
      return 50;
    case "hard":
      return 20;
  }
}

export function getContrastForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 0.8;
    case "medium":
      return 0.5;
    case "hard":
      return 0.2;
  }
}

