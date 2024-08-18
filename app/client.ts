import { createThirdwebClient } from "thirdweb"

const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;

if(!clientID){
    throw new Error('Client ID is required')
}
export const client = createThirdwebClient({  // Removed 'new'
    clientId: clientID as string
})