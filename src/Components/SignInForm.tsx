"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { errorNotification, successNotification } from "@/util/toastFunctionsDarkMode";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignInForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { setUser, logout } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const id = e.target.id;
    const value = e.target.value;
    switch (id) {
      case "identifierInput":
        setIdentifier(value);
        break;
      case "passwordInput":
        setPassword(value);
        break;
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let userData;

    if (identifier.includes("@")) {
      userData = {
        email: identifier,
        password
      }
    }
    else {
      userData = {
        username: identifier,
        password
      }
    }

    setIsLoading(true);

    try {
      const resp = await axiosRequestHandler(
        "/api/auth/sign_in",
        "POST",
        userData,
        logout
      );
      const user_data = resp.data.data;
      setUser(user_data);
      router.push("/app/main");
    }
    catch (e: any) {
      const code = e?.response?.status;
      if (code === 499) {
        errorNotification(e.response.data.message);
      }
      else {
        errorNotification("Something went wrong!");
        console.log(e);
      }
    }
    setIsLoading(false);
  }
  return (
    <form
      className="flex flex-col justify-center align-middle p-8 bg-slate-800 m-8 rounded-3xl w-fit mr-auto ml-auto mb-0"
      onSubmit={handleSubmit}
    >
      <label htmlFor="identifierInput" className="">
        Username or Email
      </label>
      <input
        type="text"
        id="identifierInput"
        className="w-min bg-slate-700 text-white p-2 pl-4 pr-4 mb-4 rounded-full outline-none"
        placeholder="..."
        value={identifier}
        onChange={handleChange}
        minLength={3}
        required
      />

      <label htmlFor="passwordInput" className="w-min">
        Password
      </label>
      <input
        type="password"
        id="passwordInput"
        className="w-min bg-slate-700 text-white p-2 pl-4 pr-4 mb-4 rounded-full outline-none"
        placeholder="******"
        value={password}
        onChange={handleChange}
        minLength={6}
        maxLength={15}
        required
      />

      <button
        className={`pr-8 pl-8 p-2 rounded-4xl outline-none w-fit ml-auto mr-auto ${((isLoading) ? ("bg-slate-950 text-white cursor-not-allowed") : ("bg-green-500 text-black cursor-pointer"))}`}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? ("Processing...") : ("Sign In")}
      </button>
    </form>
  );
}