"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { errorNotification, successNotification } from "@/util/toastFunctionsDarkMode";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { logout, setUser } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const id = e.target.id;
    const value = e.target.value;
    switch (id) {
      case "usernameInput":
        setUsername(value);
        break;
      case "emailInput":
        setEmail(value);
        break;
      case "fullnameInput":
        setFullname(value);
        break;
      case "passwordInput":
        setPassword(value);
        break;
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      fullname,
      username,
      email,
      password
    };
    setIsLoading(true);

    try {
      await axiosRequestHandler(
        "/api/auth/sign_up",
        "POST",
        userData,
        logout
      );

      successNotification("account created!");
      successNotification("logging in...");

      const resp_sign_in = await axiosRequestHandler(
        "/api/auth/sign_in",
        "POST",
        userData,
        logout
      );
      setUser(resp_sign_in?.data.data);
      router.push("/app/main");
    }
    catch (e: any) {
      const code = e.response.status;
      if (code === 499) {
        errorNotification(e.response.data.message);
      }
      else {
        errorNotification("Something went wrong!");
      }
    }
    setIsLoading(false);
  }
  return (
    <form
      className="flex flex-col justify-center align-middle p-8 bg-slate-800 m-8 rounded-3xl w-fit mr-auto ml-auto mb-0"
      onSubmit={handleSubmit}
    >
      <label htmlFor="usernameInput" className="w-min">
        Username
      </label>
      <input
        type="text"
        id="usernameInput"
        className="w-min bg-slate-700 text-white p-2 pl-4 pr-4 mb-4 rounded-full outline-none"
        placeholder="..."
        value={username}
        onChange={handleChange}
        minLength={3}
        maxLength={15}
        required
      />

      <label htmlFor="fullnameInput" className="w-min">
        Fullname
      </label>
      <input
        type="text"
        id="fullnameInput"
        className="w-min bg-slate-700 text-white p-2 pl-4 pr-4 mb-4 rounded-full outline-none"
        placeholder="... ..."
        value={fullname}
        onChange={handleChange}
        minLength={6}
        maxLength={40}
        required
      />

      <label htmlFor="emailInput" className="w-min">
        Email
      </label>
      <input
        type="email"
        id="emailInput"
        className="w-min bg-slate-700 text-white p-2 pl-4 pr-4 mb-4 rounded-full outline-none"
        placeholder="......"
        value={email}
        onChange={handleChange}
        maxLength={60}
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
        {isLoading ? ("Processing...") : ("Sign Up")}
      </button>
    </form>
  );
}