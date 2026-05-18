import { createExpenseService, readExpenseService } from "@/services/expense.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { Types } from "mongoose";

export const POST = errorHandlerWrap(async (request: Request) => {
  const body = await request.json();
  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;
  const new_exp = await createExpenseService(
    user_id!,
    body.book_id,
    body.amount,
    body.message
  );
  const resp: ApiResponse<any> = {
    status: true,
    status_code: 200,
    message: "created new expense successfully.",
    data: new_exp
  }
  return Response.json(resp, { status: 200 });
});



export const GET = errorHandlerWrap(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const book_id = searchParams.get("book_id") as unknown as Types.ObjectId;
  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;

  const book_with_expenses = await readExpenseService(
    book_id,
    user_id
  );

  const resp: ApiResponse<any> = {
    status: true,
    status_code: 200,
    message: "fetched expenses successfully.",
    data: book_with_expenses
  }
  return Response.json(resp, { status: 200 });
});