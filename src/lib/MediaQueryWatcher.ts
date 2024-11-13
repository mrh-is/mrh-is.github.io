export function watchMediaQuery(
  query: string,
  callback: (matches: boolean) => void,
): () => void {
  const mediaQuery = window.matchMedia(query);
  callback(mediaQuery.matches);
  const realCallback = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener("change", realCallback);
  return () => mediaQuery.removeEventListener("change", realCallback);
}

export const KnownQueries = {
  DarkMode: "(prefers-color-scheme: dark)",
};
