import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  categories?: string[];
  dueDate?: Date;
  isCompleted: boolean;
  priority?: number;

  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema<ITask>(
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
    categories: {
      type: [String],
      default: [],
    },
    dueDate: {
      type: Date,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
