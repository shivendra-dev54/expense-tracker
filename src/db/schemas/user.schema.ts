import { models, Schema, model } from "mongoose";

export interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    bufferCommands: false
  }
);

export const User = models.User || model<IUser>("User", UserSchema);