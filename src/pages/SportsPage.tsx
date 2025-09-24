import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Sports from "../sections/sports";
import useLanguageUpdater from "../hooks/useLanguageUpdater";

const SportsPage: React.FC = () => {
  // Hook para actualizar idioma y título dinámicamente
  useLanguageUpdater();

  return (
    <div className="">
      <Header />
      <main className="flex-grow">
        <Sports />
      </main>
      <Footer />
    </div>
  );
};

export default SportsPage;