"use client"
import React, { useEffect, useState } from 'react';
import { client, databases } from '@/lib/appwrite';
import { BookingStatus,  } from '@/lib/rides';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { User, Clock } from 'lucide-react';

interface RideStatusProps {
  ride: any;
  user: any;
}

const RideStatus: React.FC<RideStatusProps> = ({ ride, user }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (ride.bookedBy && ride.bookedBy.length > 0) {
          const bookingResponses = await Promise.all(
            ride.bookedBy.map(async (bookingId: string) => {
              const booking = await databases.getDocument(
                process.env.NEXT_PUBLIC_DB_ID as string,
                process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
                bookingId
              );

              const userDoc = await databases.getDocument(
                process.env.NEXT_PUBLIC_DB_ID as string,
                process.env.NEXT_PUBLIC_USER_COLLECTION_ID as string,
                booking.userId
              );

              return {
                ...booking,
                userName: userDoc.username,
              };
            })
          );
          setBookings(bookingResponses);
        }
      } catch (err: any) {
        setError('Fetch error: ' + err.message);
      }
    };

    fetchBookings();

    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_DB_ID}.collections.${process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          fetchBookings();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [ride]);

  const approveRequest = async (bookingId: string) => {
    try {
      const updatedBooking = { status: BookingStatus.Approved };

      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DB_ID as string,
        process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
        bookingId,
        updatedBooking
      );

      const updatedRide = {
        availableSeats: ride.availableSeats - 1,
        status: ride.availableSeats - 1 === 0 ? 'filled' : 'active',
      };

      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DB_ID as string,
        process.env.NEXT_PUBLIC_COLLECTION_ID as string,
        ride.$id,
        updatedRide
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking.$id === bookingId
            ? { ...booking, status: BookingStatus.Approved }
            : booking
        )
      );

      toast.success('Booking approved.');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const renderStatus = () => {
    const userBooking = bookings.find((booking) => booking.userId === user.$id);

    if (ride.offeredBy === user.$id) {
      // Offerer view
      switch (ride.status) {
        case 'active':
          return (
            <div>
              <h1 className="text-xl font-bold mb-4">Ride Status: Active</h1>
              <p>Seats Available: {ride.availableSeats}</p>
              {bookings.some((booking) => booking.status === BookingStatus.Pending) && (
                <>
                  <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
                  <ul>
                    {bookings
                      .filter((booking) => booking.status === BookingStatus.Pending)
                      .map((booking) => (
                        <li key={booking.$id} className="mb-4">
                          <div className="flex justify-between items-center">
                            <span className="bg-yellow-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                              <User className="text-yellow-600 h-4 w-4 mr-2" />
                              {booking.userName}
                            </span>
                            <Button onClick={() => approveRequest(booking.$id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
                              Approve
                            </Button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </div>
          );
        case 'filled':
          return (
            <div>
              <h1 className="text-xl font-bold mb-4">Ride Status: Filled</h1>
              <p>The ride is fully booked and will depart at {new Date(ride.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}.</p>
            </div>
          );
        case 'completed':
          return null
        default:
          return null;
      }
    } else {
      // Booker view
      if (userBooking) {
        switch (userBooking.status) {
          case BookingStatus.Pending:
            return (
              <div>
                <h1 className="text-xl font-bold mb-4">Ride Status: Pending</h1>
                <p>Your ride request is pending approval.</p>
              </div>
            );
          case BookingStatus.Approved:
            return (
              <div>
                <h1 className="text-xl font-bold mb-4">Ride Status: Active</h1>
                <p>
                  You have been approved for the ride. It will depart at{' '}
                  {new Date(ride.departureTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                  .
                </p>
              </div>
            );
          case 'completed':
            return (
              <div>
                <h1 className="text-xl font-bold mb-4">Ride Status: Completed</h1>
                <p>Your ride has been completed. Thank you for using our service!</p>
              </div>
            );
          default:
            return null;
        }
      }

      return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-600 to-green-400 p-4">
      <div className="backdrop-blur-2xl bg-white/40 rounded-xl shadow-lg p-6 md:p-8 max-w-full md:max-w-lg w-full transition-transform transform hover:scale-105 hover:shadow-2xl">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {ride && renderStatus()}
      </div>
    </div>
  );
};

export default RideStatus;
