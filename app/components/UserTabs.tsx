
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import OfferRide from "./OfferRide"
import RideList from "./RidesList"

export function UserTabs() {
  return (
    <Tabs defaultValue="login" >
      <TabsList className="grid grid-cols-2 w-75  w-[280px]  items-center mx-auto justify-center">
        <TabsTrigger value="register">Offer a ride</TabsTrigger>
        <TabsTrigger value="login">Join a ride</TabsTrigger>
      </TabsList>
      <TabsContent value="register">
      <OfferRide/>
      </TabsContent>
      <TabsContent value="login">
      <RideList/>
      </TabsContent>
    </Tabs>
  )
}
