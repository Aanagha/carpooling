"use client";
import Image from "next/image";

import { DrawerDemo } from "./components/DrawerDemo";

import RideList from "./components/RidesList";
import OfferRide from "./components/OfferRide";

import { Profile } from "./components/Profile";
import ActiveRides from "./components/ActiveRides";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { Loader } from "lucide-react";


export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await account.get();
        setUser(userData);
        console.log(userData);
      } catch (error) {
        console.error("User not logged in:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if(loading){
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={40} />
      </div>
    )
  }
  return (
    <>
      <header className="text-white p-2 relative overflow-hidden">
        <div className="z-10 w-full max-w-5xl mx-auto items-center justify-between font-mono text-sm flex flex-row">
        <div className="flex items-center">
          <Image src="vercel.svg" alt="Logo" width={100} height={1-0} />
        </div>
       <div className="flex flex-row gap-4">
        
        <Profile/>
       
       </div>
        </div>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-between py-6 px-4 sm:px-6">
        <div className="h-full w-full dark:bg-background bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_95%,black)]"></div>
      
         {!user ?  <section className="text-center flex flex-col items-center h-[80dvh] lg:justify-center py-10">
            <blockquote className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-shadow">Ride Together, Save Together!</blockquote>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-shadow">Discover the convenience of carpooling, reduce fuel costs, and enhance your  experience.</p>
            <div className="flex flex-row justify-center items-center gap-6">
              <DrawerDemo action rideType="Offer ride" variant="default" bc="white"  title="Offer a Ride"><OfferRide/></DrawerDemo>
              <DrawerDemo action rideType="join ride" variant="outline" bc="black"  title="Join a Ride"><RideList  /></DrawerDemo>
            </div>
           
          </section> : <ActiveRides  userId={user?.$id} /> }
        </div>
    
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
        {/* <section id="features" className="py-12 sm:py-16 md:py-20 w-full">
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
        </section> */}
     
        <section className="py-12 sm:py-16 md:py-20 w-full">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-16" >Best Practices</h2>
            <div className="space-y-12 sm:space-y-0 sm:flex sm:justify-between">
              {[
                { title: "Be Respectful", description: "Treat your fellow riders with respect and kindness.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" },
                { title: "Communicate Clearly", description: "Keep your fellow riders informed about any changes or updates.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" },
                { title: "Be Punctual", description: "Arrive on time to ensure a smooth ride for everyone.", icon: "/icons/fun-3d-cartoon-teenage-boy.jpg" }
              ].map((practice, index) => (
                <div key={index} className="relative flex flex-col items-center sm:w-1/3"  >
                  <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold z-10 mb-4">
                    {index + 1}
                  </div>
                 
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">{practice.title}</h3>
                  <p className="text-gray-600 text-center">{practice.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Carpooling App. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center">
            <a href="#" className="text-gray-400 hover:text-white mx-2 mb-2">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2 mb-2">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2 mb-2">Contact Us</a>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-white"><Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} /></a>
          </div>
        </div>
      </footer>
    </>
  );
}


