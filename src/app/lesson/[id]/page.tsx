"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lesson } from "@/lib/types";
import { getLesson, toggleFavorite, deleteLesson } from "@/lib/storage";
import { SpeakButton } from "@/components/speak-button";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = params.id as string;
    const found = getLesson(id);
    if (!found) {
      router.push("/");
      return;
    }
    setLesson(found);
  }, [params.id, router]);

  if (!mounted || !lesson) return null;

  function handleFavorite() {
    if (!lesson) return;
    const newState = toggleFavorite(lesson.id);
    setLesson({ ...lesson, favorited: newState });
  }

  function handleDelete() {
    if (!lesson) return;
    deleteLesson(lesson.id);
    router.push("/archive");
  }

  const date = new Date(lesson.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-[720px] px-6">
      {/* ── Article Header ── */}
      <header className="pt-14 pb-8 animate-fade-up">
        <p className="section-label mb-4">{lesson.scenario}</p>
        <h1 className="font-serif text-[2.75rem] md:text-[3.25rem] font-light leading-[1.08] tracking-tight mb-5">
          {lesson.title}
        </h1>
        <div className="flex items-center gap-6 text-[0.8125rem] text-stone-400">
          <time className="font-serif italic">{date}</time>
          <span className="text-stone-200">|</span>
          <button
            onClick={handleFavorite}
            className="hover:text-foreground transition-colors"
          >
            {lesson.favorited ? "Kept" : "Keep"}
          </button>
          <button
            onClick={handleDelete}
            className="hover:text-destructive transition-colors"
          >
            Remove
          </button>
        </div>
      </header>

      <div className="hairline-strong mb-10" />

      {/* ── Script ── */}
      <article className="mb-16 animate-fade-up" style={{ animationDelay: "0.05s" }}>
        <div className="flex items-start gap-3 mb-6">
          <p className="section-label">Script</p>
          <SpeakButton text={lesson.script} />
        </div>
        <div className="prose-editorial">
          {lesson.script.split("\n").map((paragraph, i) =>
            paragraph.trim() ? <p key={i}>{paragraph}</p> : null
          )}
        </div>
      </article>

      {/* ── Vocabulary ── */}
      {lesson.vocabulary.length > 0 && (
        <section className="mb-14 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="hairline mb-8" />
          <p className="section-label mb-8">Vocabulary</p>
          <div className="grid gap-6">
            {lesson.vocabulary.map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-2">
                  <span className="entry-word">{item.word}</span>
                  <SpeakButton text={item.word} />
                </div>
                <p className="entry-meaning">{item.meaning}</p>
                {item.example && (
                  <div className="flex items-start gap-2 mt-1">
                    <p className="entry-example flex-1">
                      &ldquo;{item.example}&rdquo;
                    </p>
                    <SpeakButton text={item.example} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Phrases ── */}
      {lesson.phrases.length > 0 && (
        <section className="mb-14 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="hairline mb-8" />
          <p className="section-label mb-8">Phrases</p>
          <div className="grid gap-6">
            {lesson.phrases.map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-2">
                  <span className="entry-word">{item.phrase}</span>
                  <SpeakButton text={item.phrase} />
                </div>
                <p className="entry-meaning">{item.meaning}</p>
                {item.example && (
                  <div className="flex items-start gap-2 mt-1">
                    <p className="entry-example flex-1">
                      &ldquo;{item.example}&rdquo;
                    </p>
                    <SpeakButton text={item.example} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Grammar ── */}
      {lesson.grammarPoints.length > 0 && (
        <section className="mb-14 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="hairline mb-8" />
          <p className="section-label mb-8">Grammar</p>
          <div className="grid gap-6">
            {lesson.grammarPoints.map((item, i) => (
              <div key={i}>
                <p className="entry-word">{item.pattern}</p>
                <p className="entry-meaning">{item.explanation}</p>
                {item.example && (
                  <div className="flex items-start gap-2 mt-1">
                    <p className="entry-example flex-1">
                      &ldquo;{item.example}&rdquo;
                    </p>
                    <SpeakButton text={item.example} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Patterns ── */}
      {lesson.embeddedPatterns.length > 0 && (
        <section className="mb-14 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <div className="hairline mb-8" />
          <p className="section-label mb-8">Patterns</p>
          <div className="space-y-3">
            {lesson.embeddedPatterns.map((pattern, i) => (
              <div key={i} className="flex items-start gap-2">
                <p className="pattern-line flex-1">{pattern}</p>
                <SpeakButton text={pattern} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Practice ── */}
      {lesson.practiceTasks.length > 0 && (
        <section className="mb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="hairline mb-8" />
          <p className="section-label mb-8">Practice</p>
          <ol className="space-y-4">
            {lesson.practiceTasks.map((task, i) => (
              <li key={i} className="flex gap-4 text-[0.9375rem] leading-relaxed">
                <span className="font-serif text-stone-300 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-stone-600">{task}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
