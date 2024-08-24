"use client"
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
import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DrawerDemo } from "./DrawerDemo";
import { UserTabs } from "./UserTabs";
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
            aspect-square w-8 flex justify-center items-center text-yellow-700"></div> :  <div className="flex flex-row gap-0">
                                     <DrawerDemo trigger={  <Button
            className={`m-auto hover:text-black hover:border-2 dark:text-white bg-black  `}
            variant={'default'}
            size="lg"
          >
         Login
          </Button>}   variant="default" bc="black"  title="Sign up"><UserTabs/></DrawerDemo>
 
                        </div>
                      }
 </>
  }
    return (
      <DropdownMenu>
       
         
          {user &&  <DropdownMenuTrigger asChild>
        <div className="flex gap-0">
            
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
    <span className="font-medium text-gray-600 dark:text-gray-300">
        {user.name.substring(0, 2).toUpperCase()}
    </span>
</div>


            <Button variant="link" className="text-black">{user.name.toUpperCase()}</Button>
        </div>
        </DropdownMenuTrigger>}
       
        <DropdownMenuContent className="w-56 backdrop-blur-2xl bg-white/80">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/profile'}>
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