// lib/messages.ts

import { databases, ID } from "./appwrite";

export const storeMessage = async (messageData: any) => {
    return databases.createDocument('your_database_id', 'messages', ID.unique(), messageData);
};
