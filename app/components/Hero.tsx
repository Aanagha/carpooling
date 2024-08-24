"use client"
import React, { useEffect, useState } from 'react';
import { DrawerDemo } from './DrawerDemo';
import { Loader } from 'lucide-react';
import ActiveRides from './ActiveRides';
import OfferRide from './OfferRide';
import RideList from './RidesList';
import { account, databases, Query } from '@/lib/appwrite';
import { Cover } from '@/components/ui/cover';
import { Button } from '@/components/ui/button';
import Image from "next/image";
const Hero = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasActiveRides, setHasActiveRides] = useState(false);

    useEffect(() => {
        const fetchUserAndRides = async () => {
            try {
                const userData = await account.get();
                setUser(userData);

                // Fetch active rides if user is logged in
                if (userData) {
                    const offeredRides = await databases.listDocuments(
                        process.env.NEXT_PUBLIC_DB_ID as string,
                        process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                        [Query.equal('offeredBy', userData.$id)]
                    );

                    const reservedRides = await databases.listDocuments(
                        process.env.NEXT_PUBLIC_DB_ID as string,
                        process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                        [Query.search('bookedBy', userData.$id)]
                    );

                    const activeRides = [...offeredRides.documents, ...reservedRides.documents].filter(
                        (ride) => ride.status === 'active'
                    );

                    if (activeRides.length > 0) {
                        setHasActiveRides(true);
                    }
                }
            } catch (error) {
                console.error("User not logged in or failed to fetch rides:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndRides();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    return (
        <>
            {user && hasActiveRides ? (
                <ActiveRides userId={user.$id} username={user.name} />
            ) : (
                <section className="text-center flex flex-col lg:flex-row  h-[80vh] justify-between items-center px-4 lg:px-20">
                 <div className='lg:w-1/2'>
                 <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white ">
                   <Cover >Ride Together</Cover>,Save Together 
      </h1>
      <h2 className='justify-center text-center align-center text-bold my-3 '>
        Discover the convenience of carpooling, reduce fuel costs,and enhance your experience
      </h2>
                    <div className="flex flex-row justify-center items-center gap-6 mt-8">
                    <DrawerDemo trigger={  <Button
          className={`m-auto hover:border-t-4 border-black border-2 bg-white text-black hover:text-black rounded-tl-full rounded-br-full`}
          variant={'default'}
          size={'lg'}
        >
         Offer a Ride
        </Button>}   variant="default" bc="white"  title="Offer a Ride"><OfferRide/></DrawerDemo>
        <DrawerDemo trigger={  <Button
          className={`m-auto border-t-4 bg-black text-white hover:text-black rounded-tl-full rounded-br-full`}
          variant={'default'}
          size={'lg'}
        >
         Join a Ride
        </Button>}   variant="default" bc="white"  title="Join a Ride"><RideList/></DrawerDemo>
            </div>
                 </div>
            
      <div className='my-4 items-center justify-center bg-yellow-800 rounded-full p-10'>
      <Image src="/poster.png" alt="Logo" width={185} height={180} />
      </div>
                </section>
            )}
              
        </>
    );
};

export default Hero;
