import mongoose, { Document, Schema } from "mongoose";

export interface IStudyPlan extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  focusTime: number;
  breakTime: number;
  cycles: number;
  dragToNextDay: boolean;

  isCompleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const StudyPlanSchema: Schema = new Schema<IStudyPlan>(
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
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    focusTime: {
      type: Number,
      required: true,
    },
    breakTime: {
      type: Number,
      required: true,
    },
    cycles: {
      type: Number,
      required: true,
    },
    dragToNextDay: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const StudyPlan = mongoose.model<IStudyPlan>("StudyPlan", StudyPlanSchema);
export default StudyPlan;
