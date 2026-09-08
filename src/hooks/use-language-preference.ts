"use client";
import { useSyncExternalStore } from "react";
export type LanguagePreference = "zh" | "en";
const KEY = "au-partimer-language";
let current: LanguagePreference = "zh";
const listeners = new Set<() => void>();
function read(): LanguagePreference {
  try {
    current = localStorage.getItem(KEY) === "en" ? "en" : "zh";
  } catch {}
  return current;
}
function subscribe(callback: () => void) {
  listeners.add(callback);
  const storage = (event: StorageEvent) => {
    if (event.key === KEY) {
      read();
      listeners.forEach((f) => f());
    }
  };
  window.addEventListener("storage", storage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", storage);
  };
}
export function useLanguagePreference() {
  const language = useSyncExternalStore(subscribe, read, () => "zh" as const);
  const setLanguage = (next: LanguagePreference) => {
    current = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    listeners.forEach((f) => f());
  };
  return [language, setLanguage] as const;
}
