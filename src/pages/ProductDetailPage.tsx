import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ShareModal from "../components/modals/ShareModal";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import productsService, { type Product } from "../services/productsService";
import { updateSEOTags } from "../utils/seoConfig";
import Accordion from "../components/accordion";
import RecommendedTogether from "../components/recommended-together";
import Faq from "../components/faq";
import RelatedProducts from "../components/related-products";
import InfoStripe from "../components/info/InfoStripe";

// Tipado del JSON local para evitar 'any' en el fallback
type ProductJson = {
  id: number;
  name: Product["name"];
  description: Product["description"];
  objectives?: { es: string[]; en: string[] };
  price: string | number;
  price_formatted?: string;
  size: string;
  image: string;
  category: Product["category"] | string;
  sportId: string;
  available: boolean;
  sku?: string;
  amazonLinks?: { [key: string]: string };
  nutritionalValues?: { es: string; en: string };
  application?: { es: string; en: string };
  recommendations?: { es: string; en: string };
  rating?: number;
  votes?: number;
};

const ProductDetailPage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  const { sportId: sportParam, id, slug } = useParams<{
    sportId?: string;
    id?: string;
    slug?: string;
  }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const baseLang = i18n.resolvedLanguage?.split('-')[0] || i18n.language?.split('-')[0] || 'es';
  const currentLanguage: 'es' | 'en' | 'ca' = baseLang === 'en' ? 'en' : (baseLang === 'ca' ? 'ca' : 'es');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [checkoutOpenGlobal, setCheckoutOpenGlobal] = useState<boolean>(false);
  const [faqItems, setFaqItems] = useState<
    { id: string; question: string; answer: string }[]
  >([]);

  useLanguageUpdater();


  useEffect(() => {
    if (!product) return;
    const title = `${(product.name[currentLanguage] || product.name.es)} | MΛN POWERS`;
    const description = product.description[currentLanguage] || product.description.es;
    const keywords = `${(product.name[currentLanguage] || product.name.es)}, ${
      typeof product.category === "string"
        ? product.category
        : (product.category[currentLanguage] || product.category.es)
    }, MΛN POWERS`;
    const ogImage = product.image || "/MAN-LOGO-BLANCO.png";
    const canonicalPath = typeof window !== 'undefined' ? window.location.pathname : (slug ? `/product/${slug}` : `/product/${id}`);
    updateSEOTags({
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      canonicalUrl: `https://manpowers.es${canonicalPath}`,
    });
  }, [product, currentLanguage, id, slug]);

  useEffect(() => {
    const toSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
    const loadProduct = async () => {
      if (!id && !slug) return;
      setLoading(true);
      setError("");

      try {
        if (id) {
          const productsById = await productsService.getProducts({ id: Number(id) });
          if (productsById && productsById.length > 0) {
            setProduct(productsById[0]);
            return;
          }
        }

        const response = await fetch("/products.json");
        const data = await response.json();
        const normalized: Product[] = (data.products as ProductJson[]).map(
          (p: ProductJson) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            objectives: p.objectives,
            price:
              typeof p.price === "string"
                ? parseFloat(p.price.replace(",", "."))
                : p.price,
            price_formatted: p.price_formatted ?? "",
            size: p.size,
            image: p.image,
            category:
              typeof p.category === "string"
                ? { es: p.category, en: p.category }
                : p.category,
            sportId: p.sportId,
            available: p.available,
            sku: p.sku ?? "",
            amazonLinks: p.amazonLinks,
            nutritionalValues: p.nutritionalValues,
            application: p.application,
            recommendations: p.recommendations,
            rating: p.rating,
            votes: p.votes,
          })
        );

        if (id) {
          const byId = normalized.find((p: Product) => String(p.id) === String(id));
          if (byId) {
            setProduct(byId);
            return;
          }
        }

        if (slug) {
          const base = sportParam ? normalized.filter((p) => p.sportId === sportParam || p.sportId === 'multisport') : normalized;
          const found = base.find((p) => toSlug(p.name.es) === slug || toSlug(p.name.en) === slug || toSlug(p.name.ca || '') === slug);
          if (found) {
            setProduct(found);
            return;
          }
        }
        setError("Producto no encontrado");
      } catch (err) {
        console.error("Error cargando producto por id:", err);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, slug, sportParam]);

  useEffect(() => {
    const loadFaqs = async () => {
      if (!id) return;
      try {
        const response = await fetch("/products.json");
        const data = await response.json();
        const p = (data.products || []).find(
          (x: ProductJson) => String(x.id) === String(id)
        );
        const langItems = Array.isArray(p?.faqs?.[currentLanguage])
          ? p.faqs[currentLanguage]
          : (Array.isArray(p?.faqs?.es) ? p.faqs.es : []);
        const items = (langItems as { question: string; answer: string }[])
          .slice(0, 4)
          .map((it, idx) => ({
            id: `f${idx + 1}`,
            question: it.question,
            answer: it.answer,
          }));
        setFaqItems(items);
      } catch {
        setFaqItems([]);
      }
    };
    loadFaqs();
  }, [id, currentLanguage]);

  useEffect(() => {
    const onCheckoutToggle = (e: Event) => {
      const ce = e as CustomEvent<boolean>;
      setCheckoutOpenGlobal(Boolean(ce.detail));
    };
    window.addEventListener(
      "cart:checkoutOpen",
      onCheckoutToggle as EventListener
    );
    return () => {
      window.removeEventListener(
        "cart:checkoutOpen",
        onCheckoutToggle as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const id = requestAnimationFrame(() => setEnter(true));
      return () => cancelAnimationFrame(id);
    } else {
      setEnter(false);
    }
  }, [loading]);

  useEffect(() => {
    if (product && product.amazonLinks) {
      const keys = Object.keys(product.amazonLinks);
      if (keys.length > 0) setSelectedSize(keys[0]);
    } else {
      setSelectedSize(null);
    }
  }, [product]);

  const handleBack = () => navigate(-1);

  const goToSport = () => {
    const s = sportParam || product?.sportId;
    if (!s) return;
    navigate(`/products/${s}`);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const detail = {
      id: String(product.id),
      name: product.name[currentLanguage],
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  const handleBuyNow = () => {
    if (!product) return;
    const detail = {
      id: String(product.id),
      name: product.name[currentLanguage],
      price: product.price,
      image: product.image,
      quantity: 1,
      buyNow: true,
      openCheckout: true,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  const sportLabelName = (() => {
    const s = sportParam || product?.sportId;
    if (!s) return "";
    const names: { [key: string]: string } = {
      archery: t("sports.archery"),
      cycling: t("sports.cycling"),
      fencing: t("sports.fencing"),
      golf: t("sports.golf"),
      sailing: t("sports.sailing"),
      waterSports: t("sports.waterSports"),
    };
    return names[s] || s;
  })();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <Header />
      <main
        className={`flex-grow pt-10 md:pt-28 transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {loading ? (
            <div className="py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="animate-pulse bg-gray-900/60 rounded-xl h-[360px]"></div>
                <div className="space-y-4">
                  <div className="animate-pulse h-8 w-2/3 bg-gray-800 rounded"></div>
                  <div className="animate-pulse h-4 w-full bg-gray-800 rounded"></div>
                  <div className="animate-pulse h-4 w-5/6 bg-gray-800 rounded"></div>
                  <div className="animate-pulse h-10 w-1/2 bg-gray-800 rounded"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <h2 className="text-2xl font-bold mb-4">{error}</h2>
              <button
                onClick={handleBack}
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
              >
                {t("cart.back")}
              </button>
            </div>
          ) : product ? (
            <>
              <section className="py-6 mt-24">
                <div className="flex items-center justify-between">
                  <button
                    onClick={goToSport}
                    className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    {t("sports.backToSpecific", { sport: sportLabelName })}
                  </button>
                  <button
                    onClick={handleShare}
                    className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-700"
                  >
                    {t("product.share")}
                  </button>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div
                  className={`group bg-gray-900/60 rounded-xl overflow-hidden border border-gray-800 shadow-2xl transition-all duration-500 ${
                    enter
                      ? "opacity-100 translate-y-0 delay-100"
                      : "opacity-0 translate-y-3"
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-black">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={product.image}
                      alt={(product.name[currentLanguage] || product.name.es)}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[0.5deg]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `<span class='block p-6 text-gray-400'>${t('sports.imageNotAvailable')}</span>`;
                        }
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-col gap-6 transition-all duration-500 ${
                    enter
                      ? "opacity-100 translate-y-0 delay-150"
                      : "opacity-0 translate-y-3"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">
                      {product.category
                        ? typeof product.category === "string"
                          ? product.category
                          : (product.category[currentLanguage] || product.category.es)
                        : ""}
                    </span>
                    {product.sku && (
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                        SKU {product.sku}
                      </span>
                    )}
                    {product.available && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        {t("sports.available")}
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-extrabold">
                    {product.name[currentLanguage] || product.name.es}
                  </h1>

                  {typeof product.rating === "number" && product.rating > 0 && (
                    <div className="flex items-center gap-2">
                      {(() => {
                        const r = Number(product.rating || 0);
                        const full = Math.floor(r);
                        const half = r - full >= 0.5;
                        const empty = 5 - full - (half ? 1 : 0);
                        const Star = (props: {
                          key?: number;
                          className?: string;
                        }) => (
                          <svg
                            {...props}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.401 8.163L12 18.897l-7.335 3.864 1.401-8.163L.132 9.211l8.2-1.193z" />
                          </svg>
                        );
                        return (
                          <>
                            {Array.from({ length: full }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-yellow-400"
                              />
                            ))}
                            {half && (
                              <span className="relative w-5 h-5 inline-block">
                                <Star className="w-5 h-5 text-gray-500" />
                                <span
                                  className="absolute inset-0 overflow-hidden"
                                  style={{ width: "50%" }}
                                >
                                  <Star className="w-5 h-5 text-yellow-400" />
                                </span>
                              </span>
                            )}
                            {Array.from({ length: empty }).map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-gray-500" />
                            ))}
                          </>
                        );
                      })()}
                      <span className="text-sm text-gray-300">
                        {typeof product.votes === "number"
                          ? `(${product.votes})`
                          : ""}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                      {product.price_formatted
                        ? product.price_formatted
                        : `€ ${Number(product.price).toFixed(2)}`}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400">
                    {currentLanguage === "es"
                      ? "IVA incl. + gastos de envío"
                      : currentLanguage === "ca"
                      ? "IVA incl. + despeses d'enviament"
                      : "VAT incl. + shipping"}{" "}
                    ·{" "}
                    {currentLanguage === "es"
                      ? "Plazo de entrega 3–5 días laborables"
                      : currentLanguage === "ca"
                      ? "Termini de lliurament 3–5 dies laborables"
                      : "Delivery time 3–5 business days"}
                  </div>

                  <div className="text-sm text-gray-300">
                    {currentLanguage === "es"
                      ? "Tamaño del contenido:"
                      : currentLanguage === "ca"
                      ? "Mida del contingut:"
                      : "Content size:"}{" "}
                    {product.size}
                  </div>

                  {product.available && product.amazonLinks && (
                    <div className="flex flex-col gap-3">
                      <span className="text-sm text-gray-400">
                        {t("product.selectSize")}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(product.amazonLinks).map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`${
                              selectedSize === size
                                ? "bg-yellow-500 text-black"
                                : "bg-gray-800 text-gray-200"
                            } font-semibold px-3 py-1 rounded-lg border border-gray-700`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`flex flex-col sm:flex-row gap-3 transition-all duration-500 ${
                      enter
                        ? "opacity-100 translate-y-0 delay-200"
                        : "opacity-0 translate-y-3"
                    }`}
                  >
                    {product.available &&
                    product.amazonLinks &&
                    selectedSize ? (
                      <a
                        href={product.amazonLinks[selectedSize]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 text-center"
                      >
                        {t("sports.buy")} {selectedSize}
                      </a>
                    ) : (
                      <button
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
                        disabled={!product.available}
                        onClick={() => product.available && handleBuyNow()}
                      >
                        {product.available
                          ? t("sports.buy")
                          : t("sports.comingSoon")}
                      </button>
                    )}

                    {product.available && (
                      <button
                        onClick={handleAddToCart}
                        className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                      >
                        {t("sports.addToCart")}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`mt-10 transition-all mb-10 duration-500 ${
                  enter
                    ? "opacity-100 translate-y-0 delay-200"
                    : "opacity-0 translate-y-3"
                }`}
              >
                <Accordion
                  description={product.description[currentLanguage] || product.description.es}
                  objectives={
                    product.objectives && ((product.objectives[currentLanguage] || product.objectives.es)?.length)
                      ? (
                          <ul className="list-disc ml-5 space-y-1">
                            {(product.objectives[currentLanguage] || product.objectives.es)?.map((o, i) => (
                              <li key={i}>{o}</li>
                            ))}
                          </ul>
                        )
                      : undefined
                  }
                  nutritionalValues={
                    product.nutritionalValues
                      ? (product.nutritionalValues[currentLanguage] || product.nutritionalValues.es)
                      : undefined
                  }
                  application={
                    product.application
                      ? (product.application[currentLanguage] || product.application.es)
                      : undefined
                  }
                  recommendations={
                    product.recommendations
                      ? (product.recommendations[currentLanguage] || product.recommendations.es)
                      : undefined
                  }
                  defaultOpenId="descripcion"
                />
                <div className="hidden">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm md:text-base font-semibold text-white">
                        {t("payments.methods")}
                      </span>
                      <span className="text-xs md:text-sm text-gray-400">
                        {t("payments.processedByRedsys")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="sr-only">Visa</span>
                      <svg
                        aria-hidden="true"
                        className="h-6 w-auto"
                        viewBox="0 0 64 24"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="64"
                          height="24"
                          rx="4"
                          fill="#1A1F71"
                        />
                        <text
                          x="10"
                          y="16"
                          fill="#ffffff"
                          fontSize="12"
                          fontWeight="700"
                        >
                          VISA
                        </text>
                      </svg>
                      <span className="sr-only">Mastercard</span>
                      <svg
                        aria-hidden="true"
                        className="h-6 w-auto"
                        viewBox="0 0 64 24"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="64"
                          height="24"
                          rx="4"
                          fill="#000000"
                        />
                        <circle cx="28" cy="12" r="8" fill="#EB001B" />
                        <circle cx="36" cy="12" r="8" fill="#F79E1B" />
                      </svg>
                      <span className="sr-only">American Express</span>
                      <svg
                        aria-hidden="true"
                        className="h-6 w-auto"
                        viewBox="0 0 64 24"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="64"
                          height="24"
                          rx="4"
                          fill="#2E77BC"
                        />
                        <text
                          x="6"
                          y="16"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="700"
                        >
                          AMEX
                        </text>
                      </svg>
                      <span className="sr-only">Maestro</span>
                      <svg
                        aria-hidden="true"
                        className="h-6 w-auto"
                        viewBox="0 0 64 24"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="64"
                          height="24"
                          rx="4"
                          fill="#000000"
                        />
                        <circle cx="30" cy="12" r="8" fill="#EB001B" />
                        <circle cx="38" cy="12" r="8" fill="#0099DF" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm md:text-base font-semibold text-white">
                        {t("shipping.tipsa")}
                      </span>
                      <img
                        src="/tipsa.png"
                        alt="TIPSA"
                        className="h-6 md:h-7 w-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {typeof product.rating === "number" &&
                typeof product.votes === "number" &&
                product.rating > 0 &&
                product.votes > 0 && (
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name:
                          typeof product.name === "string"
                            ? product.name
                            : product.name[currentLanguage],
                        image: product.image,
                        sku: product.sku,
                        aggregateRating: {
                          "@type": "AggregateRating",
                          ratingValue: Number(product.rating).toFixed(1),
                          reviewCount: product.votes,
                        },
                      }),
                    }}
                  />
                )}

              {product.available && !checkoutOpenGlobal && (
                <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                  <div className="bg-black/80 backdrop-blur border-t border-gray-800 px-4 py-3 flex items-center justify-between">
                    <div className="font-bold">
                      {product.price_formatted
                        ? product.price_formatted
                        : `€ ${Number(product.price).toFixed(2)}`}
                    </div>
                    <div className="flex gap-2">
                      {product.amazonLinks && selectedSize ? (
                        <a
                          href={product.amazonLinks[selectedSize]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg"
                        >
                          {t("sports.buy")}
                        </a>
                      ) : (
                        <button
                          onClick={handleBuyNow}
                          className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg"
                        >
                          {t("sports.buy")}
                        </button>
                      )}
                      <button
                        onClick={handleAddToCart}
                        className="bg-gray-900 text-white font-bold px-4 py-2 rounded-lg"
                      >
                        {t("sports.addToCart")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
        <InfoStripe />
        {product && (
          <>
            <div className="w-full border-t border-gray-800">
              <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
                <div className="text-2xl md:text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                  {t("recommendedTogether.title")}
                </div>
                <RecommendedTogether
                  currentId={product.id}
                  sportId={product.sportId}
                  language={currentLanguage}
                />
              </div>
            </div>
            <div className="w-full border-t border-gray-800">
              <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
                <div className="text-2xl md:text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                  {t("faq.title")}
                </div>
                <Faq language={currentLanguage} items={faqItems} />
              </div>
            </div>
            <div className="w-full border-t border-gray-800">
              <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 mb-20">
                <RelatedProducts
                  sportId={product.sportId}
                  currentId={product.id}
                  language={currentLanguage}
                  title={t('relatedProducts.title')}
                />
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
        productName={product ? product.name[currentLanguage] : undefined}
      />
    </div>
  );
};

export default ProductDetailPage;
