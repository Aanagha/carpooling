"use client";

import { useState } from "react";

import { account } from "@/lib/appwrite";
import { Label } from "@/components/ui/label";



const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // State to manage loader visibility

  const login = async () => {
    setLoading(true); // Show loader on login attempt
    try {
      await account.createEmailPasswordSession(email, password);
      window.location.reload(); // Refresh the window after successful login
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false); // Hide loader after login attempt
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <div className="max-w-md mx-auto  p-4 md:p-6 lg:p-12">
       
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
              className="p-2 border border-gray-300 rounded-md w-full"
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
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            {loading ? 
<div className="loader mx-auto border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
aspect-square w-8 flex justify-center items-center text-yellow-700"></div>: "Login"} 
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account? <a href="/" className="text-blue-500 hover:text-blue-700">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;