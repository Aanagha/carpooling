import React from 'react';

import { DrawerDemo } from './DrawerDemo';
import { Cover } from '@/components/ui/cover';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import Register from './Register';
import { UserTabs } from './UserTabs';

const Hero = ({ user }:{user:any}) => {
  return (
    <section className="text-center flex flex-col lg:flex-row min-h-screen justify-between  px-4 lg:px-20">
      {!user ? (
        <>
          <div className="lg:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 pt-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white ">
              <Cover>Ride Together</Cover>, Save Together
            </h1>
            <h2 className="text-center text-lg lg:text-xl font-bold my-3 max-w-md mx-auto">
              Discover the convenience of carpooling, reduce fuel costs, and enhance your experience.
            </h2>
            <DrawerDemo
              trigger={
                <Button
                  className="m-auto mt-4 hover:border-t-4 border-white hover:border-black border-2 bg-black text-white hover:text-black rounded-tl-full rounded-br-full"
                  variant="default"
                  size="lg"
                >
                  Get started
                </Button>
              }
              variant="default"
              bc="black"
              title="Sign up"
            >
              <Register />
            </DrawerDemo>
            <Image
              src="/poster.jpg"
              alt="Promotional poster for carpooling"
              layout="responsive"
              width={385}
              height={180}
              className="rounded-lg my-8 mx-auto lg:hidden"
            />
          </div>
          <div className="lg:w-1/2 flex  justify-center">
            <Image
              src="/poster.jpg"
              alt="Promotional poster for carpooling"
              layout="responsive"
              width={500}
              height={500}
              className="hidden lg:block rounded-lg"
            />
          </div>
        </>
      ) : (
        <div className="m-auto items-center justify-center px-3">
          <h1 className="text-3xl text-center lg:text-6xl mb-4 font-bold">
            Welcome!<br /> <Cover className="italic capitalize">{user.name}</Cover>
          </h1>
          <p className="text-center text-lg text-gray-600 mb-6">
            Hop in! Connect with your next carpool.
          </p>
          <UserTabs />
        </div>
      )}
    </section>
  );
};

export default Hero;
