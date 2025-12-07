"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SoundToggle from "@/components/SoundToggle";
import { useSettingsStore } from "@/lib/useSettingsStore";
import { getTranslation } from "@/lib/translations";

export default function Home() {
  const router = useRouter();
  const language = useSettingsStore((state) => state.language);
  const t = getTranslation(language);

  const games = [
    {
      id: "game1",
      title: t.game1Title,
      description: t.game1Description,
      emoji: "🎯",
      path: "/game1",
    },
    {
      id: "game2",
      title: t.game2Title,
      description: t.game2Description,
      emoji: "🔍",
      path: "/game2",
    },
    {
      id: "game3",
      title: t.game3Title,
      description: t.game3Description,
      emoji: "👁️",
      path: "/game3",
    },
    {
      id: "game4",
      title: t.game4Title,
      description: t.game4Description,
      emoji: "🎨",
      path: "/game4",
    },
    {
      id: "game5",
      title: t.game5Title,
      description: t.game5Description,
      emoji: "📏",
      path: "/game5",
    },
    {
      id: "game6",
      title: t.game6Title,
      description: t.game6Description,
      emoji: "🌀",
      path: "/game6",
    },
  ];

  const [bannerLang, setBannerLang] = useState<"ua" | "en">("ua");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const bannerCopy = {
    ua: {
      heading: "Дисклеймер",
      intro: [
        "Марафон з вайбкодінгу: 10 проєктів, по одному на день, максимум 5 годин.",
        "Легка навчальна штука, щоб перезавантажитися після великих задач.",
        "Це швидкі прототипи, зроблені в темпі 3–4 годин, тож можливі невеличкі лаги.",
      ],
      goalsLabel: "МЕТА",
      bullets: [
        "Пофанити й покреативити, пробрейнстормити ідеї.",
        "Відпрацювати вайбкодинг і швидкий перехід від ідеї до MVP.",
        "Подивитися, як AI-підхід впливає на темп і якість.",
        "Зрозуміти сильні/слабкі сторони підходу. Потенційні продуктові вигоди.",
        "Напрацьовувати нове мислення в реалізації проектів.",
        "Вчитись робити швидко і без залипань.",
      ],
      collapse: { expanded: "Згорнути", collapsed: "Розгорнути" },
    },
    en: {
      heading: "Marathon disclaimer",
      intro: [
        "Vibe-coding marathon: 10 projects, one per day, max 5 hours.",
        "A light learning build to reset after bigger work.",
        "These are quick prototypes built in a 3–4 hour sprint, so minor lags are possible.",
      ],
      goalsLabel: "GOALS",
      bullets: [
        "Have fun, get creative, brainstorm ideas.",
        "Practice vibe-coding and jumping from idea to live MVP fast.",
        "See how the AI-assisted approach affects speed and quality.",
        "Understand approach strengths/weak spots. Potential product wins.",
        "Build a new mindset for shipping projects.",
        "Learn to ship fast and avoid getting stuck.",
      ],
      collapse: { expanded: "Collapse", collapsed: "Expand" },
    },
  } as const;

  const current = bannerCopy[bannerLang];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-[center_top_20%] bg-no-repeat"
        style={{ backgroundImage: "url('/images/bg.jpg')" }}
      />
      {/* Overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-100/90 via-purple-100/85 to-pink-100/90" />
      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Marathon Disclaimer Banner */}
          <div
            className="mb-6 border rounded-xl shadow-sm text-black"
            style={{
              background: "#fff3b0",
              borderColor: "#e5b700",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <div className="flex flex-col gap-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-lg sm:text-xl font-bold">
                  {current.heading}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg overflow-hidden border border-yellow-600">
                    <button
                      onClick={() => setBannerLang("ua")}
                      className={`px-2 py-1 text-sm font-semibold ${
                        bannerLang === "ua" ? "bg-yellow-200" : "bg-transparent"
                      }`}
                      aria-label="Switch to Ukrainian"
                    >
                      UA
                    </button>
                    <button
                      onClick={() => setBannerLang("en")}
                      className={`px-2 py-1 text-sm font-semibold ${
                        bannerLang === "en" ? "bg-yellow-200" : "bg-transparent"
                      }`}
                      aria-label="Switch to English"
                    >
                      EN
                    </button>
                  </div>
                  <button
                    onClick={() => setIsCollapsed((v) => !v)}
                    className="flex items-center gap-1 text-sm font-semibold underline underline-offset-4"
                  >
                    <span>{isCollapsed ? "▸" : "▾"}</span>
                    <span>
                      {isCollapsed
                        ? current.collapse.collapsed
                        : current.collapse.expanded}
                    </span>
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="flex flex-col gap-3">
                  <div className="space-y-1 text-sm sm:text-base leading-relaxed">
                    {current.intro.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-bold tracking-wide uppercase text-yellow-900">
                      {current.goalsLabel}
                    </div>
                    <ul className="space-y-2 text-sm sm:text-base">
                      {current.bullets.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 leading-snug"
                        >
                          <span className="mt-[2px]">✔️</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Header */}
          <motion.div
            className="text-center mb-12 pt-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-7xl font-semibold mb-4 font-display">
              <span>👁️</span>{" "}
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Eye Patch Hero
              </span>
            </h1>
          </motion.div>

          {/* Settings Bar */}
          <motion.div
            className="flex justify-center gap-4 mb-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <LanguageSwitcher />
            <SoundToggle />
            <Button
              onClick={() => router.push("/settings")}
              variant="secondary"
              size="medium"
              className="min-w-[180px]"
              ariaLabel={t.settings}
            >
              ⚙️ {t.settings}
            </Button>
            <Button
              onClick={() => router.push("/stats")}
              variant="secondary"
              size="medium"
              className="min-w-[180px]"
              ariaLabel={t.stats}
            >
              📊 {t.stats}
            </Button>
          </motion.div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card
                  onClick={() => router.push(game.path)}
                  className="text-center h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="text-7xl mb-4">{game.emoji}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                      {game.title}
                    </h2>
                    <p className="text-xl text-gray-600 mb-6">
                      {game.description}
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(game.path);
                    }}
                    variant="primary"
                    size="large"
                    className="w-full"
                    ariaLabel={`${t.play} ${game.title}`}
                  >
                    {t.play}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
