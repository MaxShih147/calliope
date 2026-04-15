"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lesson } from "@/lib/types";
import { getAllLessons, toggleFavorite, deleteLesson } from "@/lib/storage";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArchivePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<"all" | "kept">("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLessons(getAllLessons());
  }, []);

  function handleToggleFavorite(id: string) {
    toggleFavorite(id);
    setLessons(getAllLessons());
  }

  function handleDelete(id: string) {
    deleteLesson(id);
    setLessons(getAllLessons());
  }

  if (!mounted) return null;

  const filtered =
    filter === "kept" ? lessons.filter((l) => l.favorited) : lessons;

  return (
    <div className="mx-auto max-w-[720px] px-6">
      <div className="pt-12 pb-10 animate-fade-up">
        <h1 className="font-serif text-[2.5rem] font-light tracking-tight leading-[1.1] mb-3">
          Archive
        </h1>
        <p className="font-serif text-[1.0625rem] italic text-stone-400 leading-relaxed">
          {lessons.length === 0
            ? "No lessons yet. Compose your first one."
            : `${lessons.length} lesson${lessons.length === 1 ? "" : "s"} composed.`}
        </p>
      </div>

      {/* Filter tabs */}
      {lessons.length > 0 && (
        <>
          <div className="hairline-strong" />
          <div className="flex gap-6 py-3 mb-2">
            <button
              onClick={() => setFilter("all")}
              className={`section-label transition-colors ${
                filter === "all" ? "!text-foreground" : "hover:!text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("kept")}
              className={`section-label transition-colors ${
                filter === "kept" ? "!text-foreground" : "hover:!text-foreground"
              }`}
            >
              Kept
            </button>
          </div>
          <div className="hairline" />
        </>
      )}

      {/* Lesson list */}
      <div>
        {filtered.map((lesson, i) => (
          <div
            key={lesson.id}
            className="border-b border-rule animate-fade-up"
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <div className="archive-row">
              <span className="font-serif text-[0.8125rem] text-stone-300 tabular-nums shrink-0 w-20">
                {formatDate(lesson.createdAt)}
              </span>

              <Link
                href={`/lesson/${lesson.id}`}
                className="flex-1 min-w-0 group"
              >
                <h3 className="font-serif text-[1rem] text-foreground group-hover:text-accent transition-colors line-clamp-1">
                  {lesson.title}
                </h3>
                <p className="text-[0.75rem] text-stone-400 mt-0.5 line-clamp-1">
                  {lesson.scenario}
                </p>
              </Link>

              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => handleToggleFavorite(lesson.id)}
                  className={`text-[0.6875rem] tracking-wide transition-colors ${
                    lesson.favorited
                      ? "text-accent"
                      : "text-stone-300 hover:text-foreground"
                  }`}
                >
                  {lesson.favorited ? "Kept" : "Keep"}
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="text-[0.6875rem] tracking-wide text-stone-300 hover:text-destructive transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && lessons.length > 0 && (
        <p className="font-serif italic text-stone-400 text-sm py-12">
          No kept lessons yet.
        </p>
      )}
    </div>
  );
}
