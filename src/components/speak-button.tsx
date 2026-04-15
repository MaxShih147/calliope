"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// Preferred macOS English voices, ordered by quality
const PREFERRED_VOICES = [
  "Samantha",  // macOS default, natural female
  "Karen",     // Australian English, very clear
  "Daniel",    // British English, natural male
  "Moira",     // Irish English
  "Tessa",     // South African English
  "Rishi",     // Indian English
  "Fiona",     // Scottish English
];

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const enVoices = voices.filter((v) => v.lang.startsWith("en"));

  // Try preferred voices first
  for (const name of PREFERRED_VOICES) {
    const found = enVoices.find((v) => v.name.includes(name));
    if (found) return found;
  }

  // Fallback: prefer local (non-network) voices, then any English voice
  return (
    enVoices.find((v) => v.localService) ||
    enVoices[0] ||
    null
  );
}

export function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Voices may load async
    voiceRef.current = getBestVoice();

    const handleVoicesChanged = () => {
      voiceRef.current = getBestVoice();
    };

    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []);

  const handleSpeak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1;

    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
      utterance.lang = voiceRef.current.lang;
    }

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [text, speaking]);

  return (
    <button
      onClick={handleSpeak}
      className="btn-speak"
      title={speaking ? "Stop" : "Listen"}
      aria-label={speaking ? "Stop speaking" : "Listen to pronunciation"}
    >
      {speaking ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
