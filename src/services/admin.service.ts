import { dbConnect } from "@/db";
import { Admin, IAdmin } from "@/db/schemas/admin.schema";
import { EntryBook } from "@/db/schemas/entrybook.schema";
import { Expense } from "@/db/schemas/expense.schema";
import { User } from "@/db/schemas/user.schema";
import { InvalidDataError, NotFoundError, UnauthorizedError } from "@/util/customErrors";
import mongoose, { Types } from "mongoose";

export const getAdminAccessService = async (
  user_id: Types.ObjectId,
  secret: string
) => {
  await dbConnect();
  // as user is authenticated by middleware proxy we don't need to check user
  const is_secret_correct = secret === process.env.ADMIN_SECRET!;
  if (!is_secret_correct) {
    throw new InvalidDataError();
  }

  const new_admin: IAdmin = {
    user_id
  };

  const admin_obj = await Admin.create(new_admin);
  return admin_obj;
}


export const getAllUserListService = async (
  user_id: Types.ObjectId
) => {
  await dbConnect();
  const admin_obj = await Admin.findOne({
    user_id
  });

  if (!admin_obj) {
    throw new UnauthorizedError();
  }

  const user_list = await User.find({
    _id: { $ne: user_id }
  }).select("-password");

  return user_list;
}


export const deleteUserService = async (
  user_id: Types.ObjectId,
  id_of_user_to_be_deleted: Types.ObjectId
) => {
  await dbConnect();
  const admin_obj = await Admin.findOne({
    user_id
  });

  if (!admin_obj) {
    throw new UnauthorizedError();
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const deleted_user = await User.findById(id_of_user_to_be_deleted);
      if (!deleted_user) {
        throw new NotFoundError();
      }
      await Expense.deleteMany({ user_id: id_of_user_to_be_deleted });
      await EntryBook.deleteMany({ user_id: id_of_user_to_be_deleted });
      await User.findByIdAndDelete(id_of_user_to_be_deleted);
    });
  }
  finally {
    await session.endSession();
  }
}