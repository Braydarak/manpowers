import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import useIsMobile from "../hooks/useIsMobile";
import productsService, { type Product } from "../services/productsService";
import { updateSEOTags } from "../utils/seoConfig";
import Accordion from "../components/accordion";
import RecommendedTogether from "../components/recommended-together";
import Faq from "../components/faq";
import RelatedProducts from "../components/related-products";
import InfoStripe from "../components/info/InfoStripe";

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
  pricesBySize?: { [key: string]: string };
  img_folder?: string;
  faqs?: {
    es?: { question: string; answer: string }[];
    en?: { question: string; answer: string }[];
    ca?: { question: string; answer: string }[];
  };
};

const ProductDetailPage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  const {
    sportId: sportParam,
    id,
    slug,
  } = useParams<{
    sportId?: string;
    id?: string;
    slug?: string;
  }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const baseLang =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "es";
  const currentLanguage: "es" | "en" | "ca" =
    baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";
  const isMobile = useIsMobile();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [checkoutOpenGlobal, setCheckoutOpenGlobal] = useState<boolean>(false);
  const [menuOpenGlobal, setMenuOpenGlobal] = useState<boolean>(false);
  const [faqItems, setFaqItems] = useState<
    { id: string; question: string; answer: string }[]
  >([]);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomCoords, setZoomCoords] = useState<{ x: number; y: number }>({
    x: 0.7,
    y: 0.7,
  });
  const [mediaItems, setMediaItems] = useState<
    { type: "image" | "video"; src: string; path: string }[]
  >([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const [areMainButtonsVisible, setAreMainButtonsVisible] = useState(true);

  const mainButtonsRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setAreMainButtonsVisible(entry.isIntersecting);
        },
        {
          threshold: 0,
        },
      );
      observerRef.current.observe(node);
    }
  }, []);

  useEffect(() => {
    const onMenuToggle = (e: Event) => {
      const ce = e as CustomEvent<boolean>;
      setMenuOpenGlobal(Boolean(ce.detail));
    };
    window.addEventListener("header:menuOpen", onMenuToggle as EventListener);
    return () => {
      window.removeEventListener(
        "header:menuOpen",
        onMenuToggle as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    const isVisible =
      product?.available &&
      !checkoutOpenGlobal &&
      !menuOpenGlobal &&
      !areMainButtonsVisible;
    window.dispatchEvent(
      new CustomEvent("sticky-bar:visibility", { detail: isVisible }),
    );
  }, [product, checkoutOpenGlobal, menuOpenGlobal, areMainButtonsVisible]);

  useEffect(() => {
    return () => {
      window.dispatchEvent(
        new CustomEvent("sticky-bar:visibility", { detail: false }),
      );
    };
  }, []);

  useLanguageUpdater();

  const getPriceForSize = (size?: string) => {
    if (!product || !size || !product.pricesBySize) return undefined;
    const directVal = product.pricesBySize[size];
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
    const normalizedTarget = normalize(size);
    if (typeof directVal === "string") {
      const num = parseFloat(directVal.replace(",", "."));
      return Number.isFinite(num) ? num : undefined;
    }
    const matchedKey = Object.keys(product.pricesBySize).find(
      (k) => normalize(k) === normalizedTarget,
    );
    const val = matchedKey ? product.pricesBySize[matchedKey] : undefined;
    if (!val) return undefined;
    const num = parseFloat(val.replace(",", "."));
    return Number.isFinite(num) ? num : undefined;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, slug]);

  useEffect(() => {
    if (!product) return;
    const title = `${
      product.name[currentLanguage] || product.name.es
    } | MΛN POWERS`;
    const description =
      product.description[currentLanguage] || product.description.es;
    const keywords = `${product.name[currentLanguage] || product.name.es}, ${
      typeof product.category === "string"
        ? product.category
        : product.category[currentLanguage] || product.category.es
    }, MΛN POWERS`;
    const ogImage =
      mediaItems.find((m) => m.type === "image")?.src ||
      product.image ||
      "/MAN-LOGO-BLANCO.png";
    const canonicalPath =
      typeof window !== "undefined"
        ? window.location.pathname
        : slug
          ? `/product/${slug}`
          : `/product/${id}`;
    updateSEOTags({
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      canonicalUrl: `https://manpowers.es${canonicalPath}`,
    });
  }, [product, currentLanguage, id, slug, mediaItems]);

  useEffect(() => {
    const toSlug = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
    const loadProduct = async () => {
      if (!id && !slug) return;
      setLoading(true);
      setError("");

      try {
        if (id) {
          const productsById = await productsService.getProducts({
            id: Number(id),
          });
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
            pricesBySize: p.pricesBySize,
            nutritionalValues: p.nutritionalValues,
            application: p.application,
            recommendations: p.recommendations,
            rating: p.rating,
            votes: p.votes,
          }),
        );

        if (id) {
          const byId = normalized.find(
            (p: Product) => String(p.id) === String(id),
          );
          if (byId) {
            setProduct(byId);
            return;
          }
        }

        if (slug) {
          const base = sportParam
            ? normalized.filter(
                (p) => p.sportId === sportParam || p.sportId === "multisport",
              )
            : normalized;
          const found = base.find(
            (p) =>
              toSlug(p.name.es) === slug ||
              toSlug(p.name.en) === slug ||
              toSlug(p.name.ca || "") === slug,
          );
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
    const loadMedia = async () => {
      if (!product) {
        setMediaItems([]);
        setActiveMediaIndex(0);
        return;
      }
      try {
        const res = await fetch("/products.json");
        const data = await res.json();
        const raw = (data.products || []) as ProductJson[];
        const found = raw.find((x) => String(x.id) === String(product.id));
        const folder = found?.img_folder;
        if (folder) {
          const all = import.meta.glob(
            "/src/assets/**/*.{png,jpg,jpeg,webp,mp4,webm}",
            {
              eager: true,
              query: "?url",
              import: "default",
            },
          ) as Record<string, string>;
          const entries = Object.entries(all).filter(([p]) =>
            p.includes(`/src/assets/${folder}/`),
          );
          const isImage = (p: string) =>
            /\.(png|jpe?g|webp)$/i.test(p.split("?")[0] || p);
          const isVideo = (p: string) =>
            /\.(mp4|webm)$/i.test(p.split("?")[0] || p);
          const mapped = entries
            .map(([path, url]) => {
              if (isImage(path))
                return { type: "image" as const, src: url, path };
              if (isVideo(path))
                return { type: "video" as const, src: url, path };
              return null;
            })
            .filter(Boolean) as {
            type: "image" | "video";
            src: string;
            path: string;
          }[];
          const images = mapped
            .filter((m) => m.type === "image")
            .sort((a, b) => a.path.localeCompare(b.path));
          const videos = mapped
            .filter((m) => m.type === "video")
            .sort((a, b) => a.path.localeCompare(b.path));
          let finalList = [...images, ...videos];
          if (product.image) {
            const desiredName = product.image.split("/").pop();
            if (desiredName) {
              const idx = finalList.findIndex(
                (m) =>
                  m.type === "image" && m.path.split("/").pop() === desiredName,
              );
              if (idx > 0) {
                const [item] = finalList.splice(idx, 1);
                finalList = [item, ...finalList];
              } else if (idx === -1) {
                finalList = [
                  {
                    type: "image",
                    src: product.image,
                    path: product.image,
                  },
                  ...finalList,
                ];
              }
            }
          }
          setMediaItems(finalList);
          setActiveMediaIndex(0);
          return;
        }
        const fallbackList = product.image
          ? [
              {
                type: "image" as const,
                src: product.image,
                path: product.image,
              },
            ]
          : [];
        setMediaItems(fallbackList);
        setActiveMediaIndex(0);
      } catch {
        const fallbackList = product.image
          ? [
              {
                type: "image" as const,
                src: product.image,
                path: product.image,
              },
            ]
          : [];
        setMediaItems(fallbackList);
        setActiveMediaIndex(0);
      }
    };
    loadMedia();
  }, [product]);

  useEffect(() => {
    const current = mediaItems[activeMediaIndex];
    if (!current || current.type === "video") setZoomActive(false);
  }, [activeMediaIndex, mediaItems]);

  useEffect(() => {
    const loadFaqs = async () => {
      if (!id) return;
      try {
        const response = await fetch("/products.json");
        const data = await response.json();
        const p = (data.products || []).find(
          (x: ProductJson) => String(x.id) === String(id),
        );
        const langItems = Array.isArray(p?.faqs?.[currentLanguage])
          ? p.faqs[currentLanguage]
          : Array.isArray(p?.faqs?.es)
            ? p.faqs.es
            : [];
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
      onCheckoutToggle as EventListener,
    );
    return () => {
      window.removeEventListener(
        "cart:checkoutOpen",
        onCheckoutToggle as EventListener,
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
    if (!product) {
      setSelectedSize(null);
      return;
    }
    const keys = product.amazonLinks
      ? Object.keys(product.amazonLinks)
      : product.pricesBySize
        ? Object.keys(product.pricesBySize)
        : [];
    if (keys.length > 0) {
      const preferred = keys.find((k) => k.toLowerCase() === "100ml");
      setSelectedSize(preferred || keys[0]);
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
    const priceBySize = getPriceForSize(selectedSize || undefined);
    const computedPrice =
      typeof priceBySize === "number" ? priceBySize : product.price;

    let finalName = product.name[currentLanguage];
    let finalId = String(product.id);

    // Si es indumentaria y hay talla seleccionada, añadir al nombre y al ID
    if (
      (typeof product.category === "string"
        ? product.category
        : product.category.es
      )?.toLowerCase() === "indumentaria" &&
      selectedSize
    ) {
      finalName = `${finalName} (${selectedSize})`;
      finalId = `${finalId}-${selectedSize}`;
    }

    const detail = {
      id: finalId,
      name: finalName,
      price: computedPrice,
      image: mediaItems.find((m) => m.type === "image")?.src || product.image,
      quantity: 1,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  const handleBuyNow = () => {
    if (!product) return;
    const priceBySize = getPriceForSize(selectedSize || undefined);
    const computedPrice =
      typeof priceBySize === "number" ? priceBySize : product.price;

    let finalName = product.name[currentLanguage];
    let finalId = String(product.id);

    // Si es indumentaria y hay talla seleccionada, añadir al nombre y al ID
    if (
      (typeof product.category === "string"
        ? product.category
        : product.category.es
      )?.toLowerCase() === "indumentaria" &&
      selectedSize
    ) {
      finalName = `${finalName} (${selectedSize})`;
      finalId = `${finalId}-${selectedSize}`;
    }

    const detail = {
      id: finalId,
      name: finalName,
      price: computedPrice,
      image: mediaItems.find((m) => m.type === "image")?.src || product.image,
      quantity: 1,
      buyNow: true,
      openCheckout: true,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  const handleShareWhatsApp = () => {
    if (typeof window === "undefined" || !product) return;
    const shareUrl = window.location.href;
    const name = product.name[currentLanguage] || product.name.es;
    const text = `${name} - ${shareUrl}`;
    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareInstagram = () => {
    if (typeof window === "undefined" || !product) return;
    const shareUrl = window.location.href;
    const name = product.name[currentLanguage] || product.name.es;
    const text = `${name}`;
    if (typeof navigator !== "undefined") {
      const nav = navigator as Navigator & {
        share?: (data: {
          title?: string;
          text?: string;
          url?: string;
        }) => Promise<void>;
      };
      if (nav.share) {
        nav
          .share({
            title: name,
            text,
            url: shareUrl,
          })
          .catch(() => {});
        return;
      }
    }
    const encodedUrl = encodeURIComponent(shareUrl);
    const instagramUrl = `https://www.instagram.com/?url=${encodedUrl}`;
    window.open(instagramUrl, "_blank");
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
    <div className="flex flex-col min-h-screen bg-[var(--color-primary)] text-black">
      <Header />
      <main
        className={`flex-grow  transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {loading ? (
            <div className="py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="animate-pulse bg-black/5 rounded-xl h-[360px]"></div>
                <div className="space-y-4">
                  <div className="animate-pulse h-8 w-2/3 bg-black/10 rounded"></div>
                  <div className="animate-pulse h-4 w-full bg-black/10 rounded"></div>
                  <div className="animate-pulse h-4 w-5/6 bg-black/10 rounded"></div>
                  <div className="animate-pulse h-10 w-1/2 bg-black/10 rounded"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-bold mb-4">{error}</h2>
              <button
                onClick={handleBack}
                className="bg-[var(--color-secondary)] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:brightness-90"
              >
                {t("cart.back")}
              </button>
            </div>
          ) : product ? (
            <>
              <section className="py-6 mt-15 md:mt-24">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={goToSport}
                    className="text-[var(--color-secondary)] hover:underline underline-offset-2  cursor-pointer flex items-center gap-2 transition-colors hover:brightness-90"
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
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div className="relative">
                  <div
                    className={`group bg-[var(--color-primary)] rounded-xl overflow-hidden border border-black/10 shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-500 ${
                      enter
                        ? "opacity-100 translate-y-0 delay-100"
                        : "opacity-0 translate-y-3"
                    }`}
                  >
                    <div
                      className="relative aspect-[4/3] bg-black"
                      onMouseEnter={() => {
                        const current = mediaItems[activeMediaIndex];
                        if (!isMobile && current && current.type === "image")
                          setZoomActive(true);
                      }}
                      onMouseLeave={() => {
                        setZoomActive(false);
                      }}
                      onMouseMove={(e) => {
                        const current = mediaItems[activeMediaIndex];
                        if (isMobile || !current || current.type !== "image")
                          return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const rawX = (e.clientX - rect.left) / rect.width;
                        const rawY = (e.clientY - rect.top) / rect.height;
                        const x = Math.max(0, Math.min(1, rawX));
                        const y = Math.max(0, Math.min(1, rawY));
                        setZoomCoords({ x, y });
                      }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {mediaItems.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!mediaItems.length) return;
                              setActiveMediaIndex((prev) =>
                                prev === 0 ? mediaItems.length - 1 : prev - 1,
                              );
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                            aria-label="Anterior"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M15 18l-6-6 6-6" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!mediaItems.length) return;
                              setActiveMediaIndex((prev) =>
                                prev === mediaItems.length - 1 ? 0 : prev + 1,
                              );
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                            aria-label="Siguiente"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 6l6 6-6 6" />
                            </svg>
                          </button>
                        </>
                      )}
                      {(() => {
                        const current = mediaItems[activeMediaIndex];
                        const altText =
                          product.name[currentLanguage] || product.name.es;
                        if (!current || current.type === "image") {
                          const src =
                            current?.src ||
                            mediaItems.find((m) => m.type === "image")?.src ||
                            product.image;
                          return (
                            <img
                              src={src}
                              alt={altText}
                              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[0.5deg]"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = "none";
                                if (target.parentElement) {
                                  target.parentElement.innerHTML = `<span class='block p-6 text-gray-400'>${t(
                                    "sports.imageNotAvailable",
                                  )}</span>`;
                                }
                              }}
                            />
                          );
                        }
                        return (
                          <video
                            src={current.src}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls={false}
                            disablePictureInPicture
                          />
                        );
                      })()}
                      <div
                        className={`hidden md:block pointer-events-none absolute border border-[var(--color-secondary)] bg-black/10 transition-opacity duration-150 ${
                          zoomActive
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-90"
                        }`}
                        style={{
                          width: 140,
                          height: 140,
                          left: `${zoomCoords.x * 100}%`,
                          top: `${zoomCoords.y * 100}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`hidden md:block pointer-events-none absolute z-30 border-2 border-[var(--color-secondary)] rounded-xl overflow-hidden bg-black shadow-[0_12px_36px_rgba(0,0,0,0.45)] transition-opacity duration-200 ${zoomActive ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{
                      width: 500,
                      height: 500,
                      top: "50%",
                      left: "100%",
                      marginLeft: 24,
                      transform: "translateY(-50%)",
                      backgroundImage: (() => {
                        const current = mediaItems[activeMediaIndex];
                        return current && current.type === "image"
                          ? `url(${current.src})`
                          : "none";
                      })(),
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "500% 500%",
                      backgroundPosition: `${zoomCoords.x * 100}% ${zoomCoords.y * 100}%`,
                    }}
                  />
                  {mediaItems.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {mediaItems.map((m, i) => (
                        <button
                          key={`${m.path}-${i}`}
                          type="button"
                          onClick={() => setActiveMediaIndex(i)}
                          className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border ${i === activeMediaIndex ? "border-[var(--color-secondary)]" : "border-black/10"} bg-black/5`}
                          aria-label={`media-${i + 1}`}
                        >
                          {m.type === "image" ? (
                            <img
                              src={m.src}
                              alt={`media-${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center bg-black/60 text-white">
                              <svg
                                viewBox="0 0 24 24"
                                className="w-6 h-6"
                                fill="currentColor"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={`flex flex-col gap-3.5 transition-all duration-500 ${
                    enter
                      ? "opacity-100 translate-y-0 delay-150"
                      : "opacity-0 translate-y-3"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wide">
                      {product.category
                        ? typeof product.category === "string"
                          ? product.category
                          : product.category[currentLanguage] ||
                            product.category.es
                        : ""}
                    </span>
                    {product.sku && (
                      <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                        SKU {product.sku}
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-extrabold">
                    {product.name[currentLanguage] || product.name.es}
                  </h1>

                  {typeof product.rating === "number" && product.rating > 0 && (
                    <div className="flex items-center gap-0.5">
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
                      <span className="text-sm text-black/60">
                        {typeof product.votes === "number"
                          ? `(${product.votes})`
                          : ""}
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-[var(--color-secondary)]">
                      {(() => {
                        const bySize = getPriceForSize(
                          selectedSize || undefined,
                        );
                        if (typeof bySize === "number") {
                          return `€ ${bySize.toFixed(2)}`;
                        }
                        return product.price_formatted
                          ? product.price_formatted
                          : `€ ${Number(product.price).toFixed(2)}`;
                      })()}
                    </span>
                    <span className="text-sm text-gray-500 ml-2 font-normal">
                      + IVA
                    </span>
                  </div>
                  <div className="text-xs text-black/60">
                    {currentLanguage === "es"
                      ? "Plazo de entrega 3–5 días laborables"
                      : currentLanguage === "ca"
                        ? "Termini de lliurament 3–5 dies laborables"
                        : "Delivery time 3–5 business days"}
                  </div>

                  {(selectedSize || product.size) && (
                    <div className="text-sm text-black/70">
                      {currentLanguage === "es"
                        ? "Tamaño del contenido:"
                        : currentLanguage === "ca"
                          ? "Mida del contingut:"
                          : "Content size:"}{" "}
                      {selectedSize || product.size}
                    </div>
                  )}

                  {product.available &&
                    (product.amazonLinks || product.pricesBySize) && (
                      <div className="flex flex-col gap-3">
                        <span className="text-sm text-black/60">
                          {t("product.selectSize")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(product.amazonLinks
                            ? Object.keys(product.amazonLinks)
                            : Object.keys(product.pricesBySize || {})
                          ).map((size) => {
                            const num = getPriceForSize(size);
                            const priceText =
                              typeof num === "number"
                                ? `€ ${num.toFixed(2)}`
                                : product.price_formatted ||
                                  `€ ${Number(product.price).toFixed(2)}`;
                            return (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`${
                                  selectedSize === size
                                    ? "bg-[var(--color-secondary)] text-white"
                                    : "bg-[var(--color-primary)] text-black"
                                } font-semibold px-3 py-1 rounded-lg border border-black/20 transition-colors`}
                              >
                                {product.pricesBySize
                                  ? `${size} - ${priceText}`
                                  : size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {product.available &&
                    !product.amazonLinks &&
                    !product.pricesBySize &&
                    (typeof product.category === "string"
                      ? product.category
                      : product.category.es
                    )?.toLowerCase() === "indumentaria" &&
                    typeof product.size === "string" && (
                      <div className="flex flex-col gap-3">
                        <span className="text-sm text-black/60">
                          {t("product.selectSize")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.size
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s)
                            .map((size) => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`${
                                  selectedSize === size
                                    ? "bg-[var(--color-secondary)] text-white"
                                    : "bg-[var(--color-primary)] text-black hover:bg-black/5"
                                } font-semibold px-3 py-1 rounded-lg border border-black/20 transition-colors`}
                              >
                                {size}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                  <div
                    ref={mainButtonsRef}
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
                        className="bg-[var(--color-secondary)] text-white font-bold py-3 px-6 text-lg rounded-md transition-all duration-300 hover:brightness-90 text-center"
                      >
                        {t("sports.buy")} {selectedSize}
                      </a>
                    ) : (
                      <button
                        className="bg-[var(--color-secondary)] text-white font-bold text-lg py-4 px-10 rounded-md transition-all duration-300 hover:brightness-90"
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
                        className="bg-black hover:bg-black/90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                      >
                        {t("sports.addToCart")}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm text-black/70">
                      Compartir en
                    </span>
                    <button
                      onClick={handleShareInstagram}
                      className="flex md:hidden items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-primary)] text-black border border-black/20 hover:shadow-md transition-all cursor-pointer"
                      aria-label="Compartir en Instagram"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="6"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="5"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle cx="17" cy="7" r="1.2" fill="currentColor" />
                      </svg>
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-primary)] text-black border border-black/20 hover:shadow-md transition-all cursor-pointer"
                      aria-label="Compartir en WhatsApp"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                      >
                        <path
                          d="M12 3.2a8.3 8.3 0 00-7.2 12.5L4 21l5.5-1.7A8.3 8.3 0 1012 3.2z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.8 9.5c.2-.4.3-.6.6-.6.2 0 .4 0 .6.1.2.2.5.7.6.9.1.2.1.3 0 .5s-.2.3-.3.4-.2.2-.1.3c.1.2.4.7.9 1.1.6.5 1.1.6 1.3.7.1 0 .3 0 .4-.2l.3-.3c.1-.1.2-.2.4-.1l1 .5c.2.1.5.2.5.4 0 .3-.2.9-.6 1.2-.4.3-.9.4-1.5.4-.4 0-.8 0-1.2-.1-.4-.1-1-.3-1.6-.7a7.2 7.2 0 01-2.2-2.1c-.2-.3-.6-.8-.8-1.4-.2-.6-.3-1-.3-1.4 0-.4.2-.8.4-1.1.2-.3.5-.4.7-.4.2 0 .5 0 .6.1z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`mt-5 transition-all mb-5 duration-500 ${
                  enter
                    ? "opacity-100 translate-y-0 delay-200"
                    : "opacity-0 translate-y-3"
                }`}
              >
                <Accordion
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
                        image:
                          mediaItems.find((m) => m.type === "image")?.src ||
                          product.image,
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

              {product.available &&
                !checkoutOpenGlobal &&
                !areMainButtonsVisible && (
                  <div className="hidden">
                    {/* Placeholder for removed sticky bar */}
                  </div>
                )}
            </>
          ) : null}
        </div>
        <InfoStripe />
        {product && (
          <>
            <div className="w-full border-t border-black/10">
              <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
                <div className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-[var(--color-secondary)]">
                  {t("recommendedTogether.title")}
                </div>
                <RecommendedTogether
                  currentId={product.id}
                  sportId={product.sportId}
                  language={currentLanguage}
                />
              </div>
            </div>
            {!(
              (typeof product.category === "string"
                ? product.category
                : product.category.es
              )?.toLowerCase() === "indumentaria"
            ) && (
              <div className="w-full border-t border-black/10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
                  <div className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-[var(--color-secondary)]">
                    {t("faq.title")}
                  </div>
                  <Faq language={currentLanguage} items={faqItems} />
                </div>
              </div>
            )}
            <div className="w-full border-t border-black/10">
              <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 mb-20">
                <RelatedProducts
                  sportId={product.sportId}
                  currentId={product.id}
                  language={currentLanguage}
                  title={t("relatedProducts.title")}
                />
              </div>
            </div>
          </>
        )}
      </main>
      {product &&
        product.available &&
        !checkoutOpenGlobal &&
        !menuOpenGlobal &&
        !areMainButtonsVisible && (
          <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="bg-[var(--color-primary)]/95 backdrop-blur border-t border-black/10 px-4 py-3 flex items-center justify-between shadow-[0_-6px_20px_rgba(0,0,0,0.12)]">
              <div className="font-bold text-2xl text-[var(--color-secondary)]">
                {(() => {
                  const bySize = getPriceForSize(selectedSize || undefined);
                  if (typeof bySize === "number") {
                    return `€ ${bySize.toFixed(2)}`;
                  }
                  return product.price_formatted
                    ? product.price_formatted
                    : `€ ${Number(product.price).toFixed(2)}`;
                })()}
              </div>
              <div className="flex gap-2">
                {product.amazonLinks && selectedSize ? (
                  <a
                    href={product.amazonLinks[selectedSize]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[var(--color-secondary)] text-white font-bold px-6 py-2 rounded-lg"
                  >
                    {t("sports.buy")}
                  </a>
                ) : (
                  <button
                    onClick={handleBuyNow}
                    className="bg-[var(--color-secondary)] text-white font-bold px-4 py-2 rounded-lg"
                  >
                    {t("sports.buy")}
                  </button>
                )}
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white font-bold px-4 py-2 rounded-lg hover:bg-black/90 flex items-center justify-center"
                  aria-label={t("sports.addToCart")}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
