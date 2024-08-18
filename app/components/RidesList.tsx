import { fetchRides } from '@/lib/rides';
import { useEffect, useState } from 'react';
import { reserveRide, confirmRide } from '@/lib/rides';
import { useActiveAccount } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
const RideList = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const activeWallet = useActiveAccount();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
  

 
   useEffect(() => {
        if (activeWallet) {
          setWalletAddress(activeWallet.address);
        } else {
          setWalletAddress(null);
        }
      }, [activeWallet]);
    useEffect(() => {
        const loadRides = async () => {
            setIsLoading(true);
            try {
                const response = await fetchRides();
                setRides(response.documents);
                console.log('Fetched rides:', response.documents); // Log the rides list after fetch
            } catch (error) {
                console.error('Failed to fetch rides:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadRides();
    }, []);
    const handleConfirmRide = async (rideId: string) => {
        if (!walletAddress) {
            setMessage('Wallet address is required to confirm ride.');
            return;
        }
        try {
            const response = await confirmRide(rideId, walletAddress);
            setMessage('Ride successfully confirmed!');
        } catch (error:any) {
            setMessage(`Failed to confirm ride: ${error.message}`);
        }
    };
    const handleReserveRide = async (rideId: string) => {
        if (!walletAddress) {
            setMessage('Wallet address is required to reserve ride.');
            return;
        }
        try {
            const response = await reserveRide(rideId, walletAddress);
            setMessage('Ride successfully reserved!');
        } catch (error:any) {
            setMessage(` ${error.message}`);
        }
    };
    return (
        <div className="flex flex-wrap justify-center gap-4">
            {isLoading ? (
                <div className="loader">
                    <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 
                </div>
            ) : (
                rides.filter(ride => ride.status === 'active').length > 0 ? (
                    rides.filter(ride => ride.status === 'active').map((ride) => (
                        <div key={ride.$id} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white m-4">
                            <div className="px-2 py-4">
                                <div className='flex flex-row  justify-between'>
                                    <div className="font-bold text-xl mb-2">{ride.pickupLocation} to {ride.dropoffLocation}</div>
                                    <span className={`inline-block bg-${ride.status === 'active' ? 'green' : 'red'}-500 text-white text-xs leading-5 font-semibold rounded-full py-1 px-3 mr-2 mb-2`}>
                                        {ride.status}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-base">
                                    Departure: {new Date(ride.departureTime).toLocaleString()}
                                </p>
                                <p className="text-gray-700 text-base">
                                    Vehicle: {ride.vehicleType} ({ride.vehicleNumber})
                                </p>
                                <p className="text-gray-700 text-base">
                                    Seats Available: {ride.seats}
                                </p>
                               
                            <Button onClick={() => handleReserveRide(ride.$id)}>Reserve</Button>
                      
                                 {/* {ride.status === 'reserved' && ride.bookedBy.includes(walletAddress) && (
                            <Button onClick={() => handleConfirmRide(ride.$id)}>Confirm</Button>
                        )} */}
                            </div>
                            {message && <p>{message}</p>}
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
                )
            )}
        </div>
    );
};

export default RideList;
