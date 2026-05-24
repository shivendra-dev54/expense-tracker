"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { successNotification } from "@/util/toastFunctionsDarkMode";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const currentPath = usePathname();
  const dropdown_menu = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const handleAccountDelete = async () => {
    await axiosRequestHandler(
      "/api/user",
      "DELETE",
      null,
      logout
    );

    await axiosRequestHandler(
      "/api/auth/logout",
      "POST",
      null,
      logout
    );

    logout();
    successNotification("deleted account!");
    router.push("/");
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isOpen) {
        return;
      }
      e.preventDefault();
      if (dropdown_menu.current && !dropdown_menu.current.contains(e?.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user, isOpen]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="relative flex justify-between align-middle p-4 bg-slate-950 md:pl-16 md:pr-16 select-none">
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
      {
        isMounted ? (
          <div>
            {user ? (
              <div className="flex align-middle justify-center" ref={dropdown_menu}>
                <button
                  className="outline-none cursor-pointer self-center"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <g clipPath="url(#clip0_429_11066)">
                        <path d="M3 6.00092H21M3 12.0009H21M3 18.0009H21" stroke="#afafaf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_429_11066">
                          <rect width="24" height="24" fill="white" transform="translate(0 0.000915527)"></rect>
                        </clipPath>
                      </defs>
                    </g>
                  </svg>
                </button>

                {isOpen && (
                  <div
                    className="absolute right-0 origin-top-right mr-2 mt-2 w-fit bg-slate-800 border-2 border-slate-700 rounded-lg p-4 top-full lg:scale-125"
                  >
                    <div className="flex flex-col">
                      <h1 className="text-xl">
                        {user?.fullname}
                      </h1>
                      <h2 className="text-lg text-slate-400">
                        @{user?.username}
                      </h2>
                      <h3 className="">
                        {user?.email}
                      </h3>
                      <button
                        id="log_out_button"
                        className="pr-6 pl-6 p-2 rounded-4xl bg-red-400 text-black cursor-pointer outline-none font-extrabold w-fit self-center mt-4"
                        onClick={async (e) => {
                          e.preventDefault();
                          await axiosRequestHandler(
                            "/api/auth/logout",
                            "POST",
                            null,
                            logout
                          );
                          logout();
                          router.push("/");
                        }}
                      >
                        log out
                      </button>

                      <button
                        className="text-red-300 underline mt-2"
                        onClick={handleAccountDelete}
                      >
                        delete account
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              (currentPath !== "/auth") && (
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
              )
            )}
          </div>
        ) : (
          <div>

          </div>
        )
      }




    </nav >
  );
}