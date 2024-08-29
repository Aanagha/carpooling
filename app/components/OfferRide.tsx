
"use client"
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { createRide } from '@/lib/rides';
import { toast } from "sonner";
import { account } from "@/lib/appwrite";
import { RideSelect } from "./RideSelect";

const OfferRide: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [dropoffLocation, setDropoffLocation] = useState<string>('');

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

  const { handleSubmit, control } = useForm({
    defaultValues: {
      departureTime: "",
      availableSeats: 1,
      vehicleType: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (pickupLocation === dropoffLocation) {
      toast.error('Pickup and drop-off locations cannot be the same.');
      return;
    }

    try {
      const rideData = {
        ...data,
        status: "active",
        offeredBy: user.$id,
        pickupLocation,
        dropoffLocation,
      };
      await createRide(rideData);
      toast('Ride successfully created!');
    } catch (error) {
      console.error('Failed to create ride:', error);
    }
  };

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
                  <RideSelect  displaytext="Select pickup location..." location={pickupLocation} onLocationChange={(location) => setPickupLocation(location)} />
                </li>
                <li className="ml-4">
                  <span className="absolute flex mt-1.5 items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <div className="p-1 bg-blue-600 rounded-full"></div>
                  </span>
                  <RideSelect  displaytext="Select drop location..." location={dropoffLocation} onLocationChange={(location) => setDropoffLocation(location)} />
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
              <label className="block text-base mb-2 font-medium ">Number of availableSeats</label>
              <Controller
                name="availableSeats"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-row space-x-8">
                    {[1, 2, 3].map((seat) => (
                      <label key={seat} className="inline-flex items-center space-x-4   blur-background bg-white/10 rounded-md p-2 border border-gray-300 shadow-sm cursor-pointer hover:border-blue-500 w-1/3 text-center">
                        <input
                          {...field}
                          type="radio"
                          name="availableSeats"
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

          <Button type="submit"  className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-gray-200">
              Offer Ride
            </Button>
        </form>
      </div>
    </div>
  );
};

export default OfferRide;

