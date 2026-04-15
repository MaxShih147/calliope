"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  LessonInput,
  SCENARIOS,
  TONES,
  DIFFICULTIES,
  LENGTHS,
  Lesson,
} from "@/lib/types";
import { generateLesson } from "@/lib/ai";
import { saveLesson, getSettings, getAllLessons } from "@/lib/storage";
import { RecentLessons } from "@/components/recent-lessons";
import { DiscoverTopics } from "@/components/discover-topics";

export default function ComposePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [length, setLength] = useState("medium");
  const [advancedExpressions, setAdvancedExpressions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    setMounted(true);
    const settings = getSettings();
    if (settings.defaultTone) setTone(settings.defaultTone);
    if (settings.defaultDifficulty) setDifficulty(settings.defaultDifficulty);
    if (settings.defaultLength) setLength(settings.defaultLength);
    setRecentLessons(getAllLessons().slice(0, 5));
  }, []);

  async function handleCompose() {
    if (!selectedScenario) {
      setError("Please select a scenario.");
      return;
    }

    const settings = getSettings();
    if (!settings.apiKey) {
      setError("Please add your API key in Settings first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const input: LessonInput = {
        scenario: selectedScenario,
        topic: topic || undefined,
        tone: tone as LessonInput["tone"],
        difficulty: difficulty as LessonInput["difficulty"],
        length: length as LessonInput["length"],
        includeAdvancedExpressions: advancedExpressions,
      };

      const lesson = await generateLesson(input, settings.apiKey);
      saveLesson(lesson);
      router.push(`/lesson/${lesson.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-[720px] px-6">
      {/* Page title */}
      <div className="pt-12 pb-10 animate-fade-up">
        <h1 className="font-serif text-[2.5rem] font-light tracking-tight leading-[1.1] mb-3">
          Compose
        </h1>
        <p className="font-serif text-[1.0625rem] italic text-stone-400 leading-relaxed">
          Shape a speaking lesson around a scenario that matters to you.
        </p>
      </div>

      <div className="hairline mb-10" />

      {/* Scenario */}
      <section className="mb-12 animate-fade-up" style={{ animationDelay: "0.05s" }}>
        <p className="section-label mb-5">Scenario</p>
        <div className="flex flex-wrap gap-2.5">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario}
              onClick={() => {
                setSelectedScenario(scenario);
                setError("");
              }}
              className={`chip ${selectedScenario === scenario ? "chip-active" : ""}`}
            >
              {scenario}
            </button>
          ))}
        </div>
      </section>

      {/* Topic input */}
      <section className="mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <p className="section-label mb-4">Topic</p>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="A subject to anchor the conversation..."
          className="w-full bg-transparent font-serif text-base text-foreground placeholder:text-stone-300 placeholder:italic border-b border-rule pb-3 focus:outline-none focus:border-foreground transition-colors"
        />
      </section>

      {/* Discover */}
      <section className="mb-12 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        <DiscoverTopics onSelect={(title) => setTopic(title)} />
      </section>

      <div className="hairline mb-10" />

      {/* Controls */}
      <section className="mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="grid grid-cols-3 gap-12">
          <div>
            <p className="section-label mb-4">Tone</p>
            <div className="space-y-1">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`opt ${tone === t.value ? "opt-active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="section-label mb-4">Difficulty</p>
            <div className="space-y-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`opt ${difficulty === d.value ? "opt-active" : ""}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="section-label mb-4">Length</p>
            <div className="space-y-1">
              {LENGTHS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLength(l.value)}
                  className={`opt ${length === l.value ? "opt-active" : ""}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced toggle */}
      <section className="mb-12 animate-fade-up" style={{ animationDelay: "0.25s" }}>
        <div className="flex items-center gap-3">
          <Switch
            id="advanced"
            checked={advancedExpressions}
            onCheckedChange={setAdvancedExpressions}
          />
          <label
            htmlFor="advanced"
            className="text-[0.8125rem] text-stone-400 cursor-pointer"
          >
            Include advanced expressions
          </label>
        </div>
      </section>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive mb-6 font-sans">{error}</p>
      )}

      {/* Compose button */}
      <div className="mb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <button
          onClick={handleCompose}
          disabled={loading}
          className="btn-compose"
        >
          {loading ? "Composing..." : "Compose"}
        </button>
      </div>

      {/* Recent */}
      {recentLessons.length > 0 && (
        <section className="pb-16 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="hairline mb-10" />
          <p className="section-label mb-6">Recent</p>
          <RecentLessons lessons={recentLessons} />
        </section>
      )}
    </div>
  );
}
