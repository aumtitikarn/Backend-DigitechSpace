"use client";

import Header from "../component/Header";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  

  return (
    <main className="bg-[#FBFBFB]">
      <Header />
        <div className="lg:mx-60 mt-10 mb-5">
          
        </div>
       
    </main>
  );
}
