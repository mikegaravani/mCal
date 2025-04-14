import mongoose, { Document, Schema } from "mongoose";

interface Recurrence {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval?: number; // every N 'frequency'
  daysOfWeek?: number[]; // [1, 3] = monday & wednesday
  count?: number;
  until?: Date;
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
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
      },
      interval: Number,
      daysOfWeek: [Number],
      count: Number,
      until: Date,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
