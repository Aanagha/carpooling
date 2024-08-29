"use client";
import React, { useEffect, useState } from "react";
import { account, client, databases, Query } from "@/lib/appwrite";
import RideStatus from "./RideStatus";
import Hero from "./Hero";
import { BookingStatus } from "@/lib/rides";
import ApprovedBooking from "./ApprovedBooking";
import PendingBooking from "./PendingBooking";

interface User {
  $id: string;
  name: string;
}

const RideAndHeroManager: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndRides = async () => {
      try {
        const userData = await account.get();
        setUser(userData as User);

        if (userData) {
          // Fetch the active ride offered by the user
          const offeredRides = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DB_ID as string,
            process.env.NEXT_PUBLIC_COLLECTION_ID as string,
            [Query.equal("offeredBy", userData.$id)]
          );

          if (offeredRides.documents.length > 0) {
            const ride = offeredRides.documents[0];
            const currentTime = new Date().getTime();
            const departureTime = new Date(ride.departureTime).getTime();

            if (currentTime >= departureTime && ride.status !== "completed") {
              ride.status = "completed";
              await databases.updateDocument(
                process.env.NEXT_PUBLIC_DB_ID as string,
                process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                ride.$id,
                { status: "completed" }
              );
            }

            setActiveRide(ride);
          } else {
            // Check if the user has any bookings
            const userBookings = await databases.listDocuments(
              process.env.NEXT_PUBLIC_DB_ID as string,
              process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
              [Query.equal("userId", userData.$id)]
            );

            if (userBookings.documents.length > 0) {
              const bookingData = userBookings.documents[0];
              if (bookingData.status === BookingStatus.Rejected) {
                // If the booking is rejected, don't set it, and redirect to Hero
                setBooking(null);
                return;
              } else {
                setBooking(bookingData);
              }
            }
          }
        }
      } catch (error) {
        console.error("User not logged in or failed to fetch rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRides();

    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_DB_ID}.collections.${process.env.NEXT_PUBLIC_COLLECTION_ID}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          fetchUserAndRides();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4" />
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-6" />
            <div className="h-48 bg-gray-300 rounded-lg mb-4" />
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
            <div className="h-6 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (activeRide) {
    return <RideStatus ride={activeRide} user={user} />;
  }

  if (booking && booking.status === BookingStatus.Approved) {
    return <ApprovedBooking booking={booking}  />;
  }
  if (booking && booking.status === BookingStatus.Pending) {
    return <PendingBooking booking={booking}  />;
  }
  return <Hero user={user} />;
};

export default RideAndHeroManager;
