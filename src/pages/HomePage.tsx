import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Hero from "../sections/hero";
import AboutUs from "../sections/aboutUs";
import Locations from "../sections/locations";
import useLanguageUpdater from "../hooks/useLanguageUpdater";

const HomePage: React.FC = () => {
  // Hook para actualizar idioma y título dinámicamente
  useLanguageUpdater();

  return (
    <div className="">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AboutUs />
        <Locations />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;