import React from 'react'
import { Profile } from './Profile'
import Image from "next/image";

const Header = () => {
  return (
    <header className="text-white p-2 relative overflow-hidden">
    <div className="z-10 w-full max-w-5xl mx-auto items-center justify-between font-mono text-sm flex flex-row">
    <div className="flex items-center">
      <Image src="vercel.svg" alt="Logo" width={100} height={1} />
    </div>
   <div className="flex flex-row gap-4">
    
    <Profile/>
   
   </div>
    </div>
  </header>
  )
}

export default Header