"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ConfirmModalForDeletion } from "./ConfirmModalDeletion";
import { ConfirmModalForUpdate } from "./ConfirmModalUpdation";

export const NotebookList = ({ notebooks, setNotebooks, setIsLoading }: {
  notebooks: any[],
  setNotebooks: Dispatch<SetStateAction<any[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
}
) => {

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [entrybooks, setEntrybooks] = useState<any[]>([]);
  const [waitingForUserInputForDelete, setWaitingForUserInputForDelete] = useState<boolean>(false);
  const [idForDelete, setIdForDelete] = useState<string | null>(null);
  const [waitingForUserInputForUpdate, setWaitingForUserInputForUpdate] = useState<boolean>(false);
  const [idForUpdate, setIdForUpdate] = useState<string | null>(null);
  const [updatedName, setUpdatedName] = useState<string | null>(null);

  const router = useRouter();
  const { logout } = useAuthStore();

  const handleBookClick = async (e: React.MouseEvent<HTMLElement>) => {
    setIsDisabled(true);
    setIsLoading(true);

    await setTimeout(() => { }, 1000);

    const id_of_book = (e.target as unknown as HTMLElement).id;
    if (!id_of_book) return;
    router.push(`/app/book/${id_of_book}`);
  }

  const handleEBookDelete = async (id: string) => {
    setIsDisabled(true);
    setIsLoading(true);

    await axiosRequestHandler(
      `/api/book/${id}`,
      "DELETE",
      null,
      logout
    );

    setEntrybooks(entrybooks.filter((e) => e._id !== id));
    setNotebooks((e) => {
      return e.filter((eb) => eb._id !== id);
    });

    setIsDisabled(false);
    setIsLoading(false);
  }

  const handleBookUpdate = async (id: string) => {
    setIsDisabled(true);
    setIsLoading(true);

    if (!updatedName || updatedName?.length === 0) {
      return;
    }

    const resp = await axiosRequestHandler(
      `/api/book/${id}`,
      "POST",
      {
        "name": updatedName
      },
      logout
    );

    setEntrybooks((e) => {
      return e.map((eb) => {
        if (eb._id === id) {
          return resp?.data.data;
        }
        return eb;
      });
    });
    setNotebooks((e) => {
      return e.map((eb) => {
        if (eb._id === id) {
          return resp?.data.data;
        }
        return eb;
      });
    });

    setIsDisabled(false);
    setIsLoading(false);
  }


  useEffect(() => {
    setEntrybooks(notebooks.sort((a, b) => b._id.localeCompare(a._id)));
  }, [notebooks]);

  return (
    <div className="flex flex-col justify-center items-center w-full p-2 gap-2">
      {waitingForUserInputForDelete && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          <ConfirmModalForDeletion
            msg="Confirm Entrybook deletion."
            setIsOpen={setWaitingForUserInputForDelete}
            callbackOnConfirm={async () => {
              await handleEBookDelete(idForDelete!);
              setIdForDelete(null);
            }}
          />
        </div>
      )}


      {waitingForUserInputForUpdate && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          <ConfirmModalForUpdate
            msg="Confirm Entrybook update."
            setIsOpen={setWaitingForUserInputForUpdate}
            callbackOnConfirm={async () => {
              await handleBookUpdate(idForUpdate!);
              setIdForUpdate(null);
            }}
            updatedName={updatedName}
            setUpdatedName={setUpdatedName}
          />
        </div>
      )}


      {
        entrybooks.map(
          (notebook) => {
            return (
              <div
                id={notebook._id}
                key={notebook._id}
                className={`p-4 pl-6 pr-6 bg-slate-800 rounded-2xl w-full md:w-1/2 md:self-center ${isDisabled ? ("cursor-not-allowed") : ("cursor-pointer")}`}
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
                <div className={`flex justify-between pl-6 pr-6 ${notebook.name === "me" ? ("hidden") : ("")}`}>
                  <button
                    className="underline text-blue-200 cursor-pointer"
                    id={notebook._id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const id = (e.target as unknown as HTMLElement).id;
                      setIdForUpdate(id);
                      setWaitingForUserInputForUpdate(true);
                      setUpdatedName(notebook.name);
                    }}
                  >
                    update
                  </button>

                  <button
                    className="underline text-red-400 cursor-pointer"
                    id={notebook._id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const id = (e.target as unknown as HTMLElement).id;
                      setIdForDelete(id);
                      setWaitingForUserInputForDelete(true);
                    }}
                  >
                    delete
                  </button>
                </div>
              </div>
            )
          }
        )
      }
    </div>
  );
}