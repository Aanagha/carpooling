
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
 
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export function DrawerDemo({

  children,



  trigger
}: {
  bc: string;
  children: React.ReactNode;
  variant: string;
  title: string;
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Initial check
    updateSize();

    // Add event listener for window resize
    window.addEventListener("resize", updateSize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="  backdrop-blur-xl bg-white/80">

          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent className="backdrop-blur-2xl bg-white/80">
       
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="bg-background" >Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
