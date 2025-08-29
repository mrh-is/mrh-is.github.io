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
