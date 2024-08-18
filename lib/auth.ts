import { account, databases, ID } from './appwrite';

type LoginUserAccount = {
    email: string,
    password: string
}

class Auth {
    static async registerUser(email: string, clgId: string, password: string, username: string) {
        try {
            // Create the user with email and password
            const user = await account.create(ID.unique(), email, password, username);

            // Store additional user info in the 'users' collection
            const document = await databases.createDocument(process.env.NEXT_PUBLIC_DB_ID as string, process.env.NEXT_PUBLIC_USER_COLLECTION_ID as string, ID.unique(), {
                username, clgId,
                email,
            });
            console.log("Document creation successful:", document);

            if (user) {
                return this.login(user);
            }
        } catch (error: any) {
            throw new Error(`Failed to register: ${error.message}`);
        }
    }

    static async login({ email, password }: LoginUserAccount) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error: any) {
            throw new Error(`Failed to log in: ${error.message}`);
        }
    }

    static async isLoggedIn(): Promise<boolean> {
        try {
            const data = await this.getCurrentUser();
            return Boolean(data);
        } catch (error) {
            return false;
        }
    }

    static async getCurrentUser() {
        try {
            // Assuming there's a method to get the current user from the account or database
            // This is a placeholder for the actual implementation
            return await account.getCurrentUser();
        } catch (error: any) {
            console.error("get user error", error);
            return null;
        }
    }

    static async logout() {
        try {
            // Assuming there's a method to log out the current user from the account or database
            // This is a placeholder for the actual implementation
            return await account.logout();
        } catch (error: any) {
            console.error("logout error", error);
        }
    }
}