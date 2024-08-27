"use client";
import { useEffect, useState } from 'react';
import { client, databases } from '@/lib/appwrite';
import { BookingStatus } from '@/lib/rides';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';


export default function RideStatus({ rideId }: { rideId: any }) {
    const [ride, setRide] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRide = async () => {
            try {
                const response = await databases.getDocument(
                    process.env.NEXT_PUBLIC_DB_ID as string,
                    process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                    rideId
                );
                setRide(response);

                // Fetch bookings for this ride
                if (response.bookedBy && response.bookedBy.length > 0) {
                    const bookingResponses = await Promise.all(
                        response.bookedBy.map((bookingId: string) =>
                            databases.getDocument(
                                process.env.NEXT_PUBLIC_DB_ID as string,
                                process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
                                bookingId
                            )
                        )
                    );
                    setBookings(bookingResponses);
                }
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

    const approveRequest = async (bookingId: string) => {
        try {
            // Update the booking status to 'Approved'
            const updatedBooking = {
                status: BookingStatus.Approved,
            };
    
            await databases.updateDocument(
                process.env.NEXT_PUBLIC_DB_ID as string,
                process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
                bookingId,
                updatedBooking
            );
    
            // Remove metadata fields from ride before updating
            const { $id, $createdAt, $updatedAt, $databaseId, $collectionId, ...rideData } = ride;
    
            // Decrement the seats in the ride document
            const updatedRide = {
                ...rideData,
                availableSeats: ride.availableSeats - 1,
            };
    
            if (updatedRide.availableSeats === 0) {
                updatedRide.status = 'filled';
            }
    
            await databases.updateDocument(
                process.env.NEXT_PUBLIC_DB_ID as string,
                process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                rideId,
                updatedRide
            );
    
            // Refresh bookings
            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.$id === bookingId
                        ? { ...booking, status: BookingStatus.Approved }
                        : booking
                )
            );
    
            setRide(updatedRide);
            toast.info("Ride successfully approved");
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        }
    };
    

    return (
        <div>
            <h1>Ride Status</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {ride && (
                <div>
                    <p>Status: {ride.status}</p>
                    <p>Seats Available: {ride.availableSeats}</p>
                    <p>
                        Approved Users:{" "}
                        {bookings
                            .filter((booking) => booking.status === BookingStatus.Approved)
                            .map((booking) => booking.userId)
                            .join(', ')}
                    </p>
                    <h2>Pending Requests</h2>
                    <ul>
                        {bookings
                            .filter((booking) => booking.status === BookingStatus.Pending)
                            .map((booking) => (
                                <li key={booking.$id}>
                                    {booking.userId}{" "}
                                    <br />
                                    <Button onClick={() => approveRequest(booking.$id)}>
                                        Approve
                                    </Button>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
