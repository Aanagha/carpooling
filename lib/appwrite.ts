// lib/appwrite.ts

import { Client, Databases, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT as string) // Your Appwrite endpoint
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string); // Your project ID

const databases = new Databases(client);

export { client, databases, ID };
