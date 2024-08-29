import React from 'react'
import { Profile } from './Profile'
import Image from "next/image";

const Header = () => {
  return (
    <header className="text-white p-2 relative overflow-hidden">
    <div className="z-10 w-full max-w-5xl mx-auto items-center justify-between font-mono text-sm flex flex-row">
    <div className="flex items-center p-4 lg:p-0">
      <Image src="/logo2.jpg" alt="Logo" width={35} height={30} />
      <Image src="/title.jpg" alt="Logo" width={120} height={30} />
      {/* <h1 className='text-black font-bold text-xl roboto-font ml-3'>Carpooling</h1> */}
    </div>
   <div className="flex flex-row gap-4">
    
    <Profile/>
   
   </div>
    </div>
  </header>
  )
}

export default Header