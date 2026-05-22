"use client";

import { SignInForm } from "@/Components/SignInForm";
import { SignUpForm } from "@/Components/SignUpForm";
import { form_types } from "@/Types/FormTypeEnum";
import { useState } from "react";

export default function AuthPage() {

  const [formType, setFormType] = useState<form_types>(form_types.sign_up);

  return (
    <div className="flex flex-col flex-1 justify-center align-middle w-full bg-slate-900 select-none">

      <div id="sign_in" className={`w-fit self-center md:scale-140 ${(formType === form_types.sign_in) ? ("block") : ("hidden")}`}>
        <h1 className="text-center text-2xl font-extrabold md:text-4xl">
          Log In
        </h1>
        <SignInForm />
      </div>

      <div id="sign_up" className={`w-fit self-center md:scale-130 ${(formType === form_types.sign_up) ? ("block") : ("hidden")}`}>
        <h1 className="text-center text-2xl font-extrabold md:text-4xl">
          Create Account
        </h1>
        <SignUpForm />
      </div>

      <a
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          if (formType === form_types.sign_in) {
            setFormType(form_types.sign_up);
          }
          else {
            setFormType(form_types.sign_in);
          }
        }}
        className="underline text-slate-300 self-center md:mt-24"
      >
        {(formType === form_types.sign_in) ? ("create account instead") : ("Log in instead")}
      </a>
    </div>
  );
}