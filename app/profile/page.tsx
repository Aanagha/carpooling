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

        // Fetch rides booked by the user
        const bookedRidesResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID as string,
          process.env.NEXT_PUBLIC_COLLECTION_ID as string,
          [Query.equal('bookedBy', user.$id)]
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
      <div className="loader">
        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg  p-4">
      <Button className='mb-4 hover:border-2' variant="link"><ArrowLeft className='mr-2'/><a href="/">BACK</a></Button>

      {user ? (
        <>
          <UserInfo user={user} />
          {/* <Notifications userId={user.$id} /> */}
          <Tabs defaultValue="Booked" className='border-2 border-black mt-8 p-6 bg-gray-100' >
      <TabsList className="grid grid-cols-2 w-75  w-[280px]  items-center mx-auto justify-center">
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
                  
                  {/* Add more fields as needed */}
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
              {bookedRides.map((ride) => (
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
                  <p><strong>Offered By:</strong> {ride.offeredBy}</p>
                  <p><strong>Booked By:</strong> {ride.bookedBy}</p>
                  {/* Add more fields as needed */}
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
