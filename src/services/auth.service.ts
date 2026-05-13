import { IUser, User } from "@/db/schemas/user.schema";
import { InvalidDataError } from "@/util/customErrors";
import { hash_password } from "@/services/pass.service";
import { dbConnect } from "@/db";

export const create_user_service = async (user_data: IUser) => {
  // validate data
  const fullname = user_data.fullname.trim();
  const username = user_data.username.trim();
  const email = user_data.email.trim();
  const password = user_data.password.trim();
  
  if (!fullname.trim() || !username.trim() || !email.trim() || !password.trim()) {
    throw new InvalidDataError();
  }
  
  // check if user exists
  await dbConnect();
  const user_with_same_username = await User.findOne({ username });
  const user_with_same_email = await User.findOne({ email });

  if (user_with_same_email) {
    throw new InvalidDataError("user with this email already exists.");
  }
  if (user_with_same_username) {
    throw new InvalidDataError("user with this username already exists.");
  }

  // hash pass
  const hashed_pass = await hash_password(password);

  // create user
  const user: IUser = {
    fullname,
    username,
    email,
    password: hashed_pass
  };
  const new_user = await User.create(user);
  //  return new user without password
  return {
    "username": new_user.username,
    "email": new_user.email
  }
}