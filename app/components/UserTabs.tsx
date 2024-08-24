
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Register from "./Register"
import Login from "./Login"

export function UserTabs() {
  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid grid-cols-2 w-75  w-[280px]  items-center mx-auto justify-center">
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="register">
      <Register/>
      </TabsContent>
      <TabsContent value="login">
      <Login/>
      </TabsContent>
    </Tabs>
  )
}
