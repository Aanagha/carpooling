import React from 'react'

const Howitworks = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 w-full">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-16" >How It Works</h2>
      <div className="sm:justify-between p-2 gap-8 flex flex-col lg:flex-row justify-center items-center ">
        {[
          { title: "Register", description: "Create an account in minutes using your email.", bg:'bg-white' },
          { title: "Find a Ride", description: " Browse available carpool options or  Offer a ride: post your own ride.", bg:'bg-[#CBF08E]' },
          { title: "Reserve", description: "Use our in-app coordinate with your carpool buddies, confirm the ride, and set pick-up locations.", bg:'bg-gray-200' }
        ].map((data, index) => (
   
<div key={index}
  className="relative rounded-lg -skew-x-6  -translate-y-6 hover:-translate-y-1 hover:-translate-x-0 hover:skew-x-0  w-72 h-44 p-0.5 bg-neutral-600 card-compact hover:bg-base-200 transition-all duration-200  mt-6"
>
  <figure className="w-full h-full">
    <div
      
      className={`${data.bg} text-neutral-50 min-h-full rounded-lg border border-opacity-5`}
    ></div>
  </figure>
  <div className="absolute text-nuetral-800 top-12 left-0 px-4">
    <span className="font-bold ">{data.title}</span>
    <p className="text-sm mt-2 opacity-60 line-clamp-3">
     {data.description}
    </p>
  </div>
</div>



        ))}
      </div>
    </div>
  </section>
  )
}

export default Howitworks