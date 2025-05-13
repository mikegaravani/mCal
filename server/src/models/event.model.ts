import mongoose, { Document, Schema } from "mongoose";

import { RecurrenceSchema } from "./recurrence.model";
import { Recurrence } from "../types/recurrence";

import { ReminderSchema } from "./reminder.model";
import { Reminder } from "../types/reminder";

export interface IEvent extends Document {
  user: mongoose.Types.ObjectId;
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

    notify: {
      enabled: { type: Boolean, default: false },
      reminders: [ReminderSchema],
      sent: [
        {
          minutesBefore: { type: Number, required: true },
          sentAt: { type: Date, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
