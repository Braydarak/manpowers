import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Hero from "../sections/hero";
import AboutUs from "../sections/aboutUs";
import Locations from "../sections/locations";
import useLanguageUpdater from "../hooks/useLanguageUpdater";

const HomePage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  // Hook para actualizar idioma y título dinámicamente
  useLanguageUpdater();

  // Limpiar datos de compra en sessionStorage al volver a Home
  useEffect(() => {
    try {
      const keysToRemove = ["buyerEmail", "orderId", "productNames"];
      const dynamicKeys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith("emailSent:")) dynamicKeys.push(k);
      }
      [...keysToRemove, ...dynamicKeys].forEach((k) => sessionStorage.removeItem(k));
    } catch (err) {
      console.warn("No se pudo limpiar sessionStorage al entrar en Home:", err);
    }
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="">
      <Header />
      <main className={`flex-grow transition-all duration-500 ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <Hero />
        <AboutUs />
        <Locations />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;