import { writable } from "svelte/store";

const STORAGE_KEY = "untrace-theme";

/**
 * The design system is dark by default and opts into light with
 * data-theme="light" on <html>. A saved choice always wins; otherwise the
 * operating system decides, falling back to dark.
 */
function preferredTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage can be blocked — fall through to the media query */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function apply(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function createTheme() {
  const { subscribe, set } = writable("dark");

  return {
    subscribe,
    init() {
      const theme = preferredTheme();
      apply(theme);
      set(theme);
    },
    toggle() {
      const next =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "dark"
          : "light";
      apply(next);
      set(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* a blocked store just means the choice is not remembered */
      }
    },
  };
}

export const theme = createTheme();

/** Duration helper so Svelte transitions honour prefers-reduced-motion. */
export function motionSafe(ms) {
  if (typeof window === "undefined") return ms;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
}
