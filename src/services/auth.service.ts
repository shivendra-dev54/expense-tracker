import { IUser, User } from "@/db/schemas/user.schema";
import { InvalidDataError, NotFoundError } from "@/util/customErrors";
import { compare_password, hash_password } from "@/services/pass.service";
import { dbConnect } from "@/db";
import { token_decoder, token_generator } from "./token.service";

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

export const authenticate_user = async (body: Partial<IUser>) => {
  const username = body?.username?.trim();
  const email = body?.email?.trim();
  const password = body.password?.trim();

  if ((!username && !email) || !password) {
    throw new InvalidDataError();
  }

  // check if user exists
  await dbConnect();
  const user_by_username = await User.findOne({ username });
  const user_by_email = await User.findOne({ email });
  if ((!user_by_email && !user_by_username)) {
    throw new NotFoundError("user not found!");
  }

  // compare passwords 
  const user_from_db = user_by_email ? user_by_email : user_by_username;
  const is_pass_correct = compare_password(password, user_from_db.password);
  if (!is_pass_correct) {
    throw new InvalidDataError("incorrect password!");
  }

  // build the payload for the tokens
  let user: Partial<IUser> = {
    username: user_from_db.username,
    email: user_from_db.email,
    fullname: user_from_db.fullname
  }

  //generate tokens
  const { access_token, refresh_token } = await token_generator(user);
  return { access_token, refresh_token };

}


export const refresh_token_service = async (token: string) => {
  const payload: Partial<IUser> = await token_decoder(token);
  const email = payload?.email;
  if(!email){
    throw new InvalidDataError("refresh token not valid, login again.");
  }

  // check if user exists
  await dbConnect();
  const user_from_db = await User.findOne({ email });
  if (!user_from_db) {
    throw new NotFoundError("user not found!");
  }

  // build the payload for the tokens
  let user: Partial<IUser> = {
    username: user_from_db.username,
    email: user_from_db.email,
    fullname: user_from_db.fullname
  }

  //generate tokens
  const { access_token, refresh_token } = await token_generator(user);
  return { access_token, refresh_token };
}