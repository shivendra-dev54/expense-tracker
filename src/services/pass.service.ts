
export const hash_password = async (pass: string) => {
  const hashed_pass = await Bun.password.hash(pass);
  return hashed_pass;
}