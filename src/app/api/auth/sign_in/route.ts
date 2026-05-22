import { authenticate_user } from "@/services/auth.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { cookies } from "next/headers";

export const POST = errorHandlerWrap(async (req: Request, res: Response) => {
  const body = await req.json();
  const {
    access_token,
    refresh_token,
    user
  } = await authenticate_user(body);

  const cookieStore = await cookies();

  cookieStore.set("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/"
  });

  cookieStore.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });

  const resp: ApiResponse<any> = {
    status: true,
    status_code: 200,
    message: "logged in successfully.",
    data: user
  };
  return Response.json(resp, { status: 200 });
});