import bcrypt from "bcryptjs";

export const hash_password = async (pass: string) => {
  const hashed_pass = await bcrypt.hash(pass, 10);
  return hashed_pass;
}

export const compare_password = async (pass: string, hash: string) => {
  const flag = await bcrypt.compare(pass, hash);
  return flag;
}