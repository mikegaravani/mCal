import mongoose, { Document, Schema } from "mongoose";
import { DayOfWeek } from "../types/dayOfWeek";
import { RecurrenceSchema } from "./recurrence.model";

interface Recurrence {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  frequencyInterval?: number; // every N 'frequency'

  // Weekly specific
  weekly?: {
    daysOfWeek: number[]; // [1, 3] = monday & wednesday
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

export interface IEvent extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  description?: string;
  location?: string;
  recurrence?: Recurrence;

  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema<IEvent>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },

    recurrence: {
      type: RecurrenceSchema,
      default: undefined,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
