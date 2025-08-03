"use client"
import React from "react";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth";
const Page = () => (
  <AuthForm
  type="SIGN-IN"
  schema={signInSchema}
  defaultValues={{
    email: "",
    password: "",
  }}
  OnSubmit={signInWithCredentials}
  />
)
export default Page;
