'use client'
import React, { useEffect, useState } from 'react';
import { account, databases, Query } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

import UserInfo from '../components/UserInfo';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [offeredRides, setOfferedRides] = useState<any[]>([]);
  const [bookedRides, setBookedRides] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await account.get();
        setUser(userData);
        console.log(userData);
      } catch (error) {
        console.error("User not logged in:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRides = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch rides offered by the user
        const offeredRidesResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID as string,
          process.env.NEXT_PUBLIC_COLLECTION_ID as string,
          [Query.equal('offeredBy', user.$id)]
        );

        // Fetch bookings made by the user
        const bookedRidesResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID as string,
          process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string,
          [Query.equal('userId', user.$id)]
        );

        setOfferedRides(offeredRidesResponse.documents);
        setBookedRides(bookedRidesResponse.documents);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [user]);

  const logout = async () => {
    setLoading(true);
    try {
      await account.deleteSession("current"); // Logout the user
      setUser(null); // Clear user state
      toast('Logged out successfully!');
      window.location.href = '/';
    } catch (error) {
      console.error("Logout failed:", error);
      toast('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-300 rounded-lg mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg p-4">
      <Button className='mb-4 hover:border-2' variant="link"><ArrowLeft className='mr-2'/><a href="/">BACK</a></Button>

      {user ? (
        <>
          <UserInfo user={user} />
          <Tabs defaultValue="Booked" className='border-2 border-black mt-8 p-6 bg-gray-100' >
            <TabsList className="grid grid-cols-2 w-75 w-[280px] items-center mx-auto justify-center">
              <TabsTrigger value="Booked">Booked rides</TabsTrigger>
              <TabsTrigger value="Offered">Offered rides</TabsTrigger>
            </TabsList>
            <TabsContent value="Offered">
              <h2 className="text-xl font-bold mt-6">Rides Offered</h2>
              {offeredRides.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {offeredRides.map((ride) => (
                    <li key={ride.$id} className="border p-4 rounded-lg shadow-lg bg-white/80 blur-background">
                      <p><strong>Ride ID:</strong> {ride.$id}</p>
                      <p><strong>From:</strong> {ride.pickupLocation}</p>
                      <p><strong>To:</strong> {ride.dropoffLocation}</p>
                      <p><strong>Time :</strong><time>
                        {new Date(ride.$createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}, 
                        {new Date(ride.$createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </time></p>

                      {/* Fetch and display the bookings */}
                      <h3 className="mt-4 text-lg font-semibold">Bookings:</h3>
                      {ride.bookedBy && ride.bookedBy.length > 0 ? (
                        <ul>
                          {ride.bookedBy.map((bookingId: string) => (
                            <li key={bookingId}>
                              {/* Fetch booking details */}
                              {/* You can create a separate component or function to fetch and display booking details */}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No bookings for this ride.</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No rides offered.</p>
              )}
            </TabsContent>
            <TabsContent value="Booked">
              <h2 className="text-xl font-bold mt-6">Rides Booked</h2>
              {bookedRides.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {bookedRides.map((booking) => (
                    <li key={booking.$id} className="border p-4 rounded-lg shadow-lg bg-white/80 blur-background">
                      <p><strong>Booking ID:</strong> {booking.$id}</p>
                      <p><strong>Ride ID:</strong> {booking.rideId}</p>
                      <p><strong>Status:</strong> {booking.status}</p>
                      <p><strong>Time :</strong><time>
                        {new Date(booking.$createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}, 
                        {new Date(booking.$createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </time></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No rides booked.</p>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
