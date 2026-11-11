import { bulkDeleteExpenseService } from "@/services/expense.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { Types } from "mongoose";

type BulkDeleteResponse = {
  deleted_count: number;
  deleted_ids: string[];
  balance: number;
};

export const DELETE = errorHandlerWrap(async (request: Request) => {
  const { book_id, expense_ids } = await request.json();

  const user_id = request.headers.get("x-user-id");

  if (!user_id) {
    throw new Error("Unauthorized");
  }

  const data = await bulkDeleteExpenseService(
    new Types.ObjectId(user_id),
    book_id,
    expense_ids
  );

  const resp: ApiResponse<BulkDeleteResponse> = {
    status: true,
    status_code: 200,
    message: "Selected expenses deleted successfully.",
    data: data!
  };

  return Response.json(resp, { status: 200 });
});
