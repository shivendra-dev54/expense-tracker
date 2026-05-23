"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppPage() {
  const { logout } = useAuthStore();
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const router = useRouter();

  useEffect(
    () => {
      const getNoteBookData = async () => {
        const resp = await axiosRequestHandler(
          "/api/book",
          "GET",
          null,
          logout
        );

        const data = resp.data.data;
        setNotebooks(data);
      }
      getNoteBookData();
    },
    []
  );

  const handleBookClick = (e: React.MouseEvent<HTMLElement>) => {
    setIsDisabled(true);
    const id_of_book = (e.target as unknown as HTMLElement).id;
    router.push(`/app/book/${id_of_book}`);
  }

  return (
    <div className="bg-slate-900 flex flex-col flex-1 text-white align-middle">

      <h1 className="text-4xl self-center text-center p-4 font-extrabold text-green-200">
        Notebooks
      </h1>

      {
        notebooks.map(
          (notebook) => {
            return (
              <div
                id={notebook._id}
                key={notebook._id}
                className={`p-4 pl-6 pr-6 bg-slate-800 ml-4 mr-4 m-2 rounded-full md:w-1/2 md:self-center ${isDisabled ? ("cursor-not-allowed") : ("cursor-pointer")}`}
                onClick={(e) => {
                  if (isDisabled) return;
                  handleBookClick(e);
                }}
              >
                <span className="text-xl">{notebook.name}</span>
                <br />
                <span
                  className="text-slate-400"
                >
                  bal:
                  <span
                    className={`${(notebook.balance <= 0) ? ("text-red-500") : ("text-green-500")}`}>
                    {" " + notebook.balance}
                  </span>
                </span>
              </div>
            )
          }
        )
      }
    </div>
  );
}