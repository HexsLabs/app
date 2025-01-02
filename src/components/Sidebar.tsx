'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import Image from "next/image"
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="h-screen bg-[#101012] flex flex-col">
      {/* Logo at the top */}
      <div className="p-4 mt-5">
        <Link href="/">
        <Image 
                                src="logo.svg"
                                alt="dasboard-logo"
                                width={110}
                                height={110}
                              />
        </Link>
      </div>

      {/* Navigation buttons centered vertically */}
      <nav className="flex-1 flex flex-col justify-center space-y-4 p-4">
        <Link href="/">
        
      <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white">
         <Image 
           src="Vector3.svg"
           alt="dasboard-logo"
           width={20}
           height={40}
         />
          Dashboard
        </Button>
        </Link>
    
        <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white" onClick={() => router.push('/templates')}>
        <Image 
           src="Vector.svg"
           alt="dasboard-logo"
           width={20}
           height={40}
         />
          Templates
        </Button>

        
        <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white" onClick={() => router.push('/chatbot')}>
        <Image 
           src="Vector.svg"
           alt="dasboard-logo"
           width={20}
           height={40}
         />
          AI
        </Button>
      </nav>

      <div className="p-4">
        {/* Bottom section if needed */}
      </div>
    </div>
  );
};