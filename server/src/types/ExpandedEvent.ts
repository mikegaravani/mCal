import { Recurrence } from "./recurrence";
import { Reminder } from "./reminder";

export interface ExpandedEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  description?: string;
  location?: string;

  recurrence?: Recurrence;
  notify?: {
    enabled: boolean;
    reminders: Reminder[];
    sent?: { minutesBefore: number; sentAt: Date }[];
  };
}
