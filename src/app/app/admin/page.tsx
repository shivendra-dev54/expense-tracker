"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { UserType } from "@/Types/UserType";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserType[]>([]);

  const handleDelete = async (id: string) => {
    const adminInput = confirm("confirm delete!");
    if (!adminInput) return;
    setIsLoading(true);
    await axiosRequestHandler(
      `/api/admin/${id}`,
      "delete",
      null,
      logout
    );

    setUserList((list) => {
      return list.filter((user) => {
        return user._id !== id;
      });
    });
    setIsLoading(false);
  }

  useEffect(() => {
    const handle_admin_auth = async () => {
      const userInputForSecret = prompt("Enter the secret: ");
      setIsLoading(true);
      const resp = await axiosRequestHandler(
        "/api/admin",
        "post",
        {
          secret: userInputForSecret
        },
        logout
      );

      setIsLoading(false);

      if (!resp) {
        router.push("/app/main");
      }

      const userListFromDB = await axiosRequestHandler(
        "/api/admin",
        "get",
        null,
        logout
      );

      setUserList(userListFromDB?.data.data);
    };

    handle_admin_auth();
  }, []);

  return (
    <div
      className="flex w-full bg-slate-900 flex-1 flex-col items-center justify-center"
    >
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          Loading...
        </div>
      )}

      {userList &&
        userList.map((user) => {
          return (
            <div
              className="m-2 p-4 bg-slate-800 rounded-2xl flex flex-col max-w-96 min-w-72 h-min"
              key={user._id}
            >
              <div className="flex justify-between">
                <span className="text-slate-500">
                  fullname:
                </span>

                <span className="text-sky-100">
                  {user.fullname}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  username:
                </span>

                <span className="text-sky-100">
                  {user.username}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  email:
                </span>

                <span className="text-sky-100">
                  {user.email}
                </span>
              </div>

              <button
                className="bg-slate-950 px-6 py-2 rounded-full mt-2 text-red-300 font-extrabold self-end"
                onClick={async (e) => {
                  e.preventDefault();
                  await handleDelete(user._id);
                }}
              >
                delete
              </button>
            </div>
          );
        })
      }
    </div>
  );
}