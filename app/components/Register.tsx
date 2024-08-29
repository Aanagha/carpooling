"use client";

import React, { useState, useEffect } from "react";
import { account, databases, ID } from "@/lib/appwrite";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [collegeId, setCollegeId] = useState<string>("");
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID as string,
          process.env.NEXT_PUBLIC_LOCATION_COLLECTION_ID as string
        );

        const locationNames = response.documents.map((doc: any) => doc.name);
        setLocations(locationNames);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const register = async () => {
    setLoading(true);
    try {
      const user = await account.create(ID.unique(), email, password, name);

      await databases.createDocument(
        process.env.NEXT_PUBLIC_DB_ID as string,
        process.env.NEXT_PUBLIC_USER_COLLECTION_ID as string,
        user.$id,
        {
          email: email,
          username: name,
          clgId: collegeId,
          preferredLocations: preferredLocations,
        }
      );

      await account.createEmailPasswordSession(email, password);

      toast.success("Registered successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setPreferredLocations(selectedOptions);
  };

  const removeLocation = (locationToRemove: string) => {
    setPreferredLocations((locations) =>
      locations.filter((location) => location !== locationToRemove)
    );
  };

  return (
    <div className="container mx-auto p-2 max-h-screen overflow-y-auto">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 lg:p-12">
        <h1 className="col-span-1 md:col-span-2 text-2xl font-bold mb-4 text-center">Register</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            register();
          }}
          className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 space-y-4 md:space-y-0"
        >
          <div className="flex flex-col">
            <Label className="text-sm font-bold mb-2" htmlFor="name">
              Name
            </Label>
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
          <div className="flex flex-col">
            <Label className="text-sm font-bold mb-2" htmlFor="email">
              Email
            </Label>
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
          <div className="flex flex-col">
            <Label className="text-sm font-bold mb-2" htmlFor="password">
              Password
            </Label>
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
          <div className="flex flex-col">
            <Label className="text-sm font-bold mb-2" htmlFor="collegeId">
              College ID
            </Label>
            <Input
              type="text"
              id="collegeId"
              placeholder="College ID"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              required
              className="p-2 border border-gray-800 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col col-span-1 md:col-span-2">
            <Label className="text-sm font-bold mb-2" htmlFor="preferredLocations">
              Preferred Locations
            </Label>
            {preferredLocations.length > 0 && (
              <div className="flex flex-wrap gap-2 my-2">
                {preferredLocations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-1 border-2 border-gray-400 blur-background bg-white/80 text-black rounded-full"
                  >
                    <span>{location}</span>
                    <button
                      type="button"
                      className="ml-2"
                      onClick={() => removeLocation(location)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <select
              id="preferredLocations"
              multiple
              value={preferredLocations}
              onChange={handleLocationChange}
              className="p-2 border border-gray-800 rounded-md w-full bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
            >
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <Button
              type="submit"
              variant={"outline"}
              className="hover:bg-blue-700 bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
            >
              {loading ? (
                <div
                  className="loader mx-auto border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
                  aspect-square w-8 flex justify-center items-center text-yellow-700"
                ></div>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
