import React from 'react'

const ProblemStatement = () => {
  return (
   <section id="features" className="py-12 sm:py-16 md:py-20 w-full">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12" >Solving Your Ride-Sharing Problems</h2>
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Problems</h3>
                <ul className="list-inside justify-center items-center flex flex-col lg:flex-row gap-6">
                  {[
                    { title: "Difficulty in Finding Rides", description: "Students often struggle to find a ride every day.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" },
                    { title: "Lack of Ride Status", description: "When shared, there is no proper status of the ride.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" },
                    { title: "Peak Hour Rush", description: "During peak hours, it gets too rushy to find a ride.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" }
                  ].map((_, index) => (
                    <li key={index} className="mb-2"  >
                     
<div
  className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden"
>
  <div className="w-24 h-24 bg-violet-500 rounded-full absolute -right-5 -top-7">
    <p className="absolute bottom-6 left-7 text-white text-2xl">02</p>
  </div>
  <div className="fill-violet-500 w-12">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 24 24"
    >
      <path
        d="m24,6.928v13.072h-11.5v3h5v1H6.5v-1h5v-3H0V4.5c0-1.379,1.122-2.5,2.5-2.5h12.98c-.253.295-.54.631-.856,1H2.5c-.827,0-1.5.673-1.5,1.5v14.5h22v-10.993l1-1.079Zm-12.749,3.094C19.058.891,19.093.855,19.11.838c1.118-1.115,2.936-1.113,4.052.002,1.114,1.117,1.114,2.936,0,4.052l-8.185,8.828c-.116,1.826-1.623,3.281-3.478,3.281h-5.59l.097-.582c.043-.257,1.086-6.16,5.244-6.396Zm2.749,3.478c0-1.379-1.122-2.5-2.5-2.5-2.834,0-4.018,3.569-4.378,5h4.378c1.378,0,2.5-1.121,2.5-2.5Zm.814-1.073l2.066-2.229c-.332-1.186-1.371-2.057-2.606-2.172-.641.749-1.261,1.475-1.817,2.125,1.117.321,1.998,1.176,2.357,2.277Zm.208-5.276c1.162.313,2.125,1.134,2.617,2.229l4.803-5.18c.737-.741.737-1.925.012-2.653-.724-.725-1.908-.727-2.637,0-.069.08-2.435,2.846-4.795,5.606Z"
      ></path>
    </svg>
  </div>
  <h1 className="font-bold text-xl">UI / UX Creative Desing</h1>
  <p className="text-sm text-zinc-500 leading-6">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse fuga
    adipisicing elit
  </p>
</div>

                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Solutions</h3>
                <ul className="list-none list-inside">
                  {[
                    { title: "Organized Rides", description: "Our app organizes rides and maintains proper status and updates.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" },
                    { title: "Easy Ride Tracking", description: "Using our app, users can easily track available rides as per their convenience in time and vehicle.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" }
                  ].map((_, index) => (
                    <li key={index} className="mb-2"  >
                       <svg viewBox="0 0 300 300" width='500' height='500' xmlns="http://www.w3.org/2000/svg">
  <path fill="#FF0066" d="M44.2,-46.9C52.8,-35.5,52.3,-17.8,43.8,-8.6C35.2,0.7,18.6,1.3,10,13C1.3,24.6,0.7,47.2,-2.5,49.7C-5.6,52.2,-11.2,34.5,-20.9,22.9C-30.6,11.2,-44.3,5.6,-52.4,-8.1C-60.5,-21.8,-62.9,-43.6,-53.2,-54.9C-43.6,-66.2,-21.8,-67.1,-2,-65.1C17.8,-63.1,35.5,-58.2,44.2,-46.9Z" transform="translate(100 100)" />
</svg>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section> 
  )
}

export default ProblemStatement