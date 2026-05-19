import { dbConnect } from "@/db";
import { EntryBook } from "@/db/schemas/entrybook.schema";
import { Expense } from "@/db/schemas/expense.schema";
import { User } from "@/db/schemas/user.schema";
import { NotFoundError } from "@/util/customErrors";
import mongoose, { Types } from "mongoose";

export const getUserInfoService = async (user_id: Types.ObjectId) => {
  await dbConnect();
  const user_info = await User.findById(user_id).select("-password");
  return user_info;
}

export const deleteSelfService = async (user_id: Types.ObjectId) => {
  await dbConnect();
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const deleted_user = await User.findById(user_id);
      if (!deleted_user) {
        throw new NotFoundError();
      }
      await Expense.deleteMany({ user_id: user_id });
      await EntryBook.deleteMany({ user_id: user_id });
      await User.findByIdAndDelete(user_id);
    });
  }
  finally {
    await session.endSession();
  }
}