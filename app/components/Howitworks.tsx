import React from 'react'

const Howitworks = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 w-full">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-16" >How It Works</h2>
      <div className="space-y-12 sm:space-y-0 sm:flex sm:justify-between p-6 gap-4">
        {[
          { title: "Offer a Ride", description: "Fill out the ride details and offer your ride to others.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" },
          { title: "Join a Ride", description: "Search for available rides and book your seat.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" },
          { title: "Enjoy the Ride", description: "Meet your driver, hop in, and enjoy your journey.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" }
        ].map((_, index) => (
   
<div key={index}
className="group hover:-rotate-0 [transform:rotate3d(1_,-1,_1,_15deg)] duration-500 overflow-hidden bg-white p-6 rounded-lg hover:shadow-lg [box-shadow:12px_12px_0px_0px_#0d0d0d] backdrop-filter backdrop-blur-md border border-neutral-600"
>
<div className="flex items-center justify-between">

<svg
xmlns="http://www.w3.org/2000/svg"
width="48px"
height="48px"
viewBox="0 0 24 24"
fill="none"
className="absolute -top-2 -right-2 w-12 h-12 stroke-yellow-300"
>
<path
  d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
  stroke=""
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
></path>
</svg>
</div>
<div className="mt-4">
<p className="text-4xl font-bold text-white">22°C</p>
<div className="flex items-center justify-between gap-1">
<span className="mr-2 text-neutral-800">Feels Like</span>
<span className="text-white">20°C</span>
</div>
<div className="flex items-center justify-between gap-1">
<span className="text-neutral-800">Wind</span>
<span className="text-white">10 km/h</span>
</div>
<div className="flex items-center justify-between gap-1">
<span className="text-neutral-800">Humidity</span>
<span className="text-white">75%</span>
</div>
</div>
</div>

        ))}
      </div>
    </div>
  </section>
  )
}

export default Howitworks