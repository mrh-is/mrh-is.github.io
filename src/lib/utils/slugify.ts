export function slugify(text: string | undefined): string | undefined {
  if (!text) {
    return undefined;
  }
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
