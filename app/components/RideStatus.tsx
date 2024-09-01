'use client';

import React, { useEffect, useState } from 'react';
import { databases, client } from '@/lib/appwrite';
import { BookingStatus } from '@/lib/rides';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { User, Car, Truck, Clock, MapPin } from 'lucide-react';
import { adjustTime } from '@/lib/utils';

interface RideStatusProps {
  ride: any;
  user: any;
}

const RideStatus: React.FC<RideStatusProps> = ({ ride, user }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentRide, setCurrentRide] = useState(ride);

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
      (response: any) => {
        if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          fetchBookings();
          if (response.payload.status !== currentRide.status) {
            setCurrentRide(response.payload);
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

      setCurrentRide((prev: any) => ({
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

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'cab':
        return <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="13" width="18" height="8" rx="2" ry="2"></rect><path d="M5 13V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"></path><circle cx="12" cy="17" r="1"></circle><circle cx="7" cy="17" r="1"></circle><circle cx="17" cy="17" r="1"></circle></svg>
        ;
      case 'auto':
        return  <svg xmlns="http://www.w3.org/2000/svg" width={30} shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 358.64"><path fill-rule="nonzero" d="M61.57 229.35v-65.22c0-1.04.25-2.02.68-2.88L110.2 36.47c6.19-14.13 12.72-23.16 21.52-28.82C140.57 1.96 151.13 0 165.42 0h259.29c18.57.08 33.49 4.18 44.38 12.74 11.12 8.75 17.8 21.86 19.59 39.74l22.78 218.03c1.25 14.27.45 25.27-3.74 33.07-4.74 8.81-12.97 13.18-26.14 12.97-3.46-.05-6.24-2.84-6.31-6.28-.6-29.82-15.18-49.72-34.14-59.2-8.18-4.09-17.2-6.27-26.26-6.49-9.04-.22-18.14 1.52-26.49 5.25-19.28 8.61-34.69 28.06-36.78 58.94-.23 3.39-3.06 5.99-6.41 5.99l-223.28.01c-2.4 24.63-23.16 43.87-48.41 43.87-25.48 0-46.38-19.58-48.48-44.51H6.43c-3.55 0-6.43-2.88-6.43-6.44l.05-.77c1.19-38.02 19.77-61.79 43.36-72.27 5.81-2.58 11.93-4.34 18.16-5.3zM308.28 54.46v210.55h14.35l28.48-66.93c.13-.3.28-.59.45-.86 5.06-8.91 9.78-14.04 15.85-17.09 6.04-3.04 12.63-3.64 21.73-3.64h26.8l.67.04c2.45.02 4.57-.26 6.34-.84 1.62-.54 3-1.38 4.1-2.49.72-.72 1.36-1.61 1.9-2.65.5-.93.92-2.01 1.27-3.22V65.77c0-3.1-1.28-5.92-3.33-7.98-2.06-2.05-4.89-3.33-7.98-3.33H308.28zm-12.87 210.55V54.46h-95.38c-3.09 0-5.92 1.28-7.98 3.34-2.05 2.05-3.33 4.88-3.33 7.97V253.7c0 3.1 1.28 5.93 3.33 7.98l.27.28a11.19 11.19 0 0 0 5.87 2.9v-18.2c0-3.24.05-5.89.36-8.78.3-2.76.84-5.5 1.81-8.86l.08-.32c1.17-3.97 2.68-7.49 4.58-10.56 2.01-3.24 4.42-5.95 7.27-8.12 3.62-2.76 6.66-4.19 9.94-4.95 3.12-.73 5.97-.76 9.65-.76h26.35l8.46-89.15c.33-3.52 3.46-6.11 6.99-5.78 3.52.33 6.11 3.46 5.78 6.99l-8.97 94.44v54.2h24.92zM60.57 327.1c-.19.18-.39.34-.61.47A22.13 22.13 0 0 0 70.64 332c-.07-.25-.1-.51-.1-.77v-14.1l-9.97 9.97zm-4.65-3.57c.12-.22.28-.43.47-.62l9.96-9.96H52.26c-.27 0-.53-.04-.77-.11a22.11 22.11 0 0 0 4.43 10.69zm20.54-20.69 9.96-9.96c.19-.19.4-.35.62-.48-3.04-2.34-6.7-3.91-10.69-4.42.07.24.11.5.11.77v14.09zm14.62-6.39c-.13.22-.29.42-.47.61l-9.97 9.97h14.09c.27 0 .53.03.77.1-.51-3.99-2.08-7.65-4.42-10.68zm-.47 26.46c.18.19.34.4.47.62 2.34-3.04 3.91-6.7 4.42-10.69-.24.07-.5.11-.77.11H80.64l9.97 9.96zm-3.57 4.66c-.22-.13-.43-.29-.62-.47l-9.96-9.97v14.1c0 .26-.04.52-.11.77 4-.52 7.65-2.09 10.69-4.43zm-20.69-20.54-9.96-9.97c-.19-.19-.35-.39-.47-.61a22.034 22.034 0 0 0-4.43 10.68c.24-.07.5-.1.77-.1h14.09zm-6.39-14.63c.22.13.42.29.61.48l9.97 9.96v-14.09c0-.27.03-.53.1-.77-3.99.51-7.65 2.08-10.68 4.42zm61.41 8.86h13.17c-2.07-27.17-16.82-45.46-35.38-54.1-8-3.73-16.67-5.69-25.31-5.84-8.67-.14-17.33 1.52-25.26 5.04-18.18 8.07-32.74 26.11-35.36 54.9h12.4c4.11-22.71 23.97-39.92 47.87-39.92 23.89 0 43.75 17.21 47.87 39.92zm279.57 25.84a3.1 3.1 0 0 1-.61.47 22.13 22.13 0 0 0 10.68 4.43c-.06-.25-.1-.51-.1-.77v-14.1l-9.97 9.97zm-4.65-3.57c.13-.22.28-.43.47-.62l9.97-9.96h-14.1c-.26 0-.52-.04-.77-.11a22.11 22.11 0 0 0 4.43 10.69zm20.54-20.69 9.96-9.96c.19-.19.4-.35.62-.48a22.017 22.017 0 0 0-10.69-4.42c.07.24.11.5.11.77v14.09zm14.62-6.39c-.13.22-.28.42-.47.61l-9.97 9.97h14.1c.26 0 .52.03.77.1-.51-3.99-2.09-7.65-4.43-10.68zm-.47 26.46c.19.19.34.4.47.62a22.11 22.11 0 0 0 4.43-10.69c-.25.07-.51.11-.77.11h-14.1l9.97 9.96zm-3.57 4.66c-.22-.13-.43-.29-.62-.47l-9.96-9.97v14.1c0 .26-.04.52-.1.77a22.13 22.13 0 0 0 10.68-4.43zm-20.68-20.54-9.97-9.97c-.19-.19-.34-.39-.47-.61a22.034 22.034 0 0 0-4.43 10.68c.25-.07.51-.1.77-.1h14.1zm-6.4-14.63c.22.13.43.29.61.48l9.97 9.96v-14.09c0-.27.04-.53.1-.77-3.99.51-7.65 2.08-10.68 4.42zm13.54-31.06c26.87 0 48.65 21.78 48.65 48.65 0 26.87-21.78 48.65-48.65 48.65-26.87 0-48.65-21.78-48.65-48.65 0-26.87 21.78-48.65 48.65-48.65zm29.22-101.65h43.88l-11.05-105.9c-1.41-14.21-6.45-24.4-14.77-30.95-8.56-6.73-20.83-9.95-36.44-10l-259.29.03c-11.85 0-20.3 1.43-26.76 5.58-6.49 4.17-11.57 11.45-16.71 23.14l-.77 2.02c6.79.34 12.69 2.01 17.44 5.5 6.79 5 10.74 13.2 10.92 25.77 0 23.82.51 48.16.02 71.9.17 4.92-.25 9.23-1.59 12.91h27.88V65.77c0-6.64 2.73-12.69 7.11-17.07 4.38-4.38 10.42-7.11 17.07-7.11h218.88c6.65 0 12.7 2.73 17.08 7.11 4.37 4.37 7.1 10.42 7.1 17.07v93.92zm45.21 12.72c-.44.09-.89.15-1.36.15h-44.91c-.49 1.4-1.06 2.73-1.72 3.98-1.14 2.15-2.53 4.06-4.16 5.71-2.52 2.53-5.58 4.4-9.18 5.6-3.17 1.05-6.72 1.55-10.62 1.5l-27.21.01c-7.26 0-12.3.37-16 2.23-3.56 1.79-6.65 5.35-10.35 11.83l-29.84 70.13a6.439 6.439 0 0 1-6.08 4.33H200.03c-6.43 0-12.31-2.57-16.66-6.72l-.42-.38c-4.38-4.38-7.1-10.43-7.1-17.08v-81.14h-49.44c-.7.01-1.42.01-2.16 0H74.44v55.95c10.36.23 20.69 2.58 30.15 6.99 22.84 10.63 40.89 33.11 42.83 66.41h191.93c4-32.85 21.81-53.97 43.8-63.8 10.11-4.51 21.1-6.62 32.03-6.35 10.91.27 21.79 2.9 31.68 7.85 21.41 10.71 38.2 32.13 40.88 63.67 4.25-.82 7.05-2.76 8.67-5.79 2.84-5.28 3.27-14 2.25-25.88l-10.36-99.2zM76.57 159.69h50.95c3.72-.22 6.03-1.07 7.29-2.49 1.62-1.84 2.09-5.25 1.93-9.9l-.05-.76V74.96c-.1-8.02-2.15-12.91-5.66-15.49-3.38-2.49-8.48-3.31-14.79-3.01L76.57 159.69zm181.05 57.49h-25.74c-2.87 0-5.06.01-6.74.4-1.52.36-3.06 1.12-5.06 2.64-1.62 1.24-3 2.79-4.16 4.66-1.26 2.04-2.31 4.52-3.16 7.44l-.09.26c-.73 2.53-1.13 4.59-1.35 6.66-.22 2.07-.26 4.43-.26 7.42v18.35h46.56v-47.83z"/></svg>

      default:
        return <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="13" width="18" height="8" rx="2" ry="2"></rect><path d="M5 13V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"></path><circle cx="12" cy="17" r="1"></circle><circle cx="7" cy="17" r="1"></circle><circle cx="17" cy="17" r="1"></circle></svg>

    }
  };

  const renderStatus = () => {
    const userBooking = bookings.find((booking) => booking.userId === user.$id);

    if (currentRide.offeredBy === user.$id) {
      switch (currentRide.status) {
        case 'active':
          return (
            <div>
              <div className="flex items-center mb-4">
                <span className="text-sm bg-green-200 p-2 rounded-full font-bold">Active</span>
              </div>
              <p>Seats Available: {currentRide.availableSeats}</p>
              {bookings.some((booking) => booking.status === BookingStatus.Pending) && (
                <>
                  <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
                  <ul className="space-y-4">
                    {bookings
                      .filter((booking) => booking.status === BookingStatus.Pending)
                      .map((booking) => (
                        <li key={booking.$id} className="flex justify-between items-center p-4 bg-yellow-100 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <User className="text-yellow-600 h-5 w-5" />
                            <span className="text-gray-800">{booking.userName}</span>
                          </div>
                          <div className="flex space-x-4">
                            <Button onClick={() => approveRequest(booking.$id)} className="bg-green-600 text-white px-3 py-2 rounded-lg">
                              Approve
                            </Button>
                            <Button onClick={() => rejectRequest(booking.$id)} className="bg-red-600 text-white px-3 py-2 rounded-lg">
                              Reject
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
              <div className="flex items-center mb-4">
                <span className="text-sm bg-blue-200 p-2 rounded-full font-bold">Filled</span>
              </div>
              <p>The ride is fully booked and will depart at {adjustTime(currentRide.departureTime)}.</p>
              <h2 className="text-lg font-semibold mt-4">Poolers :</h2>
              <ul className="space-y-2 mt-2">
                {bookings
                  .filter((booking) => booking.status === BookingStatus.Approved)
                  .map((booking) => (
                    <li key={booking.$id} className="flex items-center space-x-2">
                      <User className="text-green-600 h-5 w-5" />
                      <span className="text-gray-900 font-medium">{booking.userName}</span>
                    </li>
                  ))}
              </ul>
            </div>
          );
        case 'completed':
          return (
            <div>
              <div className="flex items-center mb-4">
                <span className="text-sm bg-gray-200 p-2 rounded-full font-bold">Completed</span>
              </div>
              <p>The ride has been completed.</p>
            </div>
          );
        default:
          return null;
      }
    } else {
      if (userBooking) {
        switch (userBooking.status) {
          case BookingStatus.Pending:
            return (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-sm bg-red-200 p-2 rounded-full font-bold">Pending</span>
                </div>
                <p>Your ride request is pending approval.</p>
              </div>
            );
          case BookingStatus.Approved:
            return (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-sm bg-blue-200 p-2 rounded-full font-bold">Active</span>
                </div>
                <p>You have been approved for the ride. It will depart at {adjustTime(currentRide.departureTime)}.</p>
              </div>
            );
          case BookingStatus.Rejected:
            return (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-sm bg-red-200 p-2 rounded-full font-bold">Rejected</span>
                </div>
                <p>Your ride request has been rejected.</p>
              </div>
            );
          case 'completed':
            return (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-sm bg-gray-200 p-2 rounded-full font-bold">Completed</span>
                </div>
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
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-r from-blue-50 to-green-50">
      <div className="backdrop-blur-xl border rounded-xl shadow-lg p-6 md:p-8 max-w-full md:max-w-lg w-full transition-transform transform hover:scale-105 hover:shadow-2xl bg-white">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {currentRide && (
          <>
            {getVehicleIcon(currentRide.vehicleType)}
            {renderStatus()}
            <div className="mt-4">
              <p className="text-sm text-gray-600"><MapPin className="inline-block mr-2 text-gray-600" /> From: {currentRide.pickupLocation}</p>
              <p className="text-sm text-gray-600"><MapPin className="inline-block mr-2 text-gray-600" /> To: {currentRide.dropoffLocation}</p>
              <p className="text-sm text-gray-600"><Clock className="inline-block mr-2 text-gray-600" /> Departure: {adjustTime(currentRide.departureTime)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RideStatus;
