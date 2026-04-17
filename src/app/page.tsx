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
import { GRE_WORDS } from "@/lib/gre-words";

function pickRandomWords(count: number): string[] {
  const shuffled = [...GRE_WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function ComposePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [word, setWord] = useState("");
  const [selectedScenario, setSelectedScenario] = useState("Business Correspondence");
  const [tone, setTone] = useState("professional");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [length, setLength] = useState("medium");
  const [advancedExpressions, setAdvancedExpressions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    const settings = getSettings();
    if (settings.defaultTone) setTone(settings.defaultTone);
    if (settings.defaultDifficulty) setDifficulty(settings.defaultDifficulty);
    if (settings.defaultLength) setLength(settings.defaultLength);
    setRecentLessons(getAllLessons().slice(0, 5));
    setSuggestions(pickRandomWords(12));
  }, []);

  async function handleCompose() {
    if (!word.trim()) {
      setError("Please enter a word to explore.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const input: LessonInput = {
        word: word.trim(),
        scenario: selectedScenario,
        tone: tone as LessonInput["tone"],
        difficulty: difficulty as LessonInput["difficulty"],
        length: length as LessonInput["length"],
        includeAdvancedExpressions: advancedExpressions,
      };

      const lesson = await generateLesson(input);
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
          Explore
        </h1>
        <p className="font-serif text-[1.0625rem] italic text-stone-400 leading-relaxed">
          Trace a word back to its roots — etymology, history, and living usage.
        </p>
      </div>

      <div className="hairline mb-10" />

      {/* Word input */}
      <section className="mb-12 animate-fade-up" style={{ animationDelay: "0.05s" }}>
        <p className="section-label mb-4">Word</p>
        <input
          value={word}
          onChange={(e) => {
            setWord(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) handleCompose();
          }}
          placeholder="Enter a GRE word to explore..."
          className="w-full bg-transparent font-serif text-[1.5rem] text-foreground placeholder:text-stone-300 placeholder:italic border-b-2 border-rule pb-3 focus:outline-none focus:border-foreground transition-colors"
          autoFocus
        />
      </section>

      {/* Word suggestions from GRE bank */}
      <section className="mb-12 animate-fade-up" style={{ animationDelay: "0.08s" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="section-label">Or pick one</p>
          <button
            onClick={() => setSuggestions(pickRandomWords(12))}
            className="text-[0.75rem] tracking-wide text-stone-300 hover:text-foreground transition-colors"
          >
            Refresh
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((w) => (
            <button
              key={w}
              onClick={() => {
                setWord(w);
                setError("");
              }}
              className={`chip ${word === w ? "chip-active" : ""}`}
            >
              {w}
            </button>
          ))}
        </div>
      </section>

      {/* Passage scenario */}
      <section className="mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <p className="section-label mb-5">Passage Scenario</p>
        <div className="flex flex-wrap gap-2.5">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario}
              onClick={() => setSelectedScenario(scenario)}
              className={`chip ${selectedScenario === scenario ? "chip-active" : ""}`}
            >
              {scenario}
            </button>
          ))}
        </div>
      </section>

      <div className="hairline mb-10" />

      {/* Controls */}
      <section className="mb-10 animate-fade-up" style={{ animationDelay: "0.15s" }}>
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
      <section className="mb-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
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
      <div className="mb-16 animate-fade-up" style={{ animationDelay: "0.25s" }}>
        <button
          onClick={handleCompose}
          disabled={loading}
          className="btn-compose"
        >
          {loading ? "Exploring..." : "Explore"}
        </button>
      </div>

      {/* Recent */}
      {recentLessons.length > 0 && (
        <section className="pb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="hairline mb-10" />
          <p className="section-label mb-6">Recent</p>
          <RecentLessons lessons={recentLessons} />
        </section>
      )}
    </div>
  );
}
