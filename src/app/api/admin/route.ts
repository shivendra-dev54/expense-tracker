import { getAdminAccessService, getAllUserListService } from "@/services/admin.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { Types } from "mongoose";

export const POST = errorHandlerWrap(async (request: Request) => {

  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;
  const { secret } = await request.json();

  await getAdminAccessService(
    user_id,
    secret
  );

  const resp: ApiResponse<null> = {
    status: true,
    status_code: 200,
    message: "admin access granted.",
    data: null
  }
  return Response.json(resp, { status: 200 });
});


export const GET = errorHandlerWrap(async (request: Request) => {
  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;
  const user_list = await getAllUserListService(user_id);
  const resp: ApiResponse<any> = {
    status: true,
    status_code: 200,
    message: "fetched all users.",
    data: user_list
  }
  return Response.json(resp, { status: 200 });
});