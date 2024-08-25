import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { createRide } from '@/lib/rides';
import { toast } from "sonner";
import { account } from "@/lib/appwrite";
import { RideSelect } from "./RideSelect";

const OfferRide: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [pickupOptions, setPickupOptions] = React.useState<string[]>([]);
  const [pickupLocation, setPickupLocation] = React.useState<string>('');
  const [dropoffLocation, setDropoffLocation] = React.useState<string>('');

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
        const options = ["demoOption1", "demoOption2", "demoOption3"];
        setPickupOptions(options);
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
        offeredBy: user.$id,
        seats: Number(data.seats),
        pickupLocation: pickupLocation,
        dropoffLocation: dropoffLocation,
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
      <div className="flex flex-col items-center justify-center h-screen">
        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 sm:px-2 lg:px-2 mt-6 ">
      <div className="p-4 pb-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <div className="p-8 border-2 border-gray-300 shadow-2xl rounded-lg">
              <ol className="relative border-l border-gray-300 dark:border-gray-700">
                <li className="mb-10 ml-4">
                  <span className="absolute flex mt-1.5 items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <div className="p-1 bg-blue-600 rounded-full"></div>
                  </span>
                  <RideSelect displaytext="Select pickup location..." location={pickupLocation} onLocationChange={(location) => setPickupLocation(location)} />
                </li>
                <li className="ml-4">
                  <span className="absolute flex mt-1.5 items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <div className="p-1 bg-blue-600 rounded-full"></div>
                  </span>
                  <RideSelect displaytext="Select drop location..." location={dropoffLocation} onLocationChange={(location) => setDropoffLocation(location)} />
                </li>
              </ol>
            </div>

            <div>
              <label htmlFor="departureTime" className="block text-base mb-2 font-medium">Departure Time</label>
              <Controller
                name="departureTime"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center">
                    <input
                      id="departureTime"
                      type="time"
                      {...field}
                      className="w-full p-2 border text-background border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}
              />
            </div>

            <div>
              <label className="block text-base mb-2 font-medium ">Number of Seats</label>
              <Controller
                name="seats"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-row space-x-8">
                    {[1, 2, 3].map((seat) => (
                      <label key={seat} className="inline-flex items-center space-x-4   blur-background bg-white/10 rounded-md p-2 border border-gray-300 shadow-sm cursor-pointer hover:border-blue-500 w-1/3 text-center">
                        <input
                          {...field}
                          type="radio"
                          name="seats"
                          value={seat}
                          className="form-radio text accent-ring "
                          required
                        />
                        <span className="text-md font-medium text-background">{seat}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div>
              <label className="block text-base mb-2 font-medium ">Vehicle Type</label>
              <Controller
                name="vehicleType"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-row space-x-4">
                    <label className="inline-flex items-center text-background space-x-6 bg-white rounded-md p-4 border border-gray-300 shadow-sm cursor-pointer hover:border-blue-500 w-1/2 text-center">
                      <input
                        {...field}
                        type="radio"
                        name="vehicleType"
                        value="Auto"
                        className="form-radio accent-black"
                        required
                      />
                      <span className="text-lg font-medium">Auto</span>
                    </label>
                    <label className="inline-flex items-center text-background space-x-6 bg-white rounded-md p-4 border border-gray-300 shadow-sm cursor-pointer hover:border-blue-500 w-1/2 text-center">
                      <input
                        {...field}
                        type="radio"
                        name="vehicleType"
                        value="cab"
                        className="form-radio accent-black "
                        required
                      />
                      <span className="text-lg font-medium">Cab</span>
                    </label>
                  </div>
                )}
              />
            </div>
          </div>

          <Button type="submit"  className="mt-4 w-full bg-blue-600  text-gray-200">
              Offer Ride
            </Button>
        </form>
      </div>
    </div>
  );
};

export default OfferRide;
