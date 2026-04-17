export type Lesson = {
  id: string;
  createdAt: string;
  word: string;
  title: string;
  scenario: string;
  etymology: {
    origin: string;
    breakdown: string;
    history: string;
  };
  relatedWords: {
    word: string;
    meaning: string;
    relationship: string;
    example: string;
  }[];
  examples: {
    sentence: string;
    context: string;
  }[];
  passage: string;
  practiceTasks: string[];
  favorited?: boolean;
};

export type LessonInput = {
  word: string;
  scenario: string;
  tone: "neutral" | "professional" | "persuasive" | "reflective";
  difficulty: "beginner" | "intermediate" | "advanced";
  length: "short" | "medium" | "long";
  includeAdvancedExpressions: boolean;
};

export const SCENARIOS = [
  "Business Correspondence",
  "Small Talk",
  "Presentation",
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
