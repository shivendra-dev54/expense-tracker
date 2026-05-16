import { IEntryBook } from "@/db/schemas/entrybook.schema";
import { createBookService, readBookService } from "@/services/book.service";
import { ApiResponse } from "@/util/ApiResponse";
import { errorHandlerWrap } from "@/util/errorHandlerWrap";
import { ObjectId } from "mongoose";

export const POST = errorHandlerWrap(async (request: Request) => {
  const { name } = await request.json();
  const user_id = request.headers.get("x-user-id") as unknown as ObjectId;

  const data: Pick<IEntryBook, "name" | "user_id"> = {
    name,
    user_id
  };

  const new_book: IEntryBook = await createBookService(data);
  const resp: ApiResponse<IEntryBook> = {
    status: true,
    status_code: 200,
    message: "created new book successfully.",
    data: new_book
  }
  return Response.json(
    resp,
    { status: 200 }
  );
});


export const GET = errorHandlerWrap(async (request: Request) => {
  const user_id = request.headers.get("x-user-id");
  const books: IEntryBook[] = await readBookService(user_id!);
  const resp: ApiResponse<IEntryBook[]> = {
    status: true,
    status_code: 200,
    message: "fetched all books.",
    data: books
  };
  return Response.json(
    resp,
    { status: 200 }
  );
});