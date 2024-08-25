"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { databases } from "@/lib/appwrite"

export function RideSelect({ displaytext, location, onLocationChange }: { displaytext: string, location: string, onLocationChange: (location: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(location)
  const [locations, setLocations] = React.useState<string[]>([])

  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await databases.listDocuments( //
          process.env.NEXT_PUBLIC_DB_ID as string,
          process.env.NEXT_PUBLIC_LOCATION_COLLECTION_ID as string 
        );

        const options = response.documents.map((document: any) => document.name); // Assuming `name` is the field you want
        console.log(options)
        setLocations(options);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full border-0 text-md justify-between bg-transparent"
        >
          {value
            ? locations.find((location) => location === value)
            : displaytext}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0 text-background bg-white mt-[-50px] ml-10">
        <Command>
          <CommandInput className="bg-transparent" placeholder="Search location..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
             
              {locations.map((location) => (
                <CommandItem className="text-background"
                  key={location}
                  value={location}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onLocationChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === location ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
