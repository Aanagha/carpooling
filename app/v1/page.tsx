
import { Cover } from '@/components/ui/cover'
import { UserTabs } from '../components/UserTabs'


const App = () => {

  return (
    <div>
          <div>
         <div className="m-auto items-center justify-center px-3">
          <h1 className="text-3xl text-center lg:text-6xl mb-4 font-bold">
            Welcome!<br /> <Cover className="italic capitalize">name</Cover>
          </h1>
          <p className="text-center text-lg text-gray-600 mb-6">
            Hop in! Connect with your next carpool.
          </p>
          <UserTabs />
        </div>
    </div>
    </div>
  )
}

export default App