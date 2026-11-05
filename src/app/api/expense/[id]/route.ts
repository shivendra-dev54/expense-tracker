import { deleteExpenseService, updateExpenseService } from "@/services/expense.service";
import { ApiResponse } from "@/util/ApiResponse";
import { InvalidDataError } from "@/util/customErrors";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { Types } from "mongoose";

export type RouteParams = {
  params: Promise<{ id: string }>
};

export const POST = errorHandlerWrap(async (request: Request, { params }: RouteParams) => {
  const id = (await params).id as unknown as Types.ObjectId;

  const body = await request.json();

  const user_id = request.headers.get("x-user-id") as unknown as Types.ObjectId;

  const updates: {
    amount?: number;
    message?: string;
    expense_date?: Date;
  } = {};

  if (body.amount !== undefined) {
    updates.amount = Number(body.amount);
  }

  if (body.message !== undefined) {
    updates.message = body.message;
  }

  if (body.expense_date !== undefined) {
    updates.expense_date = new Date(body.expense_date);
  }

  if (Object.keys(updates).length === 0) {
    throw new InvalidDataError();
  }

  const updated_exp = await updateExpenseService(
    user_id,
    id,
    updates
  );

  const resp: ApiResponse<any> = {
    status: true,
    status_code: 200,
    message: "updated expense successfully.",
    data: updated_exp
  };

  return Response.json(resp, { status: 200 });
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