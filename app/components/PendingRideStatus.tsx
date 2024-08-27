"use client";
import { useEffect, useState } from 'react';
import { databases, Query } from '@/lib/appwrite';
import { BookingStatus } from '@/lib/rides';


const PendingRideStatus = ({ userId }: { userId: string }) => {
    const [pendingRides, setPendingRides] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPendingRides = async () => {
            try {
                const pendingBookings = await databases.listDocuments(
                    process.env.NEXT_PUBLIC_DB_ID as string,
                    process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
                    [
                        Query.equal('userId', userId),
                        Query.equal('status', BookingStatus.Pending),
                    ]
                );

                if (pendingBookings.documents.length > 0) {
                    const ridePromises = pendingBookings.documents.map((booking) =>
                        databases.getDocument(
                            process.env.NEXT_PUBLIC_DB_ID as string,
                            process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                            booking.rideId
                        )
                    );

                    const rides = await Promise.all(ridePromises);
                    setPendingRides(rides);
                }
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchPendingRides();
    }, [userId]);

    return (
        <div>
            <h1>Pending Ride Status</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {pendingRides.length > 0 ? (
                <ul>
                    {pendingRides.map((ride) => (
                        <li key={ride.$id}>
                            <p>Ride from {ride.pickupLocation} to {ride.dropoffLocation}</p>
                            <p>Status: Pending Approval</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending rides.</p>
            )}
        </div>
    );
};

export default PendingRideStatus;
