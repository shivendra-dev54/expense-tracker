import { IEntryBook } from "@/db/schemas/entrybook.schema";
import { deleteBookService, updateBookService } from "@/services/book.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";

type RouteParams = {
  params: Promise<{ id: string }>
};

export const POST = errorHandlerWrap(async (request: Request, { params }: RouteParams) => {
  const { id } = await params;
  const { name } = await request.json();
  const user_id = request.headers.get("x-user-id");
  
  const updated_book: IEntryBook = await updateBookService(id, name, user_id!);

  const resp: ApiResponse<IEntryBook> = {
    status: true,
    status_code: 200,
    message: "updated book successfully.",
    data: updated_book
  };
  return Response.json(
    resp,
    { status: 200 }
  );
});

export const DELETE = errorHandlerWrap(async (request: Request, { params }: RouteParams) => {
  const { id } = await params;
  const user_id = request.headers.get("x-user-id");

  const deleted_book: IEntryBook = await deleteBookService(id, user_id!);

  const resp: ApiResponse<IEntryBook> = {
    status: true,
    status_code: 200,
    message: "deleted book successfully.",
    data: deleted_book
  };
  return Response.json(
    resp,
    { status: 200 }
  );
});

