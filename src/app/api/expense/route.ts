import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";

export const POST = errorHandlerWrap(async (request: Request) => {
  // console.log(request.headers.get("x-user-username"));
  // console.log(request.headers.get("x-user-email"));
  const resp: ApiResponse<null> = {
    status: true,
    status_code: 200,
    message: "testing...",
    data: null
  }
  return Response.json(resp, { status: 200 });
});