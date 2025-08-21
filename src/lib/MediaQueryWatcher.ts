export function watchMediaQuery(
  query: string,
  callback: (matches: boolean) => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {
      // No-op for server-side rendering
    };
  }
  const mediaQuery = window.matchMedia(query);
  callback(mediaQuery.matches);
  const realCallback = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener("change", realCallback);
  return () => mediaQuery.removeEventListener("change", realCallback);
}

export function checkMediaQuery(query: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia(query).matches;
}

export const KnownQueries = {
  DarkMode: "(prefers-color-scheme: dark)",
  ReducedMotion: "(prefers-reduced-motion: reduce)",
};
