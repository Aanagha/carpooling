"use client";
import { useEffect, useState } from 'react';
import { databases, Query } from '@/lib/appwrite';
import { BookingStatus } from '@/lib/rides';
import { Clock, MapPin, CheckCircle } from 'lucide-react';

const PendingRideStatus = ({ userId }: { userId: string }) => {
    const [pendingRides, setPendingRides] = useState<any[]>([]);
    const [approvedRide, setApprovedRide] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                // Fetch pending bookings
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

                // Fetch approved bookings
                const approvedBookings = await databases.listDocuments(
                    process.env.NEXT_PUBLIC_DB_ID as string,
                    process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
                    [
                        Query.equal('userId', userId),
                        Query.equal('status', BookingStatus.Approved),
                    ]
                );

                if (approvedBookings.documents.length > 0) {
                    const approvedRide = await databases.getDocument(
                        process.env.NEXT_PUBLIC_DB_ID as string,
                        process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                        approvedBookings.documents[0].rideId
                    );

                    const currentTime = new Date().getTime();
                    const departureTime = new Date(approvedRide.departureTime).getTime();

                    // Display the approved ride only if the current time is before the departure time
                    if (currentTime < departureTime) {
                        setApprovedRide(approvedRide);
                    }
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, [userId]);

    // Return null if there are no rides to display
    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl shadow-lg p-6 md:p-8 max-w-full md:max-w-lg w-full">
                    <div className="animate-pulse">
                        <div className="flex items-center mb-4">
                            <div className="bg-gray-300 rounded-full h-6 w-6 mr-3" />
                            <div className="h-6 bg-gray-300 rounded w-32" />
                        </div>
                        <div className="h-5 bg-gray-300 rounded w-full mb-4" />
                        <div className="space-y-4">
                            <div className="h-5 bg-gray-300 rounded w-full" />
                            <div className="h-5 bg-gray-300 rounded w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (pendingRides.length === 0 && !approvedRide) {
        return null;
    }

    return (
        <div className="flex justify-center items-center p-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl shadow-lg p-6 md:p-8 max-w-full md:max-w-lg w-full transition-transform transform hover:scale-105 hover:shadow-2xl">
                {approvedRide && (
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <CheckCircle className="text-green-600 h-6 w-6 mr-3" />
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Approved Ride</h1>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-2">
                                <MapPin className="text-green-600 h-5 w-5 mr-2" />
                                <p className="text-md md:text-lg font-semibold text-gray-700">
                                    <span className="text-gray-900">{approvedRide.pickupLocation}</span> to <span className="text-gray-900">{approvedRide.dropoffLocation}</span>
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Clock className="text-gray-600 h-5 w-5 mr-2" />
                                <p className="text-md md:text-lg font-semibold text-gray-600">
                                    Departure Time: <span className="text-gray-900">{new Date(approvedRide.departureTime).toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {pendingRides.length > 0 && (
                    <>
                        <div className="flex items-center mb-6">
                            <MapPin className="text-yellow-600 h-6 w-6 mr-3" />
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Pending Ride Status</h1>
                        </div>
                        <ul className="space-y-4">
                            {pendingRides.map((ride) => (
                                <li key={ride.$id} className="bg-yellow-100 p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-2">
                                        <MapPin className="text-yellow-600 h-5 w-5 mr-2" />
                                        <p className="text-md md:text-lg font-semibold text-gray-700">
                                            Ride from <span className="text-gray-900">{ride.pickupLocation}</span> to <span className="text-gray-900">{ride.dropoffLocation}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="text-gray-600 h-5 w-5 mr-2" />
                                        <p className="text-md md:text-lg font-semibold text-gray-600">
                                            Status: <span className="text-gray-900">Pending Approval</span>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default PendingRideStatus;
