import { IUser } from "@/db/schemas/user.schema";
import { create_user_service } from "@/services/auth.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";

export const POST = errorHandlerWrap(async (req: Request, res: Response) => {
  const body = await req.json() as unknown as IUser;
  const new_user = await create_user_service(body);
  const response: ApiResponse<{
    username: string;
    email: string;
  }> = {
    status_code: 201,
    status: true,
    message: "user created successfully",
    data: new_user
  }
  return Response.json(response, { status: 201 });
});