import React, { useEffect, useState } from 'react';
import { getRideDetails } from '@/lib/rides'; // Assuming you have a function to fetch ride details
import { Button } from '@/components/ui/button';
import { adjustTime } from '@/lib/utils';

interface PendingBookingProps {
  booking: {
    rideId: string;
    userId: string;
    status: string;
    name: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
  };
}

const PendingBooking: React.FC<PendingBookingProps> = ({ booking }) => {
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const rideData = await getRideDetails(booking.rideId);
        setRide(rideData);
      } catch (err:any) {
        setError(err.message || 'Failed to fetch ride details');
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [booking.rideId]);

  if (loading) {
    return <div>Loading ride details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!ride) {
    return <div>No ride details found.</div>;
  }

  return (
    <div className="bg-white/20 blur-background border max-w-xl m-auto dark:bg-gray-800 rounded-xl p-6 shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Pending Booking</h2>
      <p className="mb-2"><strong>User:</strong> {booking.name}</p>
      <p className="mb-2"><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
      <p className="mb-2"><strong>Dropoff Location:</strong> {ride.dropoffLocation}</p>
      <p className="mb-2"><strong>Departure Time:</strong> {adjustTime(ride.departureTime)}</p>      <p className="mb-2"><strong>Status:</strong> {booking.status}</p>
   
    </div>
  );
};

export default PendingBooking;
