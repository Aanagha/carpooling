'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import Notifications from '../components/Notifications';
import ActiveRides from '../components/ActiveRides';
import UserInfo from '../components/UserInfo';
import RideStatus from '../components/RideStatus';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="mx-auto w-full max-w-lg p-4">
          <Button onClick={logout} variant="outline">Logout</Button>
      {user ? (
        <UserInfo user={user}/>
      ) : (
        <p>User not found.</p>
      )}
      <Notifications userId={user?.$id} />
      <ActiveRides  userId={user?.$id} />
{/* <RideStatus status={user.status} departureTime={user.departureTime}/> */}
    </div>
  );
};

export default ProfilePage;
