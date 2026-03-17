import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Hero from "../sections/hero";
import AboutUs from "../sections/aboutUs";
import Locations from "../sections/locations";
import AllProducts from "../components/all-products";
import SearchShopModal from "../components/searchShopModal";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import { useTranslation } from "react-i18next";
import { updateSEOTags, seoConfigs } from "../utils/seoConfig";

const Shops = lazy(() => import("../sections/shops"));

const HomePage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  // Hook para actualizar idioma y título dinámicamente
  useLanguageUpdater();
  const { i18n, t } = useTranslation();
  const baseLang =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "es";
  const currentLanguage: "es" | "en" | "ca" =
    baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";

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
      [...keysToRemove, ...dynamicKeys].forEach((k) =>
        sessionStorage.removeItem(k),
      );
    } catch (err) {
      console.warn("No se pudo limpiar sessionStorage al entrar en Home:", err);
    }
  }, []);

  const shopsMountRef = useRef<HTMLDivElement | null>(null);
  const [loadShops, setLoadShops] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (loadShops) return;
    const node = shopsMountRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setLoadShops(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "600px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadShops]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<{ targetId?: string }>;
      if (ce.detail?.targetId && ce.detail.targetId !== "shops") return;
      setLoadShops(true);
      void import("../sections/shops");
    };

    window.addEventListener("shops:open", onOpen as EventListener);
    return () => {
      window.removeEventListener("shops:open", onOpen as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-primary)] text-black">
      <Header />
      <main
        className={`flex-grow transition-all duration-500 ${enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <Hero />
        <div className="w-full">
          <div className="">
            <AllProducts
              language={currentLanguage}
              title={t("allProducts.title")}
            />
          </div>
        </div>

        <div id="shops" ref={shopsMountRef} className="min-h-[1px]">
          {loadShops ? (
            <Suspense
              fallback={
                <div className="py-16 text-center text-black/60">
                  {t("search.loading")}
                </div>
              }
            >
              <Shops id={null} />
            </Suspense>
          ) : null}
        </div>

        <AboutUs />
        <Locations />
      </main>
      <Footer />
      <SearchShopModal />
    </div>
  );
};

export default HomePage;
