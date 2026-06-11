/** A piece of a description paragraph: plain text, or a link. */
export type RichTextSegment = string | { text: string; href: string };

export interface TimelineEntry {
  title: string;
  institution: {
    name: string;
    link?: string;
  };
  dates:
    | { type: "current"; start: Date }
    | { type: "past"; start: Date; end: Date }
    | { type: "graduation"; date: Date };
  /** Paragraphs, each a sequence of segments. */
  description?: RichTextSegment[][];
}
