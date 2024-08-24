"use client";

import { useState } from "react";
import { account, ID } from "@/lib/appwrite";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // State to manage loader visibility

  const register = async () => {
       setLoading(true); // Show loader on register attempt
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      window.location.reload(); // Refresh the window after successful login
      toast.success('Registered in successfully');
    } catch (error:any) {
      console.error("Registration failed:", error);
      toast.error(error.message);

    } finally {
        setLoading(false); // Hide loader after login attempt
      }
  };

  return (
    <div className="container mx-auto">
      <div className="max-w-md mx-auto    p-4 md:p-6 lg:p-12">
       
        <form onSubmit={(e) => { e.preventDefault(); register(); }} className="space-y-4">
          <div className="flex flex-col mb-4">
            <Label className="text-sm font-bold mb-2" htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-2 border border-gray-800 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col mb-4">
            <Label className="text-sm font-bold mb-2" htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-800 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col mb-4">
            <Label className="text-sm font-bold mb-2" htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border border-gray-800 rounded-md w-full"
            />
          </div>
          <Button type="submit" variant={'outline'} className=" hover:bg-blue-700 font-bold py-2 px-4 rounded w-full">
          {loading ? 
<div className="loader mx-auto border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
aspect-square w-8 flex justify-center items-center text-yellow-700"></div>: "Register"} 
          </Button>
        </form>
     
      </div>
    </div>
  );
};

export default Register;