"use client";

import { CreateNewBook } from "@/Components/CreateNewBook";
import { NotebookList } from "@/Components/NotebookList";
import { useAuthStore } from "@/Store/AuthStore";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { useEffect, useState } from "react";

export default function AppPage() {
  const { logout } = useAuthStore();
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

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



  return (
    <div className="bg-slate-900 flex flex-col flex-1 text-white">

      <h1 className="text-4xl self-center text-center p-4 font-extrabold text-green-200">
        Notebooks
      </h1>

        <div className="flex flex-col mb-4">
          <button
            className={`p-2 rounded-full self-center cursor-pointer bg-green-500 text-black pl-4 pr-4`}
            onClick={() => setIsCreateModalOpen(true)}
          >
            create new
          </button>
        </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <CreateNewBook setIsCreateModalOpen={setIsCreateModalOpen} />
        </div>
      )}

      <NotebookList notebooks={notebooks} />
    </div>
  );
}