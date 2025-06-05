import { Recurrence } from "./recurrence";
import { Reminder } from "./reminders";

export interface CalendarItem {
  id: string;
  title: string;
  description?: string;
  type: any;
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

export interface StudyPlan extends CalendarItem {
  type: "study-plan";
  date: Date;
  focusTime: number;
  breakTime: number;
  cycles: number;
  dragToNextDay: boolean;
  isCompleted: boolean;
}
