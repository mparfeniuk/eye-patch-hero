import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameSession {
  id: string;
  gameId: string;
  date: string;
  duration: number; // in seconds
  score: number;
  hits: number;
  misses: number;
  difficulty: string;
}

export interface Progress {
  totalSessions: number;
  totalExercises: number;
  sessions: GameSession[];
  averageScore: number;
}

const defaultProgress: Progress = {
  totalSessions: 0,
  totalExercises: 0,
  sessions: [],
  averageScore: 0,
};

interface ProgressStore extends Progress {
  addSession: (session: Omit<GameSession, "id">) => void;
  clearProgress: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      ...defaultProgress,
      addSession: (session) => {
        const newSession: GameSession = {
          ...session,
          id: Date.now().toString(),
        };
        set((state) => {
          const newSessions = [...state.sessions, newSession].slice(-50);
          const totalSessions = newSessions.length;
          const totalExercises = state.totalExercises + 1;
          const averageScore =
            newSessions.reduce((sum, s) => sum + s.score, 0) / totalSessions;

          return {
            totalSessions,
            totalExercises,
            sessions: newSessions,
            averageScore: Math.round(averageScore * 10) / 10,
          };
        });
      },
      clearProgress: () => set(defaultProgress),
    }),
    {
      name: "eye-patch-hero-progress",
      version: 1,
    }
  )
);

// Helper functions are now methods on the store

