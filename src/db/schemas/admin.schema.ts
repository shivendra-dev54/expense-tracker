import { model, models, Schema, Types } from "mongoose";

export interface IAdmin {
  user_id: Types.ObjectId;
};

const AdminSchema = new Schema<IAdmin>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    bufferCommands: false
  }
);

export const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);