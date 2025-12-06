"use client";

import { useSettingsStore } from "@/lib/useSettingsStore";
import { getTranslation } from "@/lib/translations";
import Button from "./Button";

export default function SoundToggle() {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const language = useSettingsStore((state) => state.language);
  const t = getTranslation(language);

  return (
    <Button
      onClick={() => setSoundEnabled(!soundEnabled)}
      variant={soundEnabled ? "success" : "secondary"}
      size="medium"
      className="min-w-[180px]"
      ariaLabel={`${t.sound}: ${soundEnabled ? t.on : t.off}`}
    >
      {soundEnabled ? "🔊" : "🔇"} {soundEnabled ? t.on : t.off}
    </Button>
  );
}

