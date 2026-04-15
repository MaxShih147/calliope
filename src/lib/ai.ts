import { Lesson, LessonInput } from "./types";

function buildPrompt(input: LessonInput): string {
  const lengthMap = { short: "~500", medium: "~750", long: "~1000" };

  return `You are a speaking coach designing a structured English speaking lesson.

Create a lesson for the following scenario:
- Scenario: ${input.scenario}
${input.topic ? `- Topic: ${input.topic}` : ""}
- Tone: ${input.tone}
- Difficulty: ${input.difficulty}
- Target length: ${lengthMap[input.length]} words for the script
${input.includeAdvancedExpressions ? "- Include advanced expressions and idiomatic language" : ""}

The lesson must sound natural when spoken aloud. It should simulate a real conversation, not a textbook exercise. Embed reusable speaking patterns intentionally throughout the script.

Return ONLY valid JSON matching this exact structure (no markdown, no code fences):
{
  "title": "string - a compelling, editorial-style title",
  "scenario": "string - brief scenario description",
  "script": "string - the full speaking script with natural dialogue or monologue",
  "vocabulary": [{"word": "string", "meaning": "string", "example": "string"}],
  "phrases": [{"phrase": "string", "meaning": "string", "example": "string"}],
  "grammarPoints": [{"pattern": "string", "explanation": "string", "example": "string"}],
  "embeddedPatterns": ["string - reusable sentence patterns found in the script"],
  "practiceTasks": ["string - practice prompts for the learner"]
}

Include 5-8 vocabulary items, 4-6 phrases, 3-4 grammar points, 3-5 embedded patterns, and 3-4 practice tasks.`;
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
    title: data.title,
    scenario: data.scenario,
    script: data.script,
    vocabulary: data.vocabulary || [],
    phrases: data.phrases || [],
    grammarPoints: data.grammarPoints || [],
    embeddedPatterns: data.embeddedPatterns || [],
    practiceTasks: data.practiceTasks || [],
  };
}
