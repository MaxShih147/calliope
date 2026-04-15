"use client";

import { useEffect, useState } from "react";

type TopicItem = {
  title: string;
  source: string;
  category: string;
  link: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  news: "News",
  magazine: "Magazine",
  tech: "Tech",
  business: "Business",
};

export function DiscoverTopics({
  onSelect,
}: {
  onSelect: (title: string) => void;
}) {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleRefresh() {
    setLoading(true);
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  const categories = Array.from(new Set(topics.map((t) => t.category)));
  const filtered =
    filter === "all" ? topics : topics.filter((t) => t.category === filter);

  if (loading) {
    return (
      <div className="py-2">
        <p className="font-serif text-sm italic text-stone-300 animate-pulse">
          Discovering topics...
        </p>
      </div>
    );
  }

  if (topics.length === 0) return null;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-baseline gap-4 mb-4">
        <span className="section-label">Discover</span>
        <div className="flex gap-3">
          {["all", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-[0.6875rem] tracking-wide transition-colors ${
                filter === cat
                  ? "text-foreground font-medium"
                  : "text-stone-400 hover:text-stone-500"
              }`}
            >
              {cat === "all" ? "All" : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
        <button
          onClick={handleRefresh}
          className="text-[0.6875rem] text-stone-300 hover:text-stone-500 transition-colors ml-auto"
        >
          Refresh
        </button>
      </div>

      {/* Topic list — editorial style */}
      <div className="columns-2 gap-x-8">
        {filtered.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.title)}
            className="topic-pill block w-full mb-0.5 break-inside-avoid"
          >
            <span className="line-clamp-2">{item.title}</span>
            <span className="text-[0.625rem] not-italic tracking-wide text-stone-300 ml-1">
              {item.source}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
