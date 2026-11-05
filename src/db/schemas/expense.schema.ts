import { model, models, Schema, Types } from "mongoose";

export interface IExpense {
  user_id: Types.ObjectId;
  entrybook_id: Types.ObjectId;
  message: string;
  amount: number;
  expense_date: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    entrybook_id: {
      type: Schema.Types.ObjectId,
      ref: "EntryBook",
      required: true
    },
    message: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
      required: true,
    },
    expense_date: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    bufferCommands: false,
    timestamps: true
  }
);

export const Expense = models.Expense || model<IExpense>("Expense", ExpenseSchema);