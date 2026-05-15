import { IUser } from "@/db/schemas/user.schema";
import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export const token_generator = async (payload: Partial<IUser>) => {
  const access_token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  const refresh_token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  return { access_token, refresh_token };
}

export const token_decoder = async (token: string) => {
  const payload = await jwtVerify(token, secret) as unknown as Partial<IUser>;
  return payload;
}