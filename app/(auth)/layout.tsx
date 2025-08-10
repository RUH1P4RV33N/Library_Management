import React from "react";
import { ReactNode } from "react";
import Image from "next/image";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

const Layout =  async ({children}:{children:ReactNode}) => {
    const session= await auth();
    if(session)
        redirect('/');

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3">
          <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
          <h1>BookWorm</h1>
          </div>
          <div className="auth-content">
            {children}
          </div>
        </div>
      </section>
      <section className="auth-illustration">
        <Image
          src="/images/auth-illustration.png"
          alt="auth illustration"
          width={1000}
          height={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  );
};
export default Layout;
