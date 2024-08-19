'use client';

import { useEffect, useState } from 'react';
import { databases, Query } from '@/lib/appwrite';

const ActiveRides = ({ userId }: { userId: string }) => {
    const [ridesByStatus, setRidesByStatus] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        const fetchRides = async () => {
            try {
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

                // Categorize rides by their status
                const categorizedRides = allRides.reduce((acc: { [key: string]: any[] }, ride: any) => {
                    const status = ride.status || 'unknown';
                    if (!acc[status]) {
                        acc[status] = [];
                    }
                    acc[status].push(ride);
                    return acc;
                }, {});

                setRidesByStatus(categorizedRides);
            } catch (error) {
                console.error('Failed to fetch rides:', error);
            }
        };

        fetchRides();
    }, [userId]);

    return (
        <div className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Your Rides</h2>
            {Object.keys(ridesByStatus).length > 0 ? (
                Object.keys(ridesByStatus).map((status) => (
                    <div key={status} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 capitalize">{status} Rides</h3>
                        {ridesByStatus[status].map((ride) => (
                            <div key={ride.$id} className="mb-4 p-2 border rounded">
                                <h4 className="font-bold">{ride.pickupLocation} to {ride.dropoffLocation}</h4>
                                <p><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
                                <p><strong>Status:</strong> {ride.status}</p>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No active rides.</p>
            )}
        </div>
    );
};

export default ActiveRides;
