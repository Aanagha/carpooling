
import Footer from "./components/Footer";
import BestPractises from "./components/BestPractises";
import Howitworks from "./components/Howitworks";
import Hero from "./components/Hero";
import Header from "./components/Header";
import RideStatus from "./components/RideStatus";


export default function Home() {


  return (
    <>
     
<Header/>
      <main>
     
     <Hero/>
       
    
        <Howitworks/>
       
     <BestPractises/>
      </main>

      <Footer/>
    </>
  );
}


