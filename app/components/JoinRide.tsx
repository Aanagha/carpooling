"use client"
import React, { useEffect, useState } from "react";
import { fetchRides, joinRide } from '@/lib/rides';
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Car, Clock, Terminal, Users } from "lucide-react";
import { adjustTime, displayISTTime } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const JoinRide: React.FC = () => {
  const [rides, setRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        console.error("User not logged in:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const loadRides = async () => {
      setIsLoading(true);
      try {
        const response = await fetchRides();
        const activeRides = response.filter((ride: any) => 
          ride.status === 'active' && ride.bookedBy.length < ride.availableSeats
        );
        setRides(activeRides);
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRides();
  }, []);

  const handleReserveRide = async (rideId: string) => {
    try {
      const message = await joinRide(rideId, user);
      toast.success(message);
      setRides(prevRides => prevRides.map(r => r.$id === rideId ? { ...r, availableSeats: r.availableSeats - 1 } : r));
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Failed to join the ride.');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-3xl">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <ScrollArea>
          <h1 className="text-3xl font-bold mb-8 text-center">Available Rides</h1>
          {rides.length > 0 ? (
            <div className="grid gap-8">
              {rides.map((ride) => (
                <div key={ride.$id} className="bg-white dark:bg-gray-800 rounded-xl blur-background bg-white/20 border border-black overflow-hidden transition-all hover:shadow-xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {ride.pickupLocation} to {ride.dropoffLocation}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ride.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {ride.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {adjustTime(ride.departureTime)}
                      </p>
                      <p className="flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        {ride.vehicleType}
                      </p>
                      <p className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {ride.availableSeats - ride.bookedBy.length} seats available
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleReserveRide(ride.$id)} 
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out"
                    >
                      Reserve Ride
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
              <Terminal className="h-5 w-5" />
              <AlertDescription className="ml-2">
                No rides available at the moment. Why not create a new ride?
              </AlertDescription>
            </Alert>
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      )}
    </div>
  );
};

export default JoinRide;
