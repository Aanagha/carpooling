import { fetchRides } from '@/lib/rides';
import { useEffect, useState } from 'react';
import { reserveRide } from '@/lib/rides';
import { Button } from '@/components/ui/button';
import { account } from '@/lib/appwrite';
import { toast } from 'sonner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, Clock, Terminal, Users } from 'lucide-react';


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
    <div className="container mx-auto py-6 px-4 max-w-3xl">
    {isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    ) : (
      <ScrollArea className="h-[calc(100vh-120px)]">
        <h1 className="text-3xl font-bold mb-8 text-center">Available Rides</h1>
        {rides.filter((ride) => ride.status === 'active').length > 0 ? (
          <div className="grid gap-8">
            {rides.filter((ride) => ride.status === 'active').map((ride) => (
              <div key={ride.$id} className=" dark:bg-gray-800 rounded-xl blur-background border-2 border-black bg-white/20  overflow-hidden transition-all hover:shadow-xl">
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
                      {new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="flex items-center">
                      <Car className="w-4 h-4 mr-2" />
                      {ride.vehicleType}
                    </p>
                    <p className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {ride.seats} seats available
                    </p>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select number of seats:</p>
                    <div className="flex flex-wrap gap-3">
                      {Array.from({ length: ride.seats }, (_, index) => index + 1).map((seat) => (
                        <label key={seat} className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`seats-${ride.$id}`}
                            value={seat}
                            onChange={() => setSelectedSeats(seat)}
                            className="form-radio text-blue-600 h-4 w-4"
                            required
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{seat}</span>
                        </label>
                      ))}
                    </div>
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

export default RideList;
