'use client';

import { useEffect, useState } from 'react';
import { databases, Query } from '@/lib/appwrite';

const ActiveRides = ({ userId }: { userId: string }) => {
    const [activeRides, setActiveRides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndUpdateRides = async () => {
            setIsLoading(true);
            try {
                const now = new Date();

                // Fetch all rides offered or reserved by the user
                const offeredRides = await databases.listDocuments(
                    process.env.NEXT_PUBLIC_DB_ID as string,
                    process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                    [Query.equal('offeredBy', userId)]
                );

                const reservedRides = await databases.listDocuments(
                    process.env.NEXT_PUBLIC_DB_ID as string,
                    process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                    [Query.search('bookedBy', userId)]
                );

                const allRides = [...offeredRides.documents, ...reservedRides.documents];

                // Update status to 'completed' if departure time has passed
                const updatedRides = await Promise.all(allRides.map(async (ride) => {
                    const departureTime = new Date(ride.departureTime);
                    if (departureTime <= now && ride.status !== 'completed') {
                        await databases.updateDocument(
                            process.env.NEXT_PUBLIC_DB_ID as string,
                            process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                            ride.$id,
                            { status: 'completed' }
                        );
                        ride.status = 'completed'; // Update the status locally
                    }
                    return ride;
                }));

                // Filter out active rides
                const activeRides = updatedRides.filter((ride) => ride.status === 'active');

                setActiveRides(activeRides);
            } catch (error) {
                console.error('Failed to fetch or update rides:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndUpdateRides();

        // Optional: Set an interval to refresh every minute or so
        const interval = setInterval(fetchAndUpdateRides, 60000); // 60 seconds
        return () => clearInterval(interval);

    }, [userId]);

    // Don't render the component if there are no active rides and loading is complete
    if (!isLoading && activeRides.length === 0) {
        return null;
    }

    return (
        <div className="p-6 flex flex-col items-center">
            {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="ml-4 text-gray-500">Loading active rides...</p>
                </div>
            ) : (
                activeRides.map((ride) => (
                    <div key={ride.$id} className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6 transition-transform transform hover:scale-105 hover:shadow-xl">
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">{ride.pickupLocation} to {ride.dropoffLocation}</h4>
                        <p className="text-gray-500 text-sm mb-1"><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
                        <p className="text-gray-500 text-sm mb-1"><strong>Status:</strong> <span className={`inline-block px-2 py-1 rounded-full text-white text-xs ${ride.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>{ride.status}</span></p>
                        <p className="text-gray-500 text-sm"><strong>Vehicle:</strong> {ride.vehicleType}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ActiveRides;
