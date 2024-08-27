"use client"
import { useEffect, useState } from 'react';
import { client, databases } from '@/lib/appwrite';

export default function RideStatus({ rideId }: { rideId: string }) {
    const [ride, setRide] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRide = async () => {
            try {
                const response = await databases.getDocument(
                    process.env.NEXT_PUBLIC_DB_ID as string,
                    process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                    rideId
                );
                setRide(response);  // Fix: setRide(response.documents) should be setRide(response)
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchRide();

        const unsubscribe = client.subscribe(
            `databases.${process.env.NEXT_PUBLIC_DB_ID}.collections.${process.env.NEXT_PUBLIC_COLLECTION_ID}.documents.${rideId}`,
            (response) => {
                if (response.payload) {
                    setRide(response.payload);
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, [rideId]);

    const approveRequest = async (userId: string) => {
        try {
            const updatedRide = {
                ...ride,
                bookedBy: ride.bookedBy.map((user: any) =>
                    user.userId === userId ? { ...user, status: 'Approved' } : user
                ),
                seats: ride.seats - 1,
            };

            if (updatedRide.seats === 0) {
                updatedRide.status = 'Filled';
            }

            await databases.updateDocument(
                process.env.NEXT_PUBLIC_DB_ID as string,
                process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                rideId,
                updatedRide
            );
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Ride Status</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {ride && (
                <div>
                    <p>Status: {ride.status}</p>
                    <p>Seats Available: {ride.seats}</p>
                    <p>
                        Joined Users:{" "}
                        {ride.bookedBy
                            .filter((user: any) => user.status === 'Approved')
                            .map((user: any) => user.userId)
                            .join(', ')}
                    </p>
                    <h2>Pending Requests</h2>
                    <ul>
                        {ride.bookedBy
                            .filter((user: any) => user.status === 'Pending')
                            .map((user: any) => (
                                <li key={user.userId}>
                                    {user.userId}{" "}
                                    <button onClick={() => approveRequest(user.userId)}>
                                        Approve
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
