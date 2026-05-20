"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <nav className="flex justify-between align-middle p-4 bg-slate-950 md:pl-16 md:pr-16 select-none">
      <div
        className="cursor-pointer"
        onClick={() => router.push("/")}
      >
        <p className="p-2 text-xl text-green-500 font-extrabold block md:hidden">
          ET
        </p>
        <p className="p-2 text-2xl text-green-500 font-extrabold hidden md:block">
          Expense Tracker
        </p>
      </div>

      {user ? (
        <button
          id="log_out_button"
          className="pr-6 pl-6 p-2 border-2 rounded-4xl bg-red-500 text-black cursor-pointer outline-none"
          onClick={(e) => {
            e.preventDefault();
            logout();
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
    </nav>
  );
}