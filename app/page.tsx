
import Footer from "./components/Footer";
import BestPractises from "./components/BestPractises";
import Howitworks from "./components/Howitworks";
import Hero from "./components/Hero";
import Header from "./components/Header";


export default function Home() {


  return (
    <>
     
<Header/>
      <main className="flex min-h-screen flex-col items-center justify-between py-6 px-4 sm:px-6">
      
     <Hero/>
       
    
        <Howitworks/>
       
     <BestPractises/>
      </main>

      <Footer/>
    </>
  );
}


