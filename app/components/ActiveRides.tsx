'use client';

import { useEffect, useState } from 'react';
import { databases, Query } from '@/lib/appwrite';

const ActiveRides = ({ userId }: { userId: string }) => {
    const [activeRides, setActiveRides] = useState<any[]>([]);

    useEffect(() => {
        const fetchAndUpdateRides = async () => {
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
            }
        };

        fetchAndUpdateRides();

        // Optional: Set an interval to refresh every minute or so
        const interval = setInterval(fetchAndUpdateRides, 60000); // 60 seconds
        return () => clearInterval(interval);

    }, [userId]);

    return (
        <div className="p-4 border rounded shadow-sm">
           
            {activeRides.length > 0 ? (
                activeRides.map((ride) => (
                    <div key={ride.$id} className="mb-4 p-2 border rounded">
                        <h4 className="font-bold">{ride.pickupLocation} to {ride.dropoffLocation}</h4>
                        <p><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
                        <p><strong>Status:</strong> {ride.status}</p>
                    </div>
                ))
            ) : (
                <p>No active rides.</p>
            )}
        </div>
    );
};

export default ActiveRides;
