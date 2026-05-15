import { ApiResponse } from "./ApiResponse";

export const errorHandlerWrap = (handler: Function) => {
  return async (req: Request, context: any) => {
    try {
      return await handler(req, context);
    }
    catch (e: any) {
      // console.log(e);
      const response: ApiResponse<null> = {
        status: false,
        status_code: 400,
        message: e.message || "unexpected error occured.",
        data: null
      }
      return Response.json(response, {status: 400});
    }
  }
}