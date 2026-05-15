import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { cookies } from "next/headers";

export const POST = errorHandlerWrap(async (req: Request, res: Response) => {
  const cookieStore = await cookies();

  cookieStore.set("access_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/"
  });

  cookieStore.set("refresh_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/"
  });

  const resp: ApiResponse<null> = {
    status: true,
    status_code: 200,
    message: "logged out successfully.",
    data: null
  };
  return Response.json(resp, { status: 200 });
});