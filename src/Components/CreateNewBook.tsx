"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { Dispatch, SetStateAction, useState } from "react";

export const CreateNewBook = ({
  setIsCreateModalOpen,
  setNotebooks
}: {
  setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>,
  setNotebooks: Dispatch<SetStateAction<any[]>>
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ebName, setEbName] = useState<string>("");

  const { logout } = useAuthStore();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const resp = await axiosRequestHandler(
      "/api/book",
      "POST",
      {
        "name": ebName
      },
      logout
    );
    setNotebooks((e) => [...e, resp.data.data]);
    setIsCreateModalOpen(false);
  }

  return (
    <div className="mt-4 bg-slate-700 self-center p-4 rounded-2xl flex flex-col justify-evenly items-center gap-3 md:scale-125">
      <h1 className="text-center text-2xl p-2">
        create new book
      </h1>
      <form
        className="flex flex-col"
        onSubmit={handleSubmit}
      >
        <label htmlFor="new_book_name">
          book name:
        </label>
        <input
          type="text"
          id="new_book_name"
          className="bg-slate-800 rounded-3xl p-2 pl-4 pr-4 outline-none w-full"
          placeholder="..."
          value={ebName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEbName(e.target.value);
          }
          }
        />

        <div className="flex justify-between items-center mt-4">
          <button
            type="submit"
            className={`inline-block pr-8 pl-8 p-2 rounded-4xl outline-none w-fit bg-slate-950 text-green-300
              ${((isLoading) ? ("cursor-not-allowed") : ("cursor-pointer"))}`}
            disabled={isLoading}
          >
            {isLoading ? ("Loading...") : ("create")}
          </button>

          <button
            className={`self-center cursor-pointer text-red-300 bg-slate-950 p-2 pl-8 pr-8 rounded-full`}
            onClick={(e) => {
              e.preventDefault();
              setIsCreateModalOpen(false);
            }}
            disabled={isLoading}
          >
            close
          </button>
        </div>

      </form>
    </div>
  );
}