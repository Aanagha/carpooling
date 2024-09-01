"use client";
import React, { useEffect, useState } from 'react';
import { client, databases } from '@/lib/appwrite';
import { BookingStatus } from '@/lib/rides';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { adjustTime } from '@/lib/utils';

interface RideStatusProps {
  ride: any;
  user: any;
}

const RideStatus: React.FC<RideStatusProps> = ({ ride, user }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentRide, setCurrentRide] = useState(ride); // Added this line

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (currentRide.bookedBy && currentRide.bookedBy.length > 0) {
          const bookingResponses = await Promise.all(
            currentRide.bookedBy.map(async (bookingId: string) => {
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
      `databases.${process.env.NEXT_PUBLIC_DB_ID}.collections.${process.env.NEXT_PUBLIC_COLLECTION_ID}.documents.${currentRide.$id}`,
      (response:any) => {
        if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          fetchBookings();
          // Update the ride status if it's changed
          if (response.payload.status !== currentRide.status) {
            setCurrentRide(response.payload); // Update the ride state
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentRide]);

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
        availableSeats: currentRide.availableSeats - 1,
        status: currentRide.availableSeats - 1 === 0 ? 'filled' : 'active',
      };

      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DB_ID as string,
        process.env.NEXT_PUBLIC_COLLECTION_ID as string,
        currentRide.$id,
        updatedRide
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking.$id === bookingId
            ? { ...booking, status: BookingStatus.Approved }
            : booking
        )
      );

      setCurrentRide((prev:any) => ({
        ...prev,
        availableSeats: prev.availableSeats - 1,
        status: prev.availableSeats - 1 === 0 ? 'filled' : 'active',
      }));

      toast.success('Booking approved.');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const rejectRequest = async (bookingId: string) => {
    try {
      const updatedBooking = { status: BookingStatus.Rejected };

      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DB_ID as string,
        process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
        bookingId,
        updatedBooking
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking.$id === bookingId
            ? { ...booking, status: BookingStatus.Rejected }
            : booking
        )
      );

      toast.success('Booking rejected.');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const renderStatus = () => {
    const userBooking = bookings.find((booking) => booking.userId === user.$id);

    if (currentRide.offeredBy === user.$id) {
      // Offerer view
      switch (currentRide.status) {
        case 'active':
          return (
            <div>
              <span className="text-sm bg-green-200 p-2 rounded-full fixed top-4 right-4 font-bold mb-4">active</span>
              <p>Seats Available: {currentRide.availableSeats}</p>
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
                            <div className="flex flex-row gap-4">
                              <Button onClick={() => approveRequest(booking.$id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
                                Approve
                              </Button>
                              <Button onClick={() => rejectRequest(booking.$id)} className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition">
                                Reject
                              </Button>
                            </div>
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
              <span className="text-sm bg-blue-200 p-2 rounded-full fixed top-4 right-4 font-bold mb-4">filled</span>
              <p>The ride is fully booked and will depart at {adjustTime(currentRide.departureTime)}.</p>
              <h2 className="text-lg font-semibold mt-4">Poolers :</h2>
              <ul>
                {bookings
                  .filter((booking) => booking.status === BookingStatus.Approved)
                  .map((booking) => (
                    <li key={booking.$id} className="flex items-center mt-2">
                      <User className="text-green-600 h-4 w-4 mr-2" />
                      <span className="text-gray-900 font-medium">{booking.userName}</span>
                    </li>
                  ))}
              </ul>
            </div>
          );
        case 'completed':
          return (
            <div>
              <span className="text-sm bg-gray-200 p-2 rounded-full fixed top-4 right-4 font-bold mb-4">completed</span>
              <p>The ride has been completed.</p>
            </div>
          );
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
                <span className="text-sm bg-red-200 p-2 rounded-full fixed top-4 right-4 font-bold mb-4">pending</span>
                <p>Your ride request is pending approval.</p>
              </div>
            );
          case BookingStatus.Approved:
            return (
              <div>
                <span className="text-sm bg-blue-200 p-2 rounded-full fixed top-4 right-4 font-bold mb-4">active</span>
                <p>
                  You have been approved for the ride. It will depart at{' '}
                  {adjustTime(currentRide.departureTime)}
                  .
                </p>
              </div>
            );
          case BookingStatus.Rejected:
            return (
              <div>
                <span className="text-sm bg-red-200 p-2 rounded-full fixed top-4 right-4 font-bold mb-4">rejected</span>
                <p>Your ride request has been rejected.</p>
              </div>
            );
          case 'completed':
            return (
              <div>
                <span className="text-sm bg-gray-200 p-2 rounded-full fixed top-4 right-4 font-bold mb-4">completed</span>
                <p>Your ride has been completed.</p>
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
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="backdrop-blur-2xl border rounded-xl shadow-lg p-6 md:p-8 max-w-full md:max-w-lg w-full transition-transform transform hover:scale-105 hover:shadow-2xl">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {currentRide && renderStatus()}
        <p>From : {currentRide.pickupLocation}</p>
        <p>To : {currentRide.dropoffLocation}</p>
        <p>{adjustTime(currentRide.departureTime)}</p>
      </div>
    </div>
  );
};

export default RideStatus;
