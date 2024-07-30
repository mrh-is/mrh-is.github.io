export interface TimelineEntry {
  title: string;
  institution: {
    name: string;
    link?: string;
  };
  startDate?: Date;
  endDate: Date;
  description?: string[];
}
