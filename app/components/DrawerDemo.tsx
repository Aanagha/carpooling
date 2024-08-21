import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function DrawerDemo({
  bc,
  children,
  variant,
  rideType,
  title,
  action,
}: {
  bc: string;
  children: React.ReactNode;
  variant: string;
  rideType: string;
  title: string;
  action: boolean;
}) {
  return (
    <Drawer >
      <DrawerTrigger asChild>
        <Button
          className={`m-auto border-t-4 border-${bc} ${
            action ? "rounded-tl-full rounded-br-full" : ""
          }`}
          variant={variant as any}
          size="lg"
        >
          {rideType}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className=" md:max-w-md lg:max-w-2xl mx-auto p-2 backdrop-blur-3xl bg-white/30 rounded-lg shadow-lg"
        aria-describedby={undefined}
      >
        <DrawerHeader>
          <DrawerTitle className="text-center text-3xl ">{title}</DrawerTitle>
        </DrawerHeader>
        {children}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
