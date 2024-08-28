"use client";
import { useEffect, useState } from 'react';
import { client, databases } from '@/lib/appwrite';
import { BookingStatus } from '@/lib/rides';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, User, Users } from 'lucide-react';

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
                        response.bookedBy.map(async (bookingId: string) => {
                            const booking = await databases.getDocument(
                                process.env.NEXT_PUBLIC_DB_ID as string,
                                process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
                                bookingId
                            );

                            // Fetch the user's details based on userId
                            const user = await databases.getDocument(
                                process.env.NEXT_PUBLIC_DB_ID as string,
                                process.env.NEXT_PUBLIC_USER_COLLECTION_ID as string,
                                booking.userId
                            );

                            return {
                                ...booking,
                                userName: user.username, // Assuming the user document has a 'username' field
                            };
                        })
                    );
                    setBookings(bookingResponses);
                }
            } catch (err: any) {
                setError('Fetch error: ' + err.message);
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

    // Check if the current time is before the departure time
    const isBeforeDeparture = ride ? new Date().getTime() < new Date(ride.departureTime).getTime() : false;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-600 to-green-400 p-4">
            <div className="backdrop-blur-2xl bg-white/40 rounded-xl shadow-lg p-6 md:p-8 max-w-full md:max-w-lg w-full transition-transform transform hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center mb-6">
                    <Users className="text-blue-600 h-6 w-6 mr-3" />
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Ride Status</h1>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {ride && isBeforeDeparture && (
                    <div>
                        <div className="flex items-center mb-4">
                            <Clock className="text-gray-600 h-5 w-5 mr-2" />
                            <p className="text-md md:text-lg font-semibold text-gray-600">
                                Status: <span className="text-gray-900">{ride.status}</span>
                            </p>
                        </div>
                        <div className="flex items-center mb-6">
                            <CheckCircle className="text-blue-600 h-5 w-5 mr-2" />
                            <p className="text-md md:text-lg font-semibold text-gray-600">
                                Seats Available: <span className="text-gray-900">{ride.availableSeats}</span>
                            </p>
                        </div>
                        <p className="text-md md:text-lg font-semibold text-gray-600 mb-4">Approved Users:</p>
                        <ul className="mb-6">
                            {bookings
                                .filter((booking) => booking.status === BookingStatus.Approved)
                                .map((booking) => (
                                    <li key={booking.$id} className="text-gray-800 flex items-center">
                                        <User className="text-gray-600 h-4 w-4 mr-2" />
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                            {booking.userName}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                        {bookings.some((booking) => booking.status === BookingStatus.Pending) && (
                            <>
                                <h2 className="text-md md:text-lg font-semibold text-gray-600 mb-4">Pending Requests:</h2>
                                <ul>
                                    {bookings
                                        .filter((booking) => booking.status === BookingStatus.Pending)
                                        .map((booking) => (
                                            <li key={booking.$id} className="mb-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-800 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                                        <User className="text-yellow-600 h-4 w-4 mr-2" />
                                                        {booking.userName}
                                                    </span>
                                                    <Button onClick={() => approveRequest(booking.$id)} className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
                                                        Approve
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
                {!isBeforeDeparture && <p className="text-lg font-semibold text-gray-600">This ride has already departed.</p>}
            </div>
        </div>
    );
}
