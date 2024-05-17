export interface TimelineEntry {
  title: String;
  institution: {
    name: string;
    link?: string;
  };
  startDate?: Date;
  endDate: Date;
  description?: string[];
}
