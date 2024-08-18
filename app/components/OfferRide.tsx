import * as React from "react";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { createRide } from '@/lib/rides';
import { toast } from "sonner";
import { account } from "@/lib/appwrite";

const OfferRide: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);


  React.useEffect(() => {
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
  const { handleSubmit, control } = useForm({
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
      departureTime: "",
      seats: 1,
      vehicleType: "",
      vehicleNumber: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const rideData = {
        ...data,
        status: "active",
        offeredBy:user.$id,
        seats: Number(data.seats) // Ensure seats is always a number
      };
      console.log(rideData);
      await createRide(rideData);
      setMessage('Ride successfully created!');
      toast(message);
    } catch (error) {
      console.error('Failed to create ride:', error);
      setMessage('Failed to create ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading){
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
    <div className="mx-auto w-full max-w-lg">
      <div className="p-4 pb-0">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                <Controller
                  name="pickupLocation"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter pickup location"
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Drop-off Location</label>
                <Controller
                  name="dropoffLocation"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter drop-off location"
                      required
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                <Controller
                  name="departureTime"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="datetime-local"
                      {...field}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Seats</label>
                <Controller
                  name="seats"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      min={1}
                      max={8}
                      required
                      value={field.value ? Number(field.value) : ''}
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                <Controller
                  name="vehicleType"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter vehicle type"
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                <Controller
                  name="vehicleNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      maxLength={8}
                      placeholder="Enter vehicle number"
                      required
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-4 w-50">
            Offer Ride
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OfferRide;
