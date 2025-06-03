import { Recurrence } from "./recurrence";
import { Reminder } from "./reminders";

export interface CalendarItem {
  id: string;
  title: string;
  description?: string;
  type: "event" | "task" | "birthday";
}

export interface Event extends CalendarItem {
  type: "event";
  startTime: Date | string;
  endTime: Date | string;
  isAllDay?: boolean;
  location?: string;

  seriesId: string;

  recurrence?: Recurrence;

  notify?: {
    enabled: boolean;
    reminders: Reminder[];
    sent?: { minutesBefore: number; sentAt: Date; occurrenceStartTime: Date }[];
  };
}

export interface Task extends CalendarItem {
  type: "task";
  isCompleted: boolean;
  deadline?: Date | string;
  overdueReminders: boolean;
}
