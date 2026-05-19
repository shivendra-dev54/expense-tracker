import { deleteExpenseService, updateExpenseAmountService, updateExpenseMessageService } from "@/services/expense.service";
import { ApiResponse } from "@/util/ApiResponse";
import { InvalidDataError } from "@/util/customErrors";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { Types } from "mongoose";

export type RouteParams = {
  params: Promise<{ id: string }>
};

export const POST = errorHandlerWrap(async (request: Request, { params }: RouteParams) => {
  const id = (await params).id as unknown as Types.ObjectId;
  const {
    amount,
    message
  } = await request.json();
  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;

  if (!amount && !message) {
    throw new InvalidDataError();
  }

  let updated_exp;
  if (amount) {
    updated_exp = await updateExpenseAmountService(
      user_id,
      id,
      amount
    );
  }
  if (message) {
    updated_exp = await updateExpenseMessageService(
      user_id,
      id,
      message
    );
  }

  const resp: ApiResponse<any> = {
    status: true,
    status_code: 200,
    message: "updated expenese successfully.",
    data: updated_exp
  };
  return Response.json(
    resp,
    { status: 200 }
  );
});

export const DELETE = errorHandlerWrap(async (request: Request, { params }: RouteParams) => {
  const id = (await params).id as unknown as Types.ObjectId;
  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;

  const deleted_exp = await deleteExpenseService(
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