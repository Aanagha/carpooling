import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";


export function DrawerDemo({
  bc,
  children,variant,rideType,title
}: {
  bc:string,children: React.ReactNode,variant:string,rideType:string,title:string
}) {
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={`m-auto border-t-4 border-${bc} rounded-tl-full rounded-br-full`}
          variant={variant as any}
          size="lg"
        >
          {rideType}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
      <DrawerHeader>
      <DrawerTitle className="text-center">{title}</DrawerTitle>
  
    </DrawerHeader>
    {children}
    <DrawerFooter className="mt-6 flex justify-center">
        <DrawerClose asChild>
            <Button variant="outline" size="lg" className="m-auto">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
     
    </Drawer>
  );
}
