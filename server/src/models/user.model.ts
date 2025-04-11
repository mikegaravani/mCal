import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  dateCreated: Date;
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
