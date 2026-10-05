/**
 * Builds a mailto: URL at runtime so the address never appears in the
 * prerendered HTML. That keeps it away from scrapers and stops Cloudflare's
 * email obfuscation from rewriting the markup, which breaks hydration.
 * Call only in the browser, after mount.
 */
export function mailtoHref(subject?: string): string {
  const address = ["me", "mrh.is"].join("@");
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${address}${query}`;
}
