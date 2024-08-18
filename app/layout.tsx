import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Car pooling app",
  description: "Car pooling for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-background font-sans ",
          fontSans.variable
        )} >
      <ThirdwebProvider>
      {children}
      <Toaster />
    </ThirdwebProvider> 
        
        </body>
    </html>
  );
}
