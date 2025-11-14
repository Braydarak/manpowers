import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Sports from "../sections/sports";
import useLanguageUpdater from "../hooks/useLanguageUpdater";

const SportsPage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  // Hook para actualizar idioma y título dinámicamente
  useLanguageUpdater();
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="">
      <Header />
      <main className={`flex-grow transition-all duration-500 ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <Sports />
      </main>
      <Footer />
    </div>
  );
};

export default SportsPage;