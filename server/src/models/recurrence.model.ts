import { Schema } from "mongoose";

export const RecurrenceSchema = new Schema(
  {
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    frequencyInterval: Number,

    weekly: {
      type: new Schema(
        {
          daysOfWeek: [Number],
        },
        { _id: false }
      ),
    },

    monthly: {
      type: new Schema(
        {
          repeatBy: {
            type: String,
            enum: ["day-of-month", "day-position"],
          },
          dayOfMonth: Number,
          positionInMonth: {
            type: String,
            enum: ["first", "second", "third", "fourth", "last"],
          },
          dayOfWeek: {
            type: String,
            enum: [
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "day",
              "weekday",
              "weekend",
            ],
          },
        },
        { _id: false }
      ),
    },

    yearly: {
      type: new Schema(
        {
          repeatBy: {
            type: String,
            enum: ["specific-date", "relative-date"],
          },
          month: Number,
          day: Number,
          positionInMonth: {
            type: String,
            enum: ["first", "second", "third", "fourth", "last"],
          },
          dayOfWeek: {
            type: String,
            enum: [
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
            ],
          },
        },
        { _id: false }
      ),
    },

    endless: Boolean,
    untilNumber: Number,
    untilDate: Date,
  },
  { _id: false }
);
