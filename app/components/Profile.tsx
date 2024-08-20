import {
  
    LogOut,
   
    User,
  
  } from "lucide-react"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,

    DropdownMenuSeparator,
  
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import Register from "./Register";
import Login from "./Login";
import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DrawerDemo } from "./DrawerDemo";
  export function Profile() {
    const [loading,setLoading] =  useState(false);

  const [user, setUser] = useState<any>(null);


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await account.get();
        setUser(userData);
        console.log(userData);
      } catch (error) {
        console.error("User not logged in:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  const logout = async () => {
    try {
      await account.deleteSession("current"); // Logout the user
      setUser(null); // Clear user state
    window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  if(!user){
 return    <>
 {loading ? 
            
            <div className="loader border-t-2 m-auto rounded-full border-gray-500 bg-gray-300 animate-spin
            aspect-square w-8 flex justify-center items-center text-yellow-700"></div> :  <>
                        <DrawerDemo action={false} rideType="Sign Up" variant="default" bc="white" title="Signup"><Register/></DrawerDemo>
                      <DrawerDemo action={false} rideType="Login" variant="default" bc="white"  title="Login"><Login  /></DrawerDemo>
                        </>
                      }
 </>
  }
    return (
      <DropdownMenu>
       
         
          {user &&  <DropdownMenuTrigger asChild>
            <Button variant="default">{user.name}</Button>
        </DropdownMenuTrigger>}
       
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
       </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <Button variant='link' onClick={logout}>Logout</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }