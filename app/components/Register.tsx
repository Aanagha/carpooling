"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { account, ID } from "@/lib/appwrite";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const register = async () => {
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      router.push("/"); // Redirect to home page after registration
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <div className="max-w-md mx-auto bg-white   p-4 md:p-6 lg:p-12">
       
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
              className="p-2 border border-gray-300 rounded-md w-full"
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
              className="p-2 border border-gray-300 rounded-md w-full"
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
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <a href="/" className="text-blue-500 hover:text-blue-700">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;