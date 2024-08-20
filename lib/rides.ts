import {  databases, ID } from './appwrite';

const notifyOfferer = async (message: string, offererId: string) => {
    try {
        await databases.createDocument(
            process.env.NEXT_PUBLIC_DB_ID as string,
            process.env.NEXT_PUBLIC_NOTIFICATION_COLLECTION_ID as string, // Collection ID for notifications
            ID.unique(),
            {
                userId: offererId,
                message,
                timestamp: new Date(),
                read: false,
            }
        );
    } catch (error) {
        console.error('Failed to send notification:', error);
    }
};

export const createRide = async (rideData: any) => {
    try {
        const response = await databases.createDocument(process.env.NEXT_PUBLIC_DB_ID as string, process.env.NEXT_PUBLIC_COLLECTION_ID as string, ID.unique(),  {
            pickupLocation: rideData.pickupLocation,
            dropoffLocation: rideData.dropoffLocation,
            departureTime: rideData.departureTime,
            seats: rideData.seats,
            vehicleType: rideData.vehicleType,
            vehicleNumber: rideData.vehicleNumber,
            status: rideData.status,
            offeredBy: rideData.offeredBy
        });
        return response;
    } catch (error) {
        console.error("Failed to create ride:", error);
        throw error;
    }
};
export const fetchRides = async () => {
    return databases.listDocuments(process.env.NEXT_PUBLIC_DB_ID as string, process.env.NEXT_PUBLIC_COLLECTION_ID as string);
};
export const reserveRide = async (rideId: string, walletAddress: string, seats: number) => {
    try {
        // Fetch the current ride document
        const ride = await databases.getDocument(
            process.env.NEXT_PUBLIC_DB_ID as string,
            process.env.NEXT_PUBLIC_COLLECTION_ID as string,
            rideId
        );

        // Check if the current user is the offerer
        if (ride.offeredBy === walletAddress) {
            throw new Error("The offerer cannot reserve their own ride.");
        }

        // Check if the ride is active
        if (ride.status !== 'active') {
            throw new Error('Ride is not active for reservation');
        }

        // Check if there are enough seats available
        if (ride.bookedBy.length >= ride.seats) {
            throw new Error('No seats available');
        }

        // Update the ride status to 'reserved' and subtract the reserved seats from the total seats
        const updatedRide = await databases.updateDocument(
            process.env.NEXT_PUBLIC_DB_ID as string,
            process.env.NEXT_PUBLIC_COLLECTION_ID as string,
            rideId,
            {
                status: 'reserved',
                bookedBy: [...ride.bookedBy, walletAddress],
                seats: ride.seats - seats
            }
        );

        // Notify the offerer that a seat has been reserved
        notifyOfferer('A seat has been reserved on your ride.', ride.offeredBy);

        // If all seats are booked, notify the offerer
        if (updatedRide.bookedBy.length === ride.seats) {
            notifyOfferer('All seats on your ride have been booked.', ride.offeredBy);
        }

        console.log(updatedRide);
        return updatedRide;
    } catch (error: any) {
        throw new Error(`Failed to reserve ride: ${error.message}`);
    }
};
