"use server"
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit  from "@/lib/ratelimit" ;
import { redirect } from "next/navigation";
import config from "@/lib/config";
import { workflowClient } from "@/lib/workflow";
export const signInWithCredentials=async(params:Pick<AuthCredentials,"email"|"password">)=>
{
    const {email,password}=params;
    const ip=(await headers()).get('x-forwarded-for')||"127.0.0.1";
    const {success}=await ratelimit.limit(ip);
    if(!success){
        return redirect("/too-fast");
    }
    try{
        const result=await signIn("credentials",{
            email,
            password,
            redirect:false,
        });
        if(result?.error){
            return {success:false,message:result.error};
        }
        return {success:true,message:"Signed In Successfully"}
    }
    catch(error){
        console.log(error,"Sign In Error");
        return {success:false,message:"Something went wrong in SignIn"}
    }
}
export const signUp=async(params:AuthCredentials)=> {

    const {fullName,email,universityId,universityCard,password}=params;

    const ip=(await headers()).get('x-forwarded-for')||"127.0.0.1";
    const {success}=await ratelimit.limit(ip);
    if(!success){
        return redirect("/too-fast");
    }
    const existingUser=await db.select().from(users).where(eq(users.email,email));
    if(existingUser.length>0){
        return {success:false,message:"User already exists"};
    }
    const hashedPassword=await hash(password,10);
    try{
        await db.insert(users).values({
            fullName,
            email,
            universityId,
            universityCard,
            password:hashedPassword});
        await workflowClient.trigger({
            url:`${config.env.prodApiEndpoint}/api/workflows/onboarding`,
            body: {
                email,
                fullName
            }
        });
        await signInWithCredentials({email,password});
        return {success:true,message:"User created successfully"}
    }
    catch(error){
        console.log(error,"Sign Up Error");
        return {success:false,message:"Something went wrong in SignUp"}
    }
}
