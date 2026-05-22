"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { usePathname, useRouter } from "next/navigation";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const currentPath = usePathname();

  return (
    <nav className="flex justify-between align-middle p-4 bg-slate-950 md:pl-16 md:pr-16 select-none">
      <div
        className="cursor-pointer"
        onClick={() => router.push((user) ? ("/app/main") : ("/"))}
      >
        <p className="p-2 text-xl text-green-500 font-extrabold block md:hidden">
          ET
        </p>
        <p className="p-2 text-2xl text-green-500 font-extrabold hidden md:block">
          Expense Tracker
        </p>
      </div>

      <div className={(currentPath === "/auth") ? ("hidden") : ("block")}>
        {user ? (
          <button
            id="log_out_button"
            className="pr-6 pl-6 p-2 border-2 rounded-4xl bg-red-500 text-black cursor-pointer outline-none"
            onClick={async (e) => {
              e.preventDefault();
              await axiosRequestHandler(
                "/api/auth/logout",
                "POST",
                null
              );
              logout();
              router.push("/");
            }}
          >
            log out
          </button>
        ) : (
          <button
            id="sign_up_button"
            className="pr-6 pl-6 p-2 border-2 rounded-4xl bg-green-500 text-black cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              router.push("/auth");
            }}
          >
            sign up
          </button>
        )}
      </div>
    </nav>
  );
}