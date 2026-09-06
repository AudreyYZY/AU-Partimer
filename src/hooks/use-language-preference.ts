"use client";

import { useCallback, useEffect, useState } from "react";

export type LanguagePreference = "zh" | "en";

const STORAGE_KEY = "au-partimer-language";
const CHANGE_EVENT = "au-partimer-language-change";
let currentLanguage: LanguagePreference = "zh";

function readLanguagePreference(): LanguagePreference {
  if (typeof window === "undefined") return "zh";

  try {
    const storedValue = window.localStorage?.getItem(STORAGE_KEY);

    currentLanguage = storedValue === "en" ? "en" : currentLanguage;
  } catch {
    return currentLanguage;
  }

  return currentLanguage;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useLanguagePreference() {
  const [language, setLanguageState] = useState<LanguagePreference>("zh");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLanguageState(readLanguagePreference());
    }, 0);
    const unsubscribe = subscribe(() => {
        setLanguageState(readLanguagePreference());
    });

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const setLanguage = useCallback((nextLanguage: LanguagePreference) => {
    currentLanguage = nextLanguage;

    try {
      window.localStorage?.setItem(STORAGE_KEY, nextLanguage);
    } catch {
      // Some embedded browsers disable storage; language switching should still work.
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));
    setLanguageState(nextLanguage);
  }, []);

  return [language, setLanguage] as const;
}
