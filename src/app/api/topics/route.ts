import { NextResponse } from "next/server";

type FeedSource = {
  name: string;
  category: "news" | "magazine" | "tech" | "business";
  url: string;
};

const FEEDS: FeedSource[] = [
  { name: "NYT World", category: "news", url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml" },
  { name: "NYT Business", category: "business", url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml" },
  { name: "BBC News", category: "news", url: "https://feeds.bbci.co.uk/news/rss.xml" },
  { name: "The Economist", category: "magazine", url: "https://www.economist.com/international/rss.xml" },
  { name: "Wired", category: "tech", url: "https://www.wired.com/feed/rss" },
  { name: "Harvard Business Review", category: "business", url: "https://hbr.org/feed" },
  { name: "Ars Technica", category: "tech", url: "https://feeds.arstechnica.com/arstechnica/index" },
  { name: "The Atlantic", category: "magazine", url: "https://www.theatlantic.com/feed/all/" },
];

type TopicItem = {
  title: string;
  source: string;
  category: string;
  link: string;
};

function extractItems(xml: string, sourceName: string, category: string): TopicItem[] {
  const items: TopicItem[] = [];
  const itemRegex = /<item[\s>][\s\S]*?<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 3) {
    const block = match[0];
    const titleMatch = block.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/);
    const linkMatch = block.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/);

    if (titleMatch) {
      let title = titleMatch[1]
        .replace(/<!\[CDATA\[|\]\]>/g, "")
        .replace(/<[^>]+>/g, "")
        .trim();

      if (title && title.length > 10) {
        items.push({
          title,
          source: sourceName,
          category,
          link: linkMatch ? linkMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "",
        });
      }
    }
  }

  return items;
}

export async function GET() {
  const results: TopicItem[] = [];

  const fetches = FEEDS.map(async (feed) => {
    try {
      const res = await fetch(feed.url, {
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return [];
      const xml = await res.text();
      return extractItems(xml, feed.name, feed.category);
    } catch {
      return [];
    }
  });

  const allResults = await Promise.allSettled(fetches);

  for (const result of allResults) {
    if (result.status === "fulfilled") {
      results.push(...result.value);
    }
  }

  // Shuffle and limit
  const shuffled = results.sort(() => Math.random() - 0.5).slice(0, 15);

  return NextResponse.json(shuffled);
}
