export interface ExpandedEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  description?: string;
  location?: string;
}
