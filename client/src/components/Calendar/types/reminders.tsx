export type DayOption =
  | "event-day"
  | "day-before"
  | "two-days-before"
  | "week-before";

export interface RepeatUI {
  enabled: boolean;
  everyValue?: number;
  everyUnit?: "minutes" | "hours";
  stopMode?: "count" | "until-event";
  countValue?: number;
}

export interface RemindOptions {
  mode: "before" | "custom";
  beforeValue?: number;
  beforeUnit?: "minutes" | "hours" | "days";
  dayOption?: DayOption;
  hour12?: number;
  minute?: number;
  ampm?: "am" | "pm";
  repeat: RepeatUI;
}

export interface Reminder {
  minutesBefore: number;
  repeat?: boolean;
  repeatInterval?: number;
  repeatCount?: number;
}
