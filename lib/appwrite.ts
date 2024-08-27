import { Client, Account, Databases, ID, Query, Models } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT as string) // Your Appwrite endpoint
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string); // Your project ID

// Initialize the Account service to handle authentication
const account = new Account(client);

// Initialize the Databases service to interact with your database
const databases = new Databases(client);

// Define a type for the User

// Define a type for a Ride document
export interface RideType extends Models.Document {
    offeredBy: string;
    bookedBy: string[];
    status: string;
    [key: string]: any; // For any other fields in your ride documents
}


// Fetch the active rides for the user
const getUserRides = async (): Promise<RideType[] | null> => {
    try {
        const user = await account.get();
        if (!user) {
            throw new Error("User not logged in");
        }

        const offeredRides = await databases.listDocuments<RideType>(
            process.env.NEXT_PUBLIC_DB_ID as string,
            process.env.NEXT_PUBLIC_COLLECTION_ID as string,
            [Query.equal('offeredBy', user.$id)]
        );

        const reservedRides = await databases.listDocuments<RideType>(
            process.env.NEXT_PUBLIC_DB_ID as string,
            process.env.NEXT_PUBLIC_COLLECTION_ID as string,
            [Query.search('bookedBy', user.$id)]
        );

        const activeRides = [...offeredRides.documents, ...reservedRides.documents].filter(
            (ride) => ride.status === 'active'
        );

        return activeRides;
    } catch (error) {
        console.error("Failed to fetch rides:", error);
        return null;
    }
};
const getLocationList = async (): Promise<{ name: string }[]> => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DB_ID as string, // Your database ID
        process.env.NEXT_PUBLIC_LOCATION_COLLECTION_ID as string // Your collection ID for locations
      );
      // Assuming each document has a `name` field
      return response.documents.map((document: any) => document.name);
    } catch (error) {
      console.error('Error fetching locations:', error);
      return []; // Return an empty array if an error occurs
    }
  };
 
// Export the Appwrite services and utilities
export { client, account, databases, ID, Query, getUserRides ,getLocationList};
