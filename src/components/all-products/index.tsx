import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import productsService, { type Product } from "../../services/productsService";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  language: "es" | "en" | "ca";
  title?: string;
};

type ProductJson = {
  id: number;
  name: { es: string; en: string };
  description: { es: string; en: string };
  price: string | number;
  price_formatted?: string;
  size: string;
  image: string;
  category: { es: string; en: string } | string;
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

const ProductSlider: React.FC<{
  title: string;
  items: Product[];
  loading: boolean;
  error: string;
  language: "es" | "en" | "ca";
}> = ({ title, items, loading, error, language }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [canLeft, setCanLeft] = useState<boolean>(false);
  const [canRight, setCanRight] = useState<boolean>(false);
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);
  const [perPage, setPerPage] = useState<number>(4);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const [autoScrollPaused, setAutoScrollPaused] = useState<boolean>(false);
  const autoIntervalRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);

  const updateArrows = () => {
    const el = containerRef.current;
    if (!el) {
      setCanLeft(false);
      setCanRight(false);
      return;
    }
    const firstCard = el.querySelector<HTMLElement>(".rp-card");
    const cardWidth = firstCard?.offsetWidth || 256;
    const GAP = 24; // Updated gap to match new design
    const pp = window.innerWidth < 768 ? 1 : 4;
    const width = cardWidth * pp + GAP * (pp - 1);
    setPerPage(pp);
    setPageWidth(width);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft < maxScroll - 2;
    setCanLeft(left);
    setCanRight(right);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateArrows();
    const onScroll = () => updateArrows();
    const onResize = () => updateArrows();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [items]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (autoScrollPaused || items.length === 0) return;
    const tick = () => {
      const firstCard = el.querySelector<HTMLElement>(".rp-card");
      const cardWidth = firstCard?.offsetWidth || 256;
      const GAP = 24;
      const pageDelta = cardWidth * perPage + GAP * (perPage - 1);
      const maxScroll = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + pageDelta;
      const target = next >= maxScroll - 2 ? 0 : Math.min(maxScroll, next);
      el.scrollTo({ left: target, behavior: "smooth" });
      setTimeout(updateArrows, 350);
    };
    // Randomize start to avoid sync
    const id = window.setTimeout(() => {
      autoIntervalRef.current = window.setInterval(
        tick,
        3500 + Math.random() * 1000,
      );
    }, Math.random() * 2000);

    return () => {
      window.clearTimeout(id);
      if (autoIntervalRef.current !== null) {
        window.clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    };
  }, [autoScrollPaused, perPage, items]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      if (autoIntervalRef.current !== null) {
        window.clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    };
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>(".rp-card");
    const cardWidth = firstCard?.offsetWidth || 256;
    const GAP = 24;
    const pageDelta = cardWidth * perPage + GAP * (perPage - 1);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = Math.max(
      0,
      Math.min(
        maxScroll,
        el.scrollLeft + (dir === "left" ? -pageDelta : pageDelta),
      ),
    );
    el.scrollTo({ left: target, behavior: "smooth" });
    setTimeout(updateArrows, 350);
  };

  const pauseAutoScroll = (ms: number) => {
    setAutoScrollPaused(true);
    if (pauseTimeoutRef.current !== null) {
      window.clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = window.setTimeout(() => {
      setAutoScrollPaused(false);
    }, ms);
  };

  const onArrowClick = (dir: "left" | "right") => {
    scrollByAmount(dir);
    pauseAutoScroll(15000);
  };

  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");

  const openDetail = (p: Product) => {
    if (!p?.sportId) return;
    const slug = toSlug(p.name[language] || p.name.es);
    navigate(`/products/${p.sportId}/${slug}`);
  };

  const addToCart = (p: Product) => {
    const detail = {
      id: String(p.id),
      name: p.name[language] || p.name.es,
      price: p.price,
      image: p.image,
      quantity: 1,
      openCart: true,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  return (
    <div className="relative py-8">
      {(title || "") && (
        <div className="flex items-center justify-between mb-8 px-4 md:px-0">
          <div className="text-2xl md:text-4xl font-extrabold uppercase text-white">
            {title}
          </div>

          {/* Desktop Arrows */}
          <div className="hidden md:flex gap-2">
            <button
              type="button"
              disabled={!canLeft}
              onClick={() => onArrowClick("left")}
              className={`p-2 rounded-full border transition-all duration-300 ${
                canLeft
                  ? "bg-zinc-900 border-zinc-700 text-yellow-400 hover:bg-zinc-800 hover:border-yellow-400/50"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              disabled={!canRight}
              onClick={() => onArrowClick("right")}
              className={`p-2 rounded-full border transition-all duration-300 ${
                canRight
                  ? "bg-zinc-900 border-zinc-700 text-yellow-400 hover:bg-zinc-800 hover:border-yellow-400/50"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <div className="relative group/carousel">
        {/* Mobile Arrows (Overlay) */}
        {canLeft && (
          <button
            className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white border border-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onArrowClick("left");
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canRight && (
          <button
            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white border border-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onArrowClick("right");
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          ref={containerRef}
          className="overflow-x-auto no-scrollbar mx-auto snap-x snap-mandatory px-4 md:px-0 pb-8"
          style={pageWidth ? { width: pageWidth } : undefined}
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStartXRef.current = t.clientX;
            touchDeltaXRef.current = 0;
          }}
          onTouchMove={(e) => {
            const t = e.touches[0];
            if (touchStartXRef.current !== null) {
              touchDeltaXRef.current = t.clientX - touchStartXRef.current;
            }
          }}
          onTouchEnd={() => {
            const dx = touchDeltaXRef.current;
            touchStartXRef.current = null;
            touchDeltaXRef.current = 0;
            const TH = 48;
            if (Math.abs(dx) > TH) {
              scrollByAmount(dx > 0 ? "left" : "right");
            }
            pauseAutoScroll(10000);
          }}
        >
          <div className="flex gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[85vw] md:min-w-[280px] bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-zinc-800 rounded-xl mb-4" />
                  <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-zinc-800 rounded" />
                  <div className="mt-6 flex justify-between items-center">
                    <div className="h-6 w-20 bg-zinc-800 rounded" />
                    <div className="h-10 w-10 bg-zinc-800 rounded-lg" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="w-full text-center py-12">
                <div className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg inline-block border border-red-400/20">
                  {error}
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-zinc-400 px-3 py-2">
                {t("email.noProducts")}
              </div>
            ) : (
              items.map((p) => (
                <div
                  key={p.id}
                  onClick={() => openDetail(p)}
                  className="rp-card group relative min-w-[85vw] md:min-w-[280px] bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 hover:bg-zinc-900 hover:border-yellow-500/30 transition-all duration-300 cursor-pointer snap-center md:snap-start flex flex-col shadow-lg shadow-black/20 hover:shadow-yellow-500/5 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] bg-black/40 rounded-xl overflow-hidden mb-4 border border-white/5">
                    <img
                      src={p.image}
                      alt={p.name[language] || p.name.es}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    {!p.available && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {t("products.outOfStock") || "Agotado"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="text-xs font-medium text-yellow-500/90 mb-1.5 uppercase tracking-wider">
                      {typeof p.category === "string"
                        ? p.category
                        : p.category[language] || p.category.es}
                    </div>

                    <div className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                      {p.name[language] || p.name.es}
                    </div>

                    {typeof p.rating === "number" &&
                      typeof p.votes === "number" &&
                      p.rating > 0 &&
                      p.votes > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          {(() => {
                            const r = Number(p.rating || 0);
                            const full = Math.floor(r);
                            const half = r - full >= 0.5;
                            const empty = 5 - full - (half ? 1 : 0);
                            const Star = (props: { className?: string }) => (
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
                                    key={`f-${i}`}
                                    className="w-3.5 h-3.5 text-yellow-400"
                                  />
                                ))}
                                {half && (
                                  <span className="relative w-3.5 h-3.5 inline-block">
                                    <Star className="w-3.5 h-3.5 text-zinc-600" />
                                    <span
                                      className="absolute inset-0 overflow-hidden"
                                      style={{ width: "50%" }}
                                    >
                                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                                    </span>
                                  </span>
                                )}
                                {Array.from({ length: empty }).map((_, i) => (
                                  <Star
                                    key={`e-${i}`}
                                    className="w-3.5 h-3.5 text-zinc-600"
                                  />
                                ))}
                              </>
                            );
                          })()}
                          <span className="text-xs text-zinc-500 ml-1">
                            ({p.votes})
                          </span>
                        </div>
                      )}

                    <div className="mt-auto pt-3 flex items-end justify-between gap-3 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase font-medium">
                          Precio
                        </span>
                        <span className="text-xl font-bold text-white tracking-tight">
                          {p.price_formatted
                            ? p.price_formatted
                            : `€ ${Number(p.price).toFixed(2)}`}
                        </span>
                      </div>

                      {p.available && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p);
                          }}
                          className="bg-yellow-400 hover:bg-yellow-300 text-black p-2.5 rounded-xl transition-all shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/30 hover:scale-105 active:scale-95 flex items-center justify-center group/btn"
                          aria-label={t("sports.addToCart")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover/btn:rotate-[-10deg] transition-transform"
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AllProducts: React.FC<Props> = ({ language }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        let all: Product[] = [];
        try {
          const fetched = await productsService.getProducts();
          all = fetched;
        } catch {
          all = [];
        }
        if (!all || all.length === 0) {
          const response = await fetch("/products.json");
          const data = await response.json();
          all = ((data.products as ProductJson[]) || []).map(
            (p: ProductJson) => ({
              id: p.id,
              name: p.name,
              description: p.description,
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
            }),
          );
        }
        setItems(all);
      } catch {
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cosmetics = items.filter((p) => {
    const cat = typeof p.category === "string" ? p.category : p.category.es;
    const lowerCat = cat.toLowerCase();
    return (
      lowerCat.includes("cuidado") ||
      lowerCat.includes("suplementos") ||
      (p.sportId === "multisport" && !lowerCat.includes("indumentaria"))
    );
  });

  const apparel = items.filter((p) => {
    const cat = typeof p.category === "string" ? p.category : p.category.es;
    return cat.toLowerCase().includes("indumentaria");
  });

  const titles = {
    cosmetics: {
      es: "Cosmética",
      en: "Cosmetics",
      ca: "Cosmètica",
    },
    apparel: {
      es: "Indumentaria",
      en: "Apparel",
      ca: "Indumentària",
    },
  };

  return (
    <div className="flex flex-col gap-12">
      <ProductSlider
        title={titles.cosmetics[language] || titles.cosmetics.es}
        items={cosmetics}
        loading={loading}
        error={error}
        language={language}
      />

      {cosmetics.length > 0 && apparel.length > 0 && (
        <div className="w-full px-4 md:px-0">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}

      <ProductSlider
        title={titles.apparel[language] || titles.apparel.es}
        items={apparel}
        loading={loading}
        error={error}
        language={language}
      />
    </div>
  );
};

export default AllProducts;
