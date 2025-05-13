import { Schema } from "mongoose";

export const ReminderSchema = new Schema({
  minutesBefore: { type: Number, required: true },
  repeat: { type: Boolean, default: false },
  repeatInterval: { type: Number },
  repeatCount: { type: Number },
});
