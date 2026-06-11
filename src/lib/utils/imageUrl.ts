import type { Picture } from "vite-imagetools";

export type ImageSource = string | Picture;

/**
 * Extract the actual URL from either a string or enhanced Picture object
 */
export function getImageUrl(src: ImageSource): string {
  if (typeof src === "string") {
    return src;
  } else {
    return src.img.src;
  }
}

/**
 * Pick the largest generated variant (preferring WebP) — for lightbox display.
 * Falls back to the base image for plain-string sources or missing srcsets.
 */
export function getLargestImageUrl(src: ImageSource): string {
  if (typeof src === "string") {
    return src;
  }
  const srcset = src.sources["webp"] ?? Object.values(src.sources)[0];
  if (!srcset) {
    return src.img.src;
  }
  let bestUrl = src.img.src;
  let bestWidth = 0;
  for (const entry of srcset.split(",")) {
    const [url, descriptor] = entry.trim().split(" ");
    const width = parseInt(descriptor ?? "", 10);
    if (url && width > bestWidth) {
      bestWidth = width;
      bestUrl = url;
    }
  }
  return bestUrl;
}
