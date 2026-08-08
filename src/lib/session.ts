import { useSyncExternalStore } from "react";

export type Session = { role: "admin" | "student"; id: string; name: string } | null;

const KEY = "learnmetrics.session";
const listeners = new Set<() => void>();
let cached: Session = null;
let cachedRaw: string | null = null;

function emit() {
  listeners.forEach((l) => l());
}

function read(): Session {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = raw ? (JSON.parse(raw) as Session) : null;
  }
  return cached;
}

export function signIn(session: NonNullable<Session>) {
  window.localStorage.setItem(KEY, JSON.stringify(session));
  emit();
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  emit();
}

export function useSession(): Session {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => null,
  );
}

const THEME_KEY = "learnmetrics.theme";

export function initTheme() {
  if (typeof window === "undefined") return;
  const stored = window.localStorage.getItem(THEME_KEY);
  document.documentElement.classList.toggle("dark", stored === "dark");
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  window.localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}
