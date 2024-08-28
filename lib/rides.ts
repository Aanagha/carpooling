import {  databases, ID, Query } from './appwrite';

 export enum BookingStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
    Completed = 'completed',
    Canceled = 'canceled'
  }
  
export const createRide = async (rideData: any) => {
    try {
        const response = await databases.createDocument(process.env.NEXT_PUBLIC_DB_ID as string, process.env.NEXT_PUBLIC_COLLECTION_ID as string, ID.unique(),  {
            pickupLocation: rideData.pickupLocation,
            dropoffLocation: rideData.dropoffLocation,
            departureTime: rideData.departureTime,
            availableSeats: rideData.availableSeats,
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
export const fetchRide = async (rideId:string) => {
    try {
        const response = await databases.getDocument(process.env.NEXT_PUBLIC_DB_ID as string, process.env.NEXT_PUBLIC_COLLECTION_ID as string, rideId);
       return response.documents;
    } catch (err:any) {
       console.error(err)
    }
};
export const fetchRides = async () => {
    try {
        // Query to get only rides with status 'active'
        const activeRidesQuery = Query.equal('status', 'active');

        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DB_ID as string,
            process.env.NEXT_PUBLIC_COLLECTION_ID as string,
            [activeRidesQuery] // Pass the active status query
        );
console.log(response.documents)
        return response.documents;
    } catch (error) {
        console.error("Failed to fetch rides:", error);
        throw new Error("Could not fetch rides.");
    }
};



export const joinRide = async (rideId: string, user: any) => {
    try {
        // Fetch the ride data
        const ride = await databases.getDocument(
            process.env.NEXT_PUBLIC_DB_ID as string, // Your database ID
            process.env.NEXT_PUBLIC_COLLECTION_ID as string, // Replace with your rides collection ID
            rideId
        );

        // Check if the user is the one who offered the ride
        if (ride.offeredBy === user.$id) {
            throw new Error('You cannot join a ride you have offered.');
        }

        // Check if there are available seats
        if (ride.availableSeats > 0) {
            console.log(user)
            // Create a new booking in the bookings collection with status 'Pending'
            const bookingData = {
                name:user.name || user.username,
                rideId: rideId,
                userId: user.$id,
                status: BookingStatus.Pending, // Set status to Pending for approval
            };

            const booking = await databases.createDocument(
                process.env.NEXT_PUBLIC_DB_ID as string, // Booking database ID
                process.env.NEXT_PUBLIC_BOOKINGS_COLLECTION_ID as string, // Replace with your bookings collection ID
                ID.unique(), // Generate a unique ID for the booking
                bookingData
            );

            // Update the ride to add the booking reference to bookedBy array
            const updatedRide = {
                bookedBy: [...ride.bookedBy, booking.$id], // Store booking reference in bookedBy array
            };
            
            console.log(updatedRide);
            
            if (booking) {
                await databases.updateDocument(
                    process.env.NEXT_PUBLIC_DB_ID as string,
                    process.env.NEXT_PUBLIC_COLLECTION_ID as string,
                    rideId,
                    updatedRide
                );
            } else {
                return "Unable to book ride. Try again later.";
            }

            return 'Your booking request is pending approval by the offerer.';
        } else {
            throw new Error('Ride is full. Request is pending approval.');
        }
    } catch (error) {
        console.error('Failed to join ride:', error);
        throw error;
    }
};
