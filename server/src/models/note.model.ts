import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  categories: string[];
  color: number;
  starred: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema<INote>(
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
    content: {
      type: String,
      required: true,
      trim: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    color: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    starred: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;
