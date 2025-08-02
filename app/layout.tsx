import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
const ibmPlexSans = localFont({
  src:[
    {path: "./fonts/IBMPlexSans-Medium.ttf", weight: "400", style: "normal"},
    {path: "./fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal"},
    {path: "./fonts/IBMPlexSans-Regular.ttf", weight: "700", style: "italic"},
    {path: "./fonts/IBMPlexSans-SemiBold.ttf", weight: "700", style: "italic"},
  ]
});

const babasNueue=localFont({
  src:[
    {path: "./fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal"},
  ],
  variable: "--babas-neue",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookWise",
  description: "BookWise is a library management system",
};

const RootLayout=({ children }: { children: ReactNode })=>{
  return (
    <html lang="en">
    <body
      className={` ${ibmPlexSans.className} ${babasNueue.variable} antialiased`}
    >
    {children}
    <Toaster toastOptions={
      {
        style: {
          background: 'white',


        },
      }
    }/>
    </body>
    </html>
  );
}
export default RootLayout
