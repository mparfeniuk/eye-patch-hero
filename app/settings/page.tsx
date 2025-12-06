"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useSettingsStore, type Difficulty } from "@/lib/useSettingsStore";
import { getTranslation } from "@/lib/translations";

export default function Settings() {
  const router = useRouter();
  const language = useSettingsStore((state) => state.language);
  const difficulty = useSettingsStore((state) => state.difficulty);
  const sessionDuration = useSettingsStore((state) => state.sessionDuration);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const setDifficulty = useSettingsStore((state) => state.setDifficulty);
  const setSessionDuration = useSettingsStore(
    (state) => state.setSessionDuration
  );
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const t = getTranslation(language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 pt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4 font-display">
            ⚙️ {t.settings}
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

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Difficulty */}
          <Card>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t.difficulty}
            </h2>
            <div className="flex gap-4 flex-wrap">
              {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                <Button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  variant={difficulty === diff ? "primary" : "secondary"}
                  size="large"
                  className="flex-1 min-w-[150px]"
                  ariaLabel={`${t.difficulty}: ${t[diff]}`}
                >
                  {t[diff]}
                </Button>
              ))}
            </div>
          </Card>

          {/* Session Duration */}
          <Card>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t.sessionDuration}
            </h2>
            <div className="flex gap-4 flex-wrap">
              {([5, 10, 15] as const).map((duration) => (
                <Button
                  key={duration}
                  onClick={() => setSessionDuration(duration)}
                  variant={
                    sessionDuration === duration ? "primary" : "secondary"
                  }
                  size="large"
                  className="flex-1 min-w-[150px]"
                  ariaLabel={`${t.sessionDuration}: ${duration} ${t.minutes}`}
                >
                  {duration} {t.minutes}
                </Button>
              ))}
            </div>
          </Card>

          {/* Sound */}
          <Card>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.sound}</h2>
            <div className="flex gap-4">
              <Button
                onClick={() => setSoundEnabled(true)}
                variant={soundEnabled ? "success" : "secondary"}
                size="large"
                className="flex-1"
                ariaLabel={`${t.sound}: ${t.on}`}
              >
                🔊 {t.on}
              </Button>
              <Button
                onClick={() => setSoundEnabled(false)}
                variant={!soundEnabled ? "danger" : "secondary"}
                size="large"
                className="flex-1"
                ariaLabel={`${t.sound}: ${t.off}`}
              >
                🔇 {t.off}
              </Button>
            </div>
          </Card>

          {/* Language */}
          <Card>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t.language}
            </h2>
            <div className="flex gap-4">
              <Button
                onClick={() => setLanguage("uk")}
                variant={language === "uk" ? "primary" : "secondary"}
                size="large"
                className="flex-1"
                ariaLabel={`${t.language}: ${t.ukrainian}`}
              >
                🇺🇦 {t.ukrainian}
              </Button>
              <Button
                onClick={() => setLanguage("en")}
                variant={language === "en" ? "primary" : "secondary"}
                size="large"
                className="flex-1"
                ariaLabel={`${t.language}: ${t.english}`}
              >
                🇬🇧 {t.english}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
