"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative w-screen bg-slate-900 text-pink-100 text-center p-8 flex flex-col flex-1">
      <h1 className="text-5xl font-extrabold text-green-500">
        Expense Tracker
      </h1>

      <p className="mt-16 text-xl">
        This is a simple web app for logging your expenses.
        <br />
        There isn't too much in this app that I can put here.
      </p>
      <div className="absolute bottom-16 left-0 right-0">
        <button
          className=" p-2 pl-8 pr-8 bg-green-500 text-black font-extrabold text-xl border-2 rounded-4xl cursor-pointer"
          onClick={() => router.push("/auth")}
        >
          Get started
        </button>
      </div>

      <p className="bottom-0 absolute left-0 right-0 pb-4 text-slate-500">
        built by <a href="https://github.com/shivendra-dev54" className="text-green-500 decoration-0">shivendra devadhe.</a>
      </p>
    </div>
  );
}
