"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings, Settings } from "@/lib/storage";
import { TONES, DIFFICULTIES, LENGTHS } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    defaultTone: "professional",
    defaultDifficulty: "intermediate",
    defaultLength: "medium",
  });
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSettings(getSettings());
  }, []);

  function handleSave() {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-[720px] px-6">
      <div className="pt-12 pb-10 animate-fade-up">
        <h1 className="font-serif text-[2.5rem] font-light tracking-tight leading-[1.1] mb-3">
          Settings
        </h1>
        <p className="font-serif text-[1.0625rem] italic text-stone-400 leading-relaxed">
          Configure your Calliope experience.
        </p>
      </div>

      <div className="hairline mb-10" />

      <div className="max-w-md space-y-12 pb-16">
        {/* Default Tone */}
        <section className="animate-fade-up">
          <p className="section-label mb-4">Default Tone</p>
          <div className="space-y-1">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() =>
                  setSettings({ ...settings, defaultTone: t.value })
                }
                className={`opt ${settings.defaultTone === t.value ? "opt-active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Default Difficulty */}
        <section className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <p className="section-label mb-4">Default Difficulty</p>
          <div className="space-y-1">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() =>
                  setSettings({ ...settings, defaultDifficulty: d.value })
                }
                className={`opt ${settings.defaultDifficulty === d.value ? "opt-active" : ""}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        {/* Default Length */}
        <section className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <p className="section-label mb-4">Default Length</p>
          <div className="space-y-1">
            {LENGTHS.map((l) => (
              <button
                key={l.value}
                onClick={() =>
                  setSettings({ ...settings, defaultLength: l.value })
                }
                className={`opt ${settings.defaultLength === l.value ? "opt-active" : ""}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <button onClick={handleSave} className="btn-compose">
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
