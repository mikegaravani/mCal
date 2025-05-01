import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  dateCreated: Date;
  fullName?: string;
  birthDate?: Date;
  location?: string;
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
  fullName: {
    type: String,
    required: false,
  },
  birthDate: {
    type: Date,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
