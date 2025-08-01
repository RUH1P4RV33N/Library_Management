"use client"
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues,FieldValues,useForm,UseFormReturn,SubmitHandler } from "react-hook-form"
import {ZodType,z} from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import ImageUpload from "@/components/ImageUpload";
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {FIELD_NAMES,FIELD_TYPES} from "@/constants";
import * as Path from "node:path";

interface Props <T extends FieldValues>{
  schema:ZodType<T>;
  defaultValues:T;
  OnSubmit:(data:T)=>Promise<{success:boolean;error?:string}>;
  type:"SIGN-IN"|"SIGN-UP"
}
const AuthForm= <T extends FieldValues> ({
                                           type,
                                           schema,
                                           defaultValues,
                                           OnSubmit}
                                         :Props<T>) => {
  const isSignIn=type==="SIGN-IN"
  const form:UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // 2. Define a submit handler.
  const handleSubmit:SubmitHandler<T>=async(data)=>{

  }
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn?"Welcome Back":"Create Account"}
      </h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
        {Object.keys(defaultValues).map((key) => (

            <FormField
              key={key}
              control={form.control}
              name={key as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
                  <FormControl>
                    {field.name==="UniversityCard" ?
                      (<ImageUpload/>)
                      :(<Input required type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                               {...field}
                      className="form-input"/>
                      )}

                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
        ))}


        <Button type="submit" className="form-btn">{isSignIn?"Sign-In":"Sign-Up"}</Button>
      </form>
    </Form>
      <p className="text-center text-base font-medium">
        {isSignIn?"Don't have an account? ":"Already have an account? "}
        <Link href={isSignIn?"/sign-up":"/sign-in"} className=" font-bold text-primary">
          {isSignIn?"Sign-Up":"Sign-In"}
        </Link>
      </p>
    </div>
  )


};
export default AuthForm;


