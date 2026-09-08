"use client";
import { useSyncExternalStore } from "react";
import { vaultSchema, type WorkCase } from "@/lib/case-model";

const KEY = "au-partimer-cases-v1";
type Snapshot = { cases: WorkCase[]; persist: boolean; error: boolean };
const empty: Snapshot = { cases: [], persist: false, error: false };
let snapshot = empty;
let initialized = false;
const listeners = new Set<() => void>();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    snapshot = raw
      ? {
          cases: vaultSchema.parse(JSON.parse(raw)).cases,
          persist: true,
          error: false,
        }
      : empty;
  } catch {
    snapshot = { ...snapshot, error: true };
  }
}
function invalidateRoster(c: WorkCase): WorkCase {
  return { ...c, facts: { ...c.facts, fortnightHours: undefined } };
}
function emit() {
  listeners.forEach((listener) => listener());
}
function subscribe(callback: () => void) {
  listeners.add(callback);
  if (!initialized) {
    initialized = true;
    load();
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}
function save(next: Snapshot) {
  try {
    if (next.persist)
      localStorage.setItem(
        KEY,
        JSON.stringify(vaultSchema.parse({ version: 1, cases: next.cases })),
      );
    else localStorage.removeItem(KEY);
    snapshot = { ...next, error: false };
  } catch {
    snapshot = { ...next, error: true };
  }
  emit();
}
export function useCaseVault() {
  const state = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => empty,
  );
  return {
    ...state,
    setPersist: (persist: boolean) => save({ ...snapshot, persist }),
    put: (workCase: WorkCase) => {
      const next = {
        ...workCase,
        updatedAt: new Date().toISOString(),
        revision: workCase.revision + 1,
      };
      const existing = snapshot.cases.some((c) => c.id === next.id);
      const old = snapshot.cases.find((c) => c.id === next.id);
      if (JSON.stringify(old?.shifts ?? []) !== JSON.stringify(next.shifts)) {
        next.facts = { ...next.facts, fortnightHours: undefined };
        snapshot = {
          ...snapshot,
          cases: snapshot.cases.map((c) => ({
            ...c,
            facts: { ...c.facts, fortnightHours: undefined },
          })),
        };
      }
      if (!existing && snapshot.cases.length >= 20)
        throw new Error("CASE_LIMIT");
      save({
        ...snapshot,
        cases: existing
          ? snapshot.cases.map((c) => (c.id === next.id ? next : c))
          : [...snapshot.cases, next],
      });
    },
    remove: (id: string) =>
      save({
        ...snapshot,
        cases: snapshot.cases.filter((c) => c.id !== id).map(invalidateRoster),
      }),
    importCases: (value: unknown) => {
      const imported = vaultSchema.parse(value);
      const merged = new Map(snapshot.cases.map((c) => [c.id, c]));
      for (const c of imported.cases)
        if (!merged.has(c.id)) merged.set(c.id, c);
      if (merged.size > 20) throw new Error("CASE_LIMIT");
      save({ ...snapshot, cases: [...merged.values()].map(invalidateRoster) });
    },
  };
}
