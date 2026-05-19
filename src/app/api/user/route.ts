import { deleteSelfService, getUserInfoService } from "@/services/user.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { Types } from "mongoose";

export const GET = errorHandlerWrap(async (request: Request) => {
  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;
  const user_info = await getUserInfoService(user_id);

  const resp: ApiResponse<any> = {
    status: true,
    status_code: 200,
    message: "user info fetched.",
    data: user_info
  }
  return Response.json(resp, { status: 200 });
});


export const DELETE = errorHandlerWrap(async (request: Request) => {
  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;
  await deleteSelfService(user_id);
  const resp: ApiResponse<any> = {
    status: true,
    status_code: 200,
    message: "user deleted sucessfully.",
    data: null
  }
  return Response.json(resp, { status: 200 });
});