
import { Client, Account, Databases, ID, Query } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT as string) // Your Appwrite endpoint
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string); // Your project ID

// Initialize the Account service to handle authentication
const account = new Account(client);


// Initialize the Databases service to interact with your database
const databases = new Databases(client);

// Export the Appwrite services and utilities
export { client, account, databases, ID, Query };
