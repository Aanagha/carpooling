"use client";

import { useState } from "react";

import { account } from "@/lib/appwrite";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";



const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // State to manage loader visibility

  const login = async () => {
    setLoading(true); // Show loader on login attempt
    try {
      await account.createEmailPasswordSession(email, password);
      window.location.reload(); // Refresh the window after successful login
      toast.success('Logged in successfully');
    } catch (error:any) {
      console.error("Login failed:", error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Hide loader after login attempt
    }
  };

  return (
    <div className="container mx-auto">
      <div className="max-w-md mx-auto  p-4 md:p-6 lg:p-12">
      <h1 className="text-2xl font-bold mb-4 text-center">Login </h1>
        <form onSubmit={(e) => { e.preventDefault(); login(); }} className="space-y-4">
          <div className="flex flex-col mb-4">
            <Label className="text-sm font-bold mb-2" htmlFor="email">Email</Label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border bg-transparent  rounded-md w-full"
            />
          </div>
          <div className="flex flex-col mb-4">
            <Label className="text-sm font-bold mb-2" htmlFor="password">Password</Label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border bg-transparent  rounded-md w-full"
            />
          </div>
          <Button type="submit" className="  border font-bold py-2 px-4 rounded w-full bg-blue-500 hover:bg-blue-700 text-gray-200">
            {loading ? 
<div className="loader mx-auto border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
aspect-square w-8 flex justify-center items-center text-yellow-700"></div>: "Login"} 
          </Button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;