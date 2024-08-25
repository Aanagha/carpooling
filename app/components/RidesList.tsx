import { fetchRides } from '@/lib/rides';
import { useEffect, useState } from 'react';
import { reserveRide } from '@/lib/rides';
import { Button } from '@/components/ui/button';
import { account } from '@/lib/appwrite';
import { toast } from 'sonner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';


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
    <div className="container mx-auto py-2 px-4 w-[400px]">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ScrollArea className='m-auto lg:h-auto  w-50'>
        <div className="flex overflow-scroll flex-col gap-6 ">
       <h1 className='text-2xl font-bold italic'>Available rides</h1>
       {rides.filter((ride) => ride.status === 'active').length > 0 ? (
            rides.filter((ride) => ride.status === 'active').map((ride) => (
              <div key={ride.$id} className=" rounded-lg overflow-hidden  bg-white/10 blur-background border-[1px] border-black transition-transform transform ">
                <div className="px-6 py-4">
                  <div className="flex flex-row justify-between">
                    <h2 className="font-bold text-2xl mb-2 text-gray-800">
                      {ride.pickupLocation} to {ride.dropoffLocation}
                    </h2>
                    <span className={`inline-block bg-${ride.status === 'active' ? 'green' : 'red'}-500 text-white text-xs leading-6 font-semibold rounded-full p-2`}>
                      {ride.status}
                    </span>
                  </div>
                  <p className="text-background">
                  <span>
  {new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</span>

                  </p>
                  <p className="text-background">Vehicle: {ride.vehicleType}</p>
                  <p className="text-background">Seats Available: {ride.seats}</p>
                </div>

                <div className="px-6 py-4 flex flex-wrap items-center justify-center">
                  <label htmlFor="seats" className="text-gray-700 text-sm font-medium">Select number of seats:</label>
                  <div className="flex flex-wrap space-x-4 ml-4">
                    
                  {Array.from({ length: ride.seats }, (_, index) => index + 1).map((seat: number) => (
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
            <Alert>
            <Terminal className="h-4 w-4" />
            
            <AlertDescription className='mb-4'>
             No rides available for now. Make a new ride
            </AlertDescription>

          </Alert>
          )}
           
  
        </div>
        <ScrollBar orientation="vertical" className='lg:visible hidden' />
        </ScrollArea>
      )}
    </div>
  );
};

export default RideList;
