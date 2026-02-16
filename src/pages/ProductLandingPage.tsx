import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import productsService, { type Product } from "../services/productsService";
import CartWidget from "../components/cart/CartWidget";
import Accordion from "../components/accordion";
import InfoStripe from "../components/info/InfoStripe";

const ProductLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation();
  const baseLang =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "es";
  const currentLanguage: "es" | "en" | "ca" =
    baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const mainButtonRef = useRef<HTMLButtonElement>(null);

  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      setError("");
      try {
        const all = await productsService.getProducts();
        const found =
          all.find((p) => toSlug(p.name.es) === slug) ||
          all.find((p) => toSlug(p.name.en) === slug) ||
          all.find((p) => toSlug(p.name.ca || "") === slug) ||
          null;
        if (!found) {
          setError("Producto no encontrado");
        }
        setProduct(found);
      } catch {
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    if (!product) {
      setSelectedSize(null);
      return;
    }
    const keys = product.amazonLinks
      ? Object.keys(product.amazonLinks)
      : product.pricesBySize
        ? Object.keys(product.pricesBySize)
        : [];
    if (keys.length > 0)
      setSelectedSize(keys.includes("100ml") ? "100ml" : keys[0]);
    else setSelectedSize(null);
  }, [product]);

  useEffect(() => {
    if (product) {
      const title = `${
        product.name[currentLanguage] || product.name.es
      } | MΛN POWERS`;
      document.title = title;
    }
  }, [product, currentLanguage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setShowStickyButton(true);
        } else {
          setShowStickyButton(false);
        }
      },
      {
        threshold: 0,
      },
    );

    if (mainButtonRef.current) {
      observer.observe(mainButtonRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [product]);

  const handleBuy = () => {
    if (!product || !product.available) return;
    const computedPrice =
      product.pricesBySize && selectedSize
        ? product.pricesBySize[selectedSize] || product.price
        : product.price;
    const detail = {
      id: String(product.id),
      name: product.name[currentLanguage] || product.name.es,
      price: computedPrice,
      image: product.image,
      quantity: 1,
      buyNow: true,
      openCheckout: true,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  const priceText = useMemo(() => {
    if (!product) return "";
    if (product.pricesBySize && selectedSize) {
      const val = product.pricesBySize[selectedSize];
      const num =
        typeof val === "number"
          ? val
          : typeof val === "string"
            ? parseFloat(val.replace(",", "."))
            : Number(product.price);
      return `€ ${num.toFixed(2)}`;
    }
    return product.price_formatted
      ? product.price_formatted
      : `€ ${Number(product.price).toFixed(2)}`;
  }, [product, selectedSize]);

  return (
    <div className="relative min-h-screen bg-[var(--color-primary)] overflow-hidden text-black">
      <div className="fixed top-0 left-0 right-0 z-50">
        <InfoStripe />
      </div>
      <header className="absolute top-0 left-0 right-0 z-30 flex justify-center items-center flex-col md:pt-10 pt-5">
        <img
          src="/MANPOWERS.png"
          alt="MΛN POWERS"
          className="h-12 md:h-25 mt-10"
        />
      </header>
      <CartWidget hideSidebar />
      {loading ? (
        <div className="md:grid md:grid-cols-2 md:h-screen">
          <div className="h-64 md:h-full bg-gray-200 animate-pulse" />
          <div className="relative bg-white">
            <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-black/25 to-transparent" />
            <div className="p-8 md:p-10 space-y-6">
              <div className="h-8 w-2/3 bg-gray-200 animate-pulse" />
              <div className="h-10 w-1/3 bg-gray-200 animate-pulse" />
              <div className="h-24 bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="w-full h-full flex items-center justify-center">
          <h2 className="text-2xl font-bold">{error}</h2>
        </div>
      ) : product ? (
        <div className="md:grid md:grid-cols-2 md:h-screen">
          <div className="relative bg-[#fcfcfc]">
            <img
              src={product.image}
              alt={product.name[currentLanguage] || product.name.es}
              className="w-full h-auto max-h-[60vh] mt-20 md:mt-0  object-contain mx-auto md:w-full md:h-full md:max-h-none md:mx-0 md:object-cover md:object-left min-[2000px]:object-contain min-[2000px]:w-[90%] min-[2000px]:max-h-[80vh] min-[2000px]:mx-auto md:max-[1900px]:scale-[0.88] md:max-[1800px]:scale-[0.82] md:max-[1700px]:scale-[0.75] md:max-[1600px]:scale-[0.68] md:max-[1500px]:scale-[0.62] md:max-[1700px]:-translate-x-[3%] md:max-[1500px]:-translate-x-[6%]"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
              }}
            />
            <div className="hidden md:block absolute inset-0 bg-[#fcfcfc] opacity-10" />
          </div>
          <div className="relative bg-[#FCFCFC] overflow-y-auto h-full mb-20">
            <div className="hidden md:block absolute inset-0" />
            <div className="relative flex flex-col px-4 sm:px-6 md:px-8 py-10 md:mt-70 md:min-h-full">
              <div className="w-full max-w-2xl mx-auto my-auto">
                <h1 className="text-3xl md:text-5xl font-extrabold">
                  {product.name[currentLanguage] || product.name.es}
                </h1>
                <p className="mt-6 md:mt-8 text-4xl md:text-5xl font-semibold">
                  {priceText}
                </p>
                {(product?.amazonLinks || product?.pricesBySize) && (
                  <div className="mt-6">
                    <div className="flex items-center gap-3">
                      {(product.amazonLinks
                        ? Object.keys(product.amazonLinks)
                        : Object.keys(product.pricesBySize || {})
                      ).map((size) => {
                        const val =
                          product.pricesBySize && product.pricesBySize[size];
                        const num =
                          typeof val === "string"
                            ? parseFloat(val.replace(",", "."))
                            : undefined;
                        const priceText =
                          typeof num === "number" ? `€ ${num.toFixed(2)}` : "";
                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`${
                              selectedSize === size
                                ? "bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]"
                                : "bg-black/5 text-black border-black/10"
                            } font-semibold px-3 py-1 md:w-auto w-full rounded-lg`}
                          >
                            {product.pricesBySize
                              ? `${size}${priceText ? ` - ${priceText}` : ""}`
                              : size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="mt-10 md:mt-16">
                  <button
                    ref={mainButtonRef}
                    onClick={handleBuy}
                    disabled={!product.available}
                    className={`inline-block cursor-pointer md:w-auto w-full font-bold py-4 md:py-6 px-10 md:px-16 text-2xl md:text-4xl rounded-2xl transition-colors ${
                      product.available
                        ? "bg-[var(--color-secondary)] text-white hover:brightness-90"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {product.available
                      ? t("sports.buy")
                      : t("sports.comingSoon")}
                  </button>
                  <div className="mt-10 md:mt-16">
                    <span className="text-lg text-black">
                      {product.description[currentLanguage] ||
                        product.description.es}
                    </span>
                  </div>
                  <div className="mt-10 md:mt-16">
                    <h3 className="text-xl font-bold mb-4">
                      Modo de aplicación
                    </h3>
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-64 md:h-80 object-cover object-center rounded-2xl"
                      src="/test-video.mp4"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="mt-10 md:mt-16">
                    <Accordion
                      defaultOpenId="descripcion"
                      white={true}
                      description={
                        product.description[currentLanguage] ||
                        product.description.es
                      }
                      objectives={
                        product.objectives &&
                        (
                          product.objectives[currentLanguage] ||
                          product.objectives.es
                        )?.length ? (
                          <ul className="list-disc ml-5 space-y-1">
                            {(
                              product.objectives[currentLanguage] ||
                              product.objectives.es
                            )?.map((o, i) => (
                              <li key={i}>{o}</li>
                            ))}
                          </ul>
                        ) : undefined
                      }
                      nutritionalValues={
                        product.nutritionalValues
                          ? product.nutritionalValues[currentLanguage] ||
                            product.nutritionalValues.es
                          : undefined
                      }
                      application={
                        product.application
                          ? product.application[currentLanguage] ||
                            product.application.es
                          : undefined
                      }
                      recommendations={
                        product.recommendations
                          ? product.recommendations[currentLanguage] ||
                            product.recommendations.es
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {product && product.available && (
            <div
              className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-[var(--color-primary)] border-t border-black/10 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${
                showStickyButton ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <button
                onClick={handleBuy}
                className="w-full bg-[var(--color-secondary)] text-white font-bold py-4 rounded-xl text-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-90"
              >
                <span>{t("sports.buy")}</span>
                <span>-</span>
                <span>{priceText}</span>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ProductLandingPage;
