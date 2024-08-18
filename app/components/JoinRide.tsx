import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";

interface IRide {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  departureTime: string;
  seats: number;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
}

const socket = io(); // Connect to Socket.io server

const JoinRide: React.FC = () => {
  const [step, setStep] = React.useState(1);
  const [rides, setRides] = React.useState<IRide[]>([]);
  const [selectedRide, setSelectedRide] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<string[]>([]);
  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      rideId: "",
      seats: 1,
      message: "",
    },
  });
  const activeWallet = useActiveAccount();
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (activeWallet) {
      setWalletAddress(activeWallet.address);
    } else {
      setWalletAddress(null);
    }
  }, [activeWallet]);

  React.useEffect(() => {
    // Fetch available rides
    fetch("/api/rides")
      .then((res) => res.json())
      .then((data) => setRides(data));

    // Listen for real-time updates
    socket.on("rideFilled", (ride: IRide) => {
      setRides((prevRides) =>
        prevRides.map((r) => (r._id === ride._id ? ride : r))
      );
    });

    socket.on("newMessage", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("rideFilled");
      socket.off("newMessage");
    };
  }, []);

  const onSubmit = (data: any) => {
    if (step === 3) {
      // Book the selected ride
      socket.emit(
        "bookRide",
        { rideId: data.rideId, userId: walletAddress },
        (response: IRide, error?: string) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Ride booked:", response);
          }
        }
      );
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const sendMessage = (message: string) => {
    socket.emit("chatMessage", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="p-4 pb-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Select Ride */}
          {step === 1 && (
            <div className="space-y-6">
              <p className="w-full text-center lg:text-left mb-4 lg:mb-0 backdrop-blur-2xl dark:border-neutral-800">
                {walletAddress ? (
                  <span>
                    Connected wallet: {walletAddress.slice(0, 6)}...
                    {walletAddress.slice(-4)}
                  </span>
                ) : (
                  <span>No wallet connected</span>
                )}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select a Ride
                </label>
                <Controller
                  name="rideId"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      required
                    >
                      <option value="">Select a ride</option>
                      {rides.map((ride) => (
                        <option key={ride._id} value={ride._id}>
                          {ride.pickupLocation} to {ride.dropoffLocation} -{" "}
                          {ride.seats} seats available
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 2: Confirm Details */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Review your details
              </h3>
              <ul className="space-y-2">
                <li>
                  <strong>Selected Ride:</strong>{" "}
                  {rides.find((ride) => ride._id === watch("rideId"))?.pickupLocation}{" "}
                  to{" "}
                  {rides.find((ride) => ride._id === watch("rideId"))?.dropoffLocation}
                </li>
                <li>
                  <strong>Seats Available:</strong>{" "}
                  {rides.find((ride) => ride._id === watch("rideId"))?.seats}
                </li>
              </ul>
            </div>
          )}

          {/* Step 3: Join Chat */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Chat with Others
              </h3>
              <div className="space-y-2">
                <ul className="space-y-2">
                  {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your message"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendMessage(field.value);
                          field.onChange("");
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {step < 3 && (
              <Button variant="outline" onClick={handleNext}>
                Next
              </Button>
            )}
            {step === 3 && <Button type="submit">Book Ride</Button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRide;
