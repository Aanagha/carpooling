"use client"
import React, { useEffect, useState } from 'react';
import { DrawerDemo } from './DrawerDemo';
import { Loader } from 'lucide-react';
import ActiveRides from './ActiveRides';
import OfferRide from './OfferRide';
import RideList from './RidesList';
import { account, databases, Query } from '@/lib/appwrite';

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
                <ActiveRides userId={user.$id} />
            ) : (
                <section className="text-center flex flex-col items-center h-[80vh] lg:justify-center py-10">
                    <blockquote className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-shadow">
                        Ride Together, Save Together!
                    </blockquote>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-shadow">
                        Discover the convenience of carpooling, reduce fuel costs, and enhance your experience.
                    </p>
                    <div className="flex flex-row justify-center items-center gap-6">
              <DrawerDemo  action rideType="Offer ride" variant="default" bc="white"  title="Offer a Ride"><OfferRide/></DrawerDemo>
              <DrawerDemo  action rideType="join ride" variant="outline" bc="black"  title="Join a Ride"><RideList  /></DrawerDemo>
            </div>
                </section>
            )}
        </>
    );
};

export default Hero;
