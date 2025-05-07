import { DayOfWeek } from "./dayOfWeek";

export interface Recurrence {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  frequencyInterval?: number; // every N 'frequency'

  // Weekly specific
  weekly?: {
    daysOfWeek?: number[]; // [1, 3] = monday & wednesday
  };

  // Monthly specific
  monthly?: {
    repeatBy: "day-of-month" | "day-position";
    dayOfMonth?: number;
    positionInMonth?: "first" | "second" | "third" | "fourth" | "last";
    dayOfWeek?: DayOfWeek;
  };

  // Yearly specific
  yearly?: {
    repeatBy: "specific-date" | "relative-date";
    month: number; // for specific-date and relative-date
    day?: number; // if specific-date
    positionInMonth?: "first" | "second" | "third" | "fourth" | "last"; // if relative-date
    dayOfWeek?: DayOfWeek; // if relative-date
  };

  // End conditions
  endless?: boolean;
  untilNumber?: number; // number of occurrences
  untilDate?: Date; // until specific date
}
