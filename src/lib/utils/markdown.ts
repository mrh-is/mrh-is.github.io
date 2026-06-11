export interface LinkSegment {
  text: string;
  href: string;
}

export type RichTextSegment = string | LinkSegment;

/**
 * Parses a simple markdown string containing links like `[link text](url)`
 * into a list of segments.
 */
export function parseInlineMarkdown(text: string): RichTextSegment[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const segments: RichTextSegment[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(text.substring(lastIndex, match.index));
    }
    segments.push({
      text: match[1],
      href: match[2],
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push(text.substring(lastIndex));
  }

  return segments;
}
