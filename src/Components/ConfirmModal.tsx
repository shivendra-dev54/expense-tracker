"use client";

import { Dispatch, SetStateAction } from "react";

export const ConfirmModal = ({
  msg,
  setIsOpen,
  callbackOnConfirm
}: {
  msg: string,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  callbackOnConfirm: () => Promise<any>
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-8 ml-2 mr-2">
      <h1>
        {msg}
      </h1>

      <div className="flex justify-between items-center mt-8">
        <button
          className="bg-slate-950 p-2 pl-6 pr-6 rounded-full text-red-400"
          onClick={async () => {
            setIsOpen(false);
            await callbackOnConfirm();
          }}
        >
          confirm
        </button>

        <button
          className="bg-slate-950 p-2 pl-6 pr-6 rounded-full text-green-400"
          onClick={() => setIsOpen(false)}
        >
          close
        </button>
      </div>
    </div>
  );
}