import { ApiResponse } from "@/util/ApiResponse"
import { errorHandlerWrap } from "@/util/errorHandlerWrap"

export const GET = errorHandlerWrap((_req: Request, _res: Response) => {
  const response: ApiResponse<null> = {
    status: true,
    status_code: 200,
    message: "server running...",
    data: null
  };
  return Response.json(response);
});