import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Hero from "../sections/hero";
import AboutUs from "../sections/aboutUs";
import Locations from "../sections/locations";
import AllProducts from "../components/all-products";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import { useTranslation } from "react-i18next";
import { updateSEOTags, seoConfigs } from "../utils/seoConfig";

const HomePage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  // Hook para actualizar idioma y título dinámicamente
  useLanguageUpdater();
  const { i18n, t } = useTranslation();
  const baseLang = i18n.resolvedLanguage?.split('-')[0] || i18n.language?.split('-')[0] || 'es';
  const currentLanguage: 'es' | 'en' | 'ca' = baseLang === 'en' ? 'en' : (baseLang === 'ca' ? 'ca' : 'es');

  useEffect(() => {
    updateSEOTags(seoConfigs.home);
  }, []);

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
      <main className={`flex-grow transition-all duration-500 bg-gradient-to-b from-blue-950/10 via-black/95 to-black ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <Hero />
        <div className="w-full border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
            <AllProducts
              language={currentLanguage}
              title={t('allProducts.title')}
            />
          </div>
        </div>
        <AboutUs />
        <Locations />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;