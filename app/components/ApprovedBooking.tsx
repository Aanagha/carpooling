import React, { useEffect, useState } from 'react';
import { databases } from '@/lib/appwrite';
import { adjustTime } from '@/lib/utils';

interface ApprovedBookingProps {
  booking: any;
}

const ApprovedBooking: React.FC<ApprovedBookingProps> = ({ booking }) => {
  const [departureTime, setDepartureTime] = useState<string | null>(null);
  const [offererName, setOffererName] = useState<string | null>(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const ride = await databases.getDocument(
          process.env.NEXT_PUBLIC_DB_ID as string,
          process.env.NEXT_PUBLIC_COLLECTION_ID as string,
          booking.rideId
        );
        setDepartureTime(ride.departureTime);

        const offerer = await databases.getDocument(
          process.env.NEXT_PUBLIC_DB_ID as string,
          process.env.NEXT_PUBLIC_USER_COLLECTION_ID as string,
          ride.offeredBy
        );
        setOffererName(offerer.username);
      } catch (error) {
        console.error('Failed to fetch ride details:', error);
      }
    };

    if (booking.rideId) {
      fetchRideDetails();
    }
  }, [booking.rideId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Booking Approved
        </h2>
        <div className="text-center">
          {departureTime ? (
            <p className="text-lg text-gray-700 mb-4">
              Your booking has been approved. The ride will depart at{' '}
              <span className="font-semibold text-gray-900">
                {adjustTime(departureTime).toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  hour12: true,
                })}
              </span>.
            </p>
          ) : (
            <p className="text-lg text-gray-700 mb-4">Loading departure time...</p>
          )}
          <p className="text-lg text-gray-700 mb-4">
            <strong>Offerer Name:</strong>{' '}
            <span className="font-semibold text-gray-900">
              {offererName || 'Loading...'}
            </span>
          </p>
          <p className="text-lg font-medium text-gray-800">
            <strong>Status:</strong>{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full">
              {booking.status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovedBooking;
