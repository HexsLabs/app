"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";


export const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="h-screen bg-[#101012] flex flex-col">
      <div className="p-4 mt-5">
        <Link href="/">
        <div className="flex space-x-2">
        <Image src="Hexs1.svg" alt="dasboard-logo" width={40} height={40} />
        <Image src="Hexs.svg" alt="dasboard-logo" width={100} height={100} />
        </div>
          
        </Link>
      </div>

      <nav className="flex-1 flex flex-col justify-center space-y-4 p-4">


      <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white"
          onClick={() => router.push("/create")}
        >
          {/* <Image src="Vector.svg" alt="dasboard-logo" width={20} height={40} /> */}
          Create
        </Button>
       
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white"
            onClick={() => router.push("/")}
          >
            {/* <Image
              src="Vector3.svg"
              alt="dasboard-logo"
              width={20}
              height={40}
            /> */}
            Dashboard
          </Button>
        

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white"
          onClick={() => router.push("/templates")}
        >
          {/* <Image src="Vector.svg" alt="dasboard-logo" width={20} height={40} /> */}
          {/* <LayoutTemplate /> */}
          Templates
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white"
          onClick={() => router.push("/chatbot")}
        >
          {/* <Image src="Vector.svg" alt="dasboard-logo" width={20} height={40} /> */}
          AI
        </Button>


      </nav>

      <div className="p-4">{/* Bottom section if needed */}</div>
    </div>
  );
};
