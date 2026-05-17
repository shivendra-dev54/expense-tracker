import { model, models, Schema, Types } from "mongoose";

export interface IExpense {
  user_id: Types.ObjectId;
  entrybook_id: Types.ObjectId;
  message: string;
  amount: number;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      allowNull: false
    },
    entrybook_id: {
      type: Schema.Types.ObjectId,
      ref: "EntryBook",
      allowNull: false
    },
    message: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
      allowNull: false,
    }
  },
  {
    bufferCommands: false,
    timestamps: true
  }
);

export const Expense = models.Expense || model<IExpense>("Expense", ExpenseSchema);