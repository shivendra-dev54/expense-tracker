"use client";

import { Dispatch, SetStateAction } from "react";

export const ConfirmModalForUpdate = ({
  msg,
  setIsOpen,
  callbackOnConfirm,
  updatedName,
  setUpdatedName,
}: {
  msg: string,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  callbackOnConfirm: () => Promise<any>,
  updatedName: string | null,
  setUpdatedName: Dispatch<SetStateAction<string | null>>
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl mx-8 p-4 box-border">
      <h1 className="text-center">
        {msg}
      </h1>

      <div className="flex justify-between items-center mt-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsOpen(false);
            await callbackOnConfirm();
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="updated_name" />
          <input
            type="text"
            id="updated_name"
            placeholder="cannot be empty!"
            value={updatedName || ""}
            onChange={(e) => {
              setUpdatedName(e.target.value);
            }}
            minLength={3}
            maxLength={30}
            className="bg-slate-700 text-white p-2 pl-4 pr-4 mb-4 rounded-full outline-none"
            required
          />

          <div className="flex justify-between">
            <button
              className="bg-slate-950 p-2 pl-6 pr-6 rounded-full text-red-400 cursor-pointer"
              type="submit"
            >
              confirm
            </button>

            <button
              className="bg-slate-950 p-2 pl-6 pr-6 rounded-full text-green-400 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}
            >
              close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}