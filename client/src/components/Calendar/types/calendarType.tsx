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
}

export interface Task extends CalendarItem {
  type: "task";
  isCompleted: boolean;
  deadline?: Date | string;
}
