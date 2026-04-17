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
      {/* ── Header ── */}
      <header className="pt-14 pb-8 animate-fade-up">
        <p className="section-label mb-4">{lesson.scenario}</p>
        <h1 className="font-serif text-[2.75rem] md:text-[3.25rem] font-light leading-[1.08] tracking-tight mb-3">
          {lesson.title}
        </h1>
        <div className="flex items-center gap-3 mb-5">
          <span className="font-serif text-[1.75rem] text-accent font-normal tracking-tight">
            {lesson.word}
          </span>
          <SpeakButton text={lesson.word} />
        </div>
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

      {/* ── Etymology ── */}
      {lesson.etymology && (
        <article className="mb-16 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-3 mb-6">
            <p className="section-label">Etymology</p>
            <SpeakButton text={`${lesson.etymology.origin}. ${lesson.etymology.breakdown}. ${lesson.etymology.history}`} />
          </div>
          <div className="mb-6">
            <p className="entry-word mb-1">Origin</p>
            <p className="font-serif text-[0.9375rem] text-stone-600 leading-relaxed">
              {lesson.etymology.origin}
            </p>
          </div>
          <div className="mb-6">
            <p className="entry-word mb-1">Morphology</p>
            <p className="font-serif text-[0.9375rem] text-stone-600 leading-relaxed">
              {lesson.etymology.breakdown}
            </p>
          </div>
          <div>
            <p className="entry-word mb-2">History</p>
            <div className="prose-editorial">
              {lesson.etymology.history.split("\n").map((paragraph, i) =>
                paragraph.trim() ? <p key={i}>{paragraph}</p> : null
              )}
            </div>
          </div>
        </article>
      )}

      {/* ── Related Words ── */}
      {lesson.relatedWords.length > 0 && (
        <section className="mb-14 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="hairline mb-8" />
          <p className="section-label mb-8">Word Family</p>
          <div className="grid gap-6">
            {lesson.relatedWords.map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-2">
                  <span className="entry-word">{item.word}</span>
                  <SpeakButton text={`${item.word}. ${item.meaning}. ${item.relationship}. ${item.example || ""}`} />
                </div>
                <p className="entry-meaning">{item.meaning}</p>
                <p className="text-[0.8125rem] font-serif italic text-stone-400 mt-0.5">
                  {item.relationship}
                </p>
                {item.example && (
                  <p className="entry-example mt-1">
                    &ldquo;{item.example}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Examples ── */}
      {lesson.examples.length > 0 && (
        <section className="mb-14 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="hairline mb-8" />
          <div className="flex items-center gap-3 mb-8">
            <p className="section-label">Examples</p>
            <SpeakButton text={lesson.examples.map((item) => item.sentence).join(". ")} />
          </div>
          <div className="grid gap-6">
            {lesson.examples.map((item, i) => (
              <div key={i}>
                <p className="entry-example">
                  &ldquo;{item.sentence}&rdquo;
                </p>
                <p className="text-[0.8125rem] font-serif italic text-stone-400 mt-1">
                  {item.context}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Passage ── */}
      {lesson.passage && (
        <article className="mb-14 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="hairline mb-8" />
          <div className="flex items-start gap-3 mb-6">
            <p className="section-label">Passage</p>
            <SpeakButton text={lesson.passage} />
          </div>
          <div className="prose-editorial">
            {lesson.passage.split("\n").map((paragraph, i) =>
              paragraph.trim() ? <p key={i}>{paragraph}</p> : null
            )}
          </div>
        </article>
      )}

      {/* ── Practice ── */}
      {lesson.practiceTasks.length > 0 && (
        <section className="mb-16 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <div className="hairline mb-8" />
          <div className="flex items-center gap-3 mb-8">
            <p className="section-label">Practice</p>
            <SpeakButton text={lesson.practiceTasks.join(". ")} />
          </div>
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
