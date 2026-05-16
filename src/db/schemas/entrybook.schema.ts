import { model, models, Schema } from "mongoose";

export interface IEntryBook {
  name: string;
  user_id: Schema.Types.ObjectId;
  balance: number;
};

const EntryBookSchema = new Schema<IEntryBook>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  {
    bufferCommands: false
  }
);

export const EntryBook = models.EntryBook || model<IEntryBook>("EntryBook", EntryBookSchema);