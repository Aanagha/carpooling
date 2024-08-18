import React from 'react'

const RideButton = ({ridetype}: {ridetype: string}) => {
  return (

<button className="cursor-pointer relative group overflow-hidden border-2 px-8 py-2 border-green-500">
  <span className="font-bold text-white text-xl relative z-10 group-hover:text-green-500 duration-500">{ridetype}</span>
  <span className="absolute top-0 left-0 w-full bg-green-500 duration-500 group-hover:-translate-x-full h-full"></span>
  <span className="absolute top-0 left-0 w-full bg-green-500 duration-500 group-hover:translate-x-full h-full"></span>
  
    <span className="absolute top-0 left-0 w-full bg-green-500 duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
  <span className="absolute delay-300 top-0 left-0 w-full bg-green-500 duration-500 group-hover:translate-y-full h-full"></span>
</button>
  )
}

export default RideButton