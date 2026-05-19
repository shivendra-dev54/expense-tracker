import { deleteUserService } from "@/services/admin.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { Types } from "mongoose";
import { RouteParams } from "../../expense/[id]/route";

export const DELETE = errorHandlerWrap(async (request: Request, { params }: RouteParams) => {
  const id = (await params).id as unknown as Types.ObjectId;
  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;

  const deleted_exp = await deleteUserService(
    user_id,
    id
  );

  const resp: ApiResponse<any> = {
    status: true,
    status_code: 200,
    message: "deleted expense successfully.",
    data: deleted_exp
  };
  return Response.json(
    resp,
    { status: 200 }
  );
});