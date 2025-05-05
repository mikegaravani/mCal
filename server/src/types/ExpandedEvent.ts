export interface ExpandedEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  description?: string;
  location?: string;
}
