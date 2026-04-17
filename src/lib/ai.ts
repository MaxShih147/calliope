import { Lesson, LessonInput } from "./types";

function buildPrompt(input: LessonInput): string {
  const lengthMap = { short: "~500", medium: "~750", long: "~1000" };

  return `You are a vocabulary coach who specializes in etymology and word history. Your goal is to help learners deeply understand English words through their origins, evolution, and practical usage.

Explore the following word in depth:
- Word: ${input.word}
- Passage scenario: ${input.scenario}
- Tone: ${input.tone}
- Difficulty: ${input.difficulty}
- Target length for the passage: ${lengthMap[input.length]} words
${input.includeAdvancedExpressions ? "- Include advanced expressions and idiomatic language in the passage" : ""}

Return ONLY valid JSON matching this exact structure (no markdown, no code fences):
{
  "word": "${input.word}",
  "title": "string - a compelling, editorial-style title about this word's story",
  "scenario": "${input.scenario}",
  "etymology": {
    "origin": "string - the language of origin and original form (e.g. 'Latin: eloquentia, from eloquens meaning speaking out')",
    "breakdown": "string - morphological breakdown showing prefix, root, suffix and their meanings",
    "history": "string - 2-3 paragraphs tracing how the word evolved through history, including interesting cultural context, shifts in meaning, and notable historical usage"
  },
  "relatedWords": [
    {
      "word": "string - a word that shares the same root or is etymologically connected",
      "meaning": "string - brief definition",
      "relationship": "string - how it connects to the target word (e.g. 'shares Latin root loqui (to speak)', 'prefix variant')",
      "example": "string - a natural example sentence using this related word"
    }
  ],
  "examples": [
    {
      "sentence": "string - a natural example sentence using the word",
      "context": "string - brief note on register or situation (e.g. 'formal writing', 'academic discussion')"
    }
  ],
  "passage": "string - a passage written in the ${input.scenario} scenario that naturally incorporates the target word and several related words. The passage should feel authentic and useful for professional English practice.",
  "practiceTasks": ["string - practice prompts that help the learner internalize the word and its family"]
}

Include 6-10 related words, 4-6 example sentences, and 3-4 practice tasks. The etymology history should be engaging and narrative — treat it like a short essay, not a dictionary entry.`;
}

export async function generateLesson(
  input: LessonInput
): Promise<Lesson> {
  const prompt = buildPrompt(input);

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to generate lesson");
  }

  const data = await response.json();

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    word: data.word,
    title: data.title,
    scenario: data.scenario,
    etymology: data.etymology || { origin: "", breakdown: "", history: "" },
    relatedWords: data.relatedWords || [],
    examples: data.examples || [],
    passage: data.passage || "",
    practiceTasks: data.practiceTasks || [],
  };
}
