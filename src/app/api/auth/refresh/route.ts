import { refresh_token_service } from "@/services/auth.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { cookies } from "next/headers";

export const POST = errorHandlerWrap(async (req: Request, res: Response) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh_token")?.value || "";
  // console.log(token);
  const { access_token, refresh_token } = await refresh_token_service(token);

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

  const resp: ApiResponse<null> = {
    status: true,
    status_code: 200,
    message: "refresh tokens successfully.",
    data: null
  };
  return Response.json(resp, { status: 200 });
});