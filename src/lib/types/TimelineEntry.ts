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
  description?: string[];
}
