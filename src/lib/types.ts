export type Lesson = {
  id: string;
  createdAt: string;
  title: string;
  scenario: string;
  script: string;
  vocabulary: { word: string; meaning: string; example?: string }[];
  phrases: { phrase: string; meaning: string; example?: string }[];
  grammarPoints: { pattern: string; explanation: string; example?: string }[];
  embeddedPatterns: string[];
  practiceTasks: string[];
  favorited?: boolean;
};

export type LessonInput = {
  scenario: string;
  topic?: string;
  tone: "neutral" | "professional" | "persuasive" | "reflective";
  difficulty: "beginner" | "intermediate" | "advanced";
  length: "short" | "medium" | "long";
  includeAdvancedExpressions: boolean;
};

export const SCENARIOS = [
  "Work Discussion",
  "Proposal",
  "Disagreement",
  "Small Talk",
  "Presentation",
  "Negotiation",
  "Interview",
  "Feedback",
  "Brainstorm",
  "Explanation",
] as const;

export const TONES = [
  { value: "neutral", label: "Neutral" },
  { value: "professional", label: "Professional" },
  { value: "persuasive", label: "Persuasive" },
  { value: "reflective", label: "Reflective" },
] as const;

export const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const LENGTHS = [
  { value: "short", label: "Short (~500 words)" },
  { value: "medium", label: "Medium (~750 words)" },
  { value: "long", label: "Long (~1000 words)" },
] as const;
