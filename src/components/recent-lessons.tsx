"use client";

import Link from "next/link";
import { Lesson } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function RecentLessons({ lessons }: { lessons: Lesson[] }) {
  return (
    <div>
      {lessons.map((lesson, i) => (
        <Link
          key={lesson.id}
          href={`/lesson/${lesson.id}`}
          className="archive-row group border-b border-rule last:border-0"
        >
          <span className="font-serif text-[0.8125rem] text-stone-300 tabular-nums shrink-0 w-12">
            {formatDate(lesson.createdAt)}
          </span>
          <span className="font-serif text-[1rem] text-foreground group-hover:text-accent transition-colors line-clamp-1 flex-1">
            {lesson.word}
          </span>
          <span className="section-label shrink-0">
            {lesson.scenario}
          </span>
        </Link>
      ))}
    </div>
  );
}
