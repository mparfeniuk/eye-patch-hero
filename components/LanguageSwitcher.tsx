"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/lib/useSettingsStore";
import type { Language } from "@/lib/translations";
import { getTranslation } from "@/lib/translations";

export default function LanguageSwitcher() {
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const t = getTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "uk", label: t.ukrainian, flag: "🇺🇦" },
    { code: "en", label: t.english, flag: "🇬🇧" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="font-bold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-4 text-xl min-h-[70px] min-w-[180px] flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`${t.language}: ${currentLanguage?.label}`}
        aria-expanded={isOpen}
      >
        <span>{currentLanguage?.flag}</span>
        <span>{currentLanguage?.code.toUpperCase()}</span>
        <span className="ml-1">{isOpen ? "▲" : "▼"}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-lg overflow-hidden z-50 min-w-[140px]"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-6 py-4 text-left text-lg font-semibold transition-colors flex items-center gap-3 ${
                  language === lang.code
                    ? "bg-secondary-100 text-secondary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span>{lang.label}</span>
                {language === lang.code && (
                  <span className="ml-auto">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
