import { fetchRides } from '@/lib/rides';
import { useEffect, useState } from 'react';
import { reserveRide } from '@/lib/rides';
import { Button } from '@/components/ui/button';
import { account } from '@/lib/appwrite';
import { toast } from 'sonner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const RideList = () => {
  const [rides, setRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<number | null>(null);

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
        const filteredRides = response.documents.filter((ride) => ride.seats > 0); // Filter out rides with 0 seats
        setRides(filteredRides);
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRides();
  }, []);

  const handleReserveRide = async (rideId: string) => {
    if (!user) {
      setMessage('Please login first to reserve a ride.');
      toast.info(message);
      return;
    }
    if (!selectedSeats) {
      setMessage('Please select the number of seats to reserve.');
      toast.info(message);
      return;
    }
    try {
      await reserveRide(rideId, user.$id, selectedSeats);
      setMessage(`Ride successfully reserved for ${selectedSeats} seats!`);
      toast.success(message);
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ScrollArea className='m-auto lg:h-auto  h-[550px] w-50'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-2">
       
       {rides.filter((ride) => ride.status === 'active').length > 0 ? (
            rides.filter((ride) => ride.status === 'active').map((ride) => (
              <div key={ride.$id} className="max-w-sm md:max-w-lg lg:max-w-xl rounded-lg overflow-hidden border-2 bg-white transition-transform transform hover:scale-105">
                <div className="px-6 py-4">
                  <div className="flex flex-row justify-between">
                    <h3 className="font-bold text-xl mb-2 text-gray-800">
                      {ride.pickupLocation} to {ride.dropoffLocation}
                    </h3>
                    <span className={`inline-block bg-${ride.status === 'active' ? 'green' : 'red'}-500 text-white text-xs leading-5 font-semibold rounded-lg p-1.5`}>
                      {ride.status}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Departure: {new Date(ride.departureTime).toLocaleString()}
                  </p>
                  <p className="text-gray-600">Vehicle: {ride.vehicleType}</p>
                  <p className="text-gray-600">Seats Available: {ride.seats}</p>
                </div>

                <div className="px-6 py-4 flex flex-wrap items-center justify-center">
                  <label htmlFor="seats" className="text-gray-700 text-sm font-medium">Select number of seats:</label>
                  <div className="flex flex-wrap space-x-4 ml-4">
                    
                    {ride.seats.map((seat:number) => (
                      <label key={seat} className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="seats"
                          value={seat}
                          onChange={() => setSelectedSeats(seat)}
                          className="form-radio text-blue-600 h-4 w-4"
                          required
                        />
                        <span className="ml-2 text-gray-700">{seat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4">
                  <Button onClick={() => handleReserveRide(ride.$id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out">
                    Reserve
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white m-4">
              <div className="px-2 py-4">
                <p className="text-gray-700 text-base">
                  No rides available now.
                </p>
              </div>
            </div>
          )}
           
  
        </div>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};

export default RideList;
