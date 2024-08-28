"use client";
import React, { useEffect, useState } from 'react';
import { DrawerDemo } from './DrawerDemo';
import { account, databases, Query } from '@/lib/appwrite';
import { Cover } from '@/components/ui/cover';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import { UserTabs } from './UserTabs';
import Register from './Register';
import RideStatus from './RideStatus';
import PendingRideStatus from './PendingRideStatus';
import { BookingStatus } from '@/lib/rides';

const Hero = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeRide, setActiveRide] = useState<any>(null);
    const [hasPendingRides, setHasPendingRides] = useState(false);

    useEffect(() => {
        const fetchUserAndRides = async () => {
            try {
                const userData = await account.get();
                setUser(userData);

                // Fetch the active ride offered by the user
                if (userData) {
                    const offeredRides = await databases.listDocuments(
                        process.env.NEXT_PUBLIC_DB_ID as string,
                        process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                        [
                            Query.equal('offeredBy', userData.$id),
                            Query.equal('status', 'active')
                        ]
                    );

                    if (offeredRides.documents.length > 0) {
                        setActiveRide(offeredRides.documents[0]);  // Assuming there's only one active ride
                    }

                    // Check if the user has any pending rides
                    const pendingRides = await databases.listDocuments(
                        process.env.NEXT_PUBLIC_DB_ID as string,
                        process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
                        [
                            Query.equal('userId', userData.$id),
                            Query.equal('status', BookingStatus.Pending)
                        ]
                    );

                    if (pendingRides.documents.length > 0) {
                        setHasPendingRides(true);
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
                <div className="w-full max-w-md mx-auto p-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4" />
                        <div className="h-6 bg-gray-300 rounded w-1/2 mb-6" />
                        <div className="h-48 bg-gray-300 rounded-lg mb-4" />
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
                        <div className="h-6 bg-gray-300 rounded w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    const renderComponentBasedOnStatus = () => {
        if (!activeRide) return null;

        switch (activeRide.status) {
            case 'active':
                return <RideStatus rideId={activeRide.$id} />;
            case 'pending':
                return <PendingRideStatus userId={user.$id} />;
            case 'filled':
                return (
                    <div className="flex justify-center items-center h-screen">
                        <h1 className="text-3xl">This ride is filled.</h1>
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex justify-center items-center h-screen">
                        <h1 className="text-3xl">This ride is completed.</h1>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {activeRide ? (
                renderComponentBasedOnStatus()
            ) : (
                <>
                {!user ? (
                    <section className="text-center flex flex-col lg:flex-row  h-[80vh] justify-between items-center px-4 lg:px-20">
                        <div className='lg:w-1/2'>
                            <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white ">
                                <Cover>Ride Together</Cover>, Save Together
                            </h1>
                            <h2 className='text-center align-center text-bold my-3'>
                                Discover the convenience of carpooling, reduce fuel costs, and enhance your experience
                            </h2>
                            <DrawerDemo 
                                trigger={  
                                    <Button
                                        className="m-auto hover:border-t-4 border-white hover:border-black border-2  bg-black text-white hover:text-black rounded-tl-full rounded-br-full"
                                        variant="default"
                                        size="lg"
                                    >
                                        Get started
                                    </Button>}   
                                variant="default" 
                                bc="black"  
                                title="Sign up"
                            >
                                <Register />
                            </DrawerDemo>
                        </div>

                        <div className='my-4 items-center justify-center bg-yellow-800 rounded-full p-10'>
                            <Image src="/poster.png" alt="Logo" width={185} height={180} />
                        </div>
                    </section>
                ) : (
                    <div className='m-auto items-center justify-center px-3'>
                        <h1 className='text-3xl text-center lg:text-6xl mb-4 font-bold'>
                            Welcome !<br /> <Cover className='italic capitalize'>{user.name}</Cover>
                        </h1>
                        <p className='text-center text-lg text-gray-600 mb-6'>
                            Hop in ! Connect with your next carpool
                        </p>
                        
                        {!hasPendingRides && <UserTabs />}
                        <PendingRideStatus userId={user.$id} />
                    </div>
                )}
                </> 
            )}
        </>
    );
};

export default Hero;
