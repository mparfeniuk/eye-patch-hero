"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useProgressStore } from "@/lib/useProgressStore";
import { useSettingsStore } from "@/lib/useSettingsStore";
import { getTranslation } from "@/lib/translations";

export default function Stats() {
  const router = useRouter();
  const language = useSettingsStore((state) => state.language);
  const progress = useProgressStore((state) => ({
    totalSessions: state.totalSessions,
    totalExercises: state.totalExercises,
    averageScore: state.averageScore,
    sessions: state.sessions,
  }));
  const clearProgress = useProgressStore((state) => state.clearProgress);
  const t = getTranslation(language);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === "uk" ? "uk-UA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const recentSessions = progress.sessions.slice(-10).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 pt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4 font-display">
            📊 {t.stats}
          </h1>
        </motion.div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push("/")}
            variant="secondary"
            size="medium"
            ariaLabel={t.back}
          >
            ← {t.back}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-5xl mb-2">🎮</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {progress.totalSessions}
              </div>
              <div className="text-xl text-gray-600">{t.totalSessions}</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-2">✅</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {progress.totalExercises}
              </div>
              <div className="text-xl text-gray-600">{t.totalExercises}</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-2">⭐</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {progress.averageScore.toFixed(1)}
              </div>
              <div className="text-xl text-gray-600">{t.averageScore}</div>
            </div>
          </Card>
        </div>

        {/* Session History */}
        <Card>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {t.sessionHistory}
          </h2>
          {recentSessions.length === 0 ? (
            <div className="text-center py-12 text-2xl text-gray-500">
              {t.noData}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="pb-4 text-xl font-bold text-gray-800">
                      {t.date}
                    </th>
                    <th className="pb-4 text-xl font-bold text-gray-800">
                      {t.duration}
                    </th>
                    <th className="pb-4 text-xl font-bold text-gray-800">
                      {t.score}
                    </th>
                    <th className="pb-4 text-xl font-bold text-gray-800">
                      {t.difficulty}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((session) => (
                    <motion.tr
                      key={session.id}
                      className="border-b border-gray-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="py-4 text-lg text-gray-700">
                        {formatDate(session.date)}
                      </td>
                      <td className="py-4 text-lg text-gray-700">
                        {formatDuration(session.duration)}
                      </td>
                      <td className="py-4 text-lg font-bold text-gray-800">
                        {session.score}
                      </td>
                      <td className="py-4 text-lg text-gray-700">
                        {t[session.difficulty as "easy" | "medium" | "hard"]}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Clear Progress Button */}
        {progress.totalSessions > 0 && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => {
                if (
                  confirm(
                    language === "uk"
                      ? "Ви впевнені, що хочете очистити всю статистику?"
                      : "Are you sure you want to clear all statistics?"
                  )
                ) {
                  clearProgress();
                }
              }}
              variant="danger"
              size="medium"
              ariaLabel="Clear progress"
            >
              🗑️{" "}
              {language === "uk" ? "Очистити статистику" : "Clear Statistics"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
