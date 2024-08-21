
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

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
          <Button
            className={`m-auto border-t-4 border-${bc} ${
              action ? "rounded-tl-full rounded-br-full" : ""
            }`}
            variant={variant as any}
            size="lg"
          >
            {rideType}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
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
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
