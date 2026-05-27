import { ApiResponse } from "./ApiResponse";
import { HandlableError, UnauthorizedError } from "./customErrors";

export const errorHandlerWrap = (handler: Function) => {
  return async (req: Request, context: any) => {
    try {
      return await handler(req, context);
    }
    catch (e: any) {
      let status_code = 400;
      if (e instanceof HandlableError) {
        status_code = 499;
      }

      if (e instanceof UnauthorizedError) {
        status_code = 498
      }

      const response: ApiResponse<null> = {
        status: false,
        status_code: status_code,
        message: e.message || "unexpected error occured.",
        data: null
      }
      return Response.json(response, { status: status_code });
    }
  }
}