"use client";

import { Lesson } from "./types";

const STORAGE_KEY = "calliope_lessons";
const SETTINGS_KEY = "calliope_settings";

export type Settings = {
  apiKey: string;
  defaultTone: string;
  defaultDifficulty: string;
  defaultLength: string;
};

const defaultSettings: Settings = {
  apiKey: "",
  defaultTone: "professional",
  defaultDifficulty: "intermediate",
  defaultLength: "medium",
};

// Lessons

function getLessonsRaw(): Lesson[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveLessonsRaw(lessons: Lesson[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
}

export function getAllLessons(): Lesson[] {
  return getLessonsRaw().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getLesson(id: string): Lesson | undefined {
  return getLessonsRaw().find((l) => l.id === id);
}

export function saveLesson(lesson: Lesson) {
  const lessons = getLessonsRaw();
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  if (idx >= 0) {
    lessons[idx] = lesson;
  } else {
    lessons.push(lesson);
  }
  saveLessonsRaw(lessons);
}

export function deleteLesson(id: string) {
  const lessons = getLessonsRaw().filter((l) => l.id !== id);
  saveLessonsRaw(lessons);
}

export function toggleFavorite(id: string): boolean {
  const lessons = getLessonsRaw();
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return false;
  lesson.favorited = !lesson.favorited;
  saveLessonsRaw(lessons);
  return lesson.favorited;
}

// Settings

export function getSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
