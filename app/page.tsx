
import Footer from "./components/Footer";
import BestPractises from "./components/BestPractises";
import Howitworks from "./components/Howitworks";
import Header from "./components/Header";

import RideAndHeroManager from "./components/RideAndHeroManager";


export default function Home() {


  return (
    <>
     
<Header/>
      <main className="container">
     
   <RideAndHeroManager/>
       
    
        <Howitworks/>
       
     <BestPractises/>
      </main>

      <Footer/>
    </>
  );
}


