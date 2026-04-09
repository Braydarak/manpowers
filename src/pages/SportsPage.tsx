import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Sports from "../sections/sports";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import { updateSEOTags, seoConfigs } from "../utils/seoConfig";

const SportsPage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  const { t } = useTranslation();
  // Hook para actualizar idioma y título dinámicamente
  useLanguageUpdater();
  useEffect(() => {
    updateSEOTags(seoConfigs.sports);
  }, []);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-primary)] text-black">
      <Header />
      <main
        className={`flex-grow pt-10 md:pt-20 transition-all duration-500 ${enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="w-full mb-6">
            <div className="w-full border border-black/10 rounded-xl px-4 py-2.5 flex items-center justify-center text-center">
              <span className="text-sm md:text-base font-semibold text-black">
                {t("shipping.freeOver30")}
              </span>
            </div>
          </div>
        </div>
        <Sports />
      </main>
      <Footer />
    </div>
  );
};

export default SportsPage;
