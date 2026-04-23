import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import ProductCard from "../components/product-card";
import productsService, { type Product } from "../services/productsService";
import { updateSEOTags } from "../utils/seoConfig";

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const normalizeCategorySlug = (slug: string) =>
  slug === "deportes" ? "rendimiento" : slug;

const getCategoryCandidates = (category: Product["category"]): string[] => {
  if (typeof category === "string") return [category];
  return [category.es, category.en, category.ca].filter(
    (v): v is string => typeof v === "string" && v.trim() !== "",
  );
};

const getCategoryDisplayLabel = (
  rawLabel: string,
  lang: "es" | "en" | "ca",
): string => {
  const rawSlug = normalizeCategorySlug(toSlug(rawLabel));
  if (rawSlug !== "rendimiento") return rawLabel;
  if (lang === "en") return "Performance";
  if (lang === "ca") return "Rendiment";
  return "Rendimiento";
};

type BucketKey = "performance" | "supplements" | "care" | "apparel";

const AllProductsPage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<BucketKey | "all">(
    "all",
  );
  const [sort, setSort] = useState<
    "relevance" | "name" | "priceAsc" | "priceDesc" | "clearance"
  >("relevance");

  useLanguageUpdater();

  const baseLang =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "es";
  const lang: "es" | "en" | "ca" =
    baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    updateSEOTags({
      title: `Productos | MΛN POWERS`,
      description: `Catálogo completo de productos en MΛN POWERS.`,
      keywords: `MΛN POWERS, productos, suplementos, cosmética, indumentaria, rendimiento`,
      ogTitle: `Productos | MΛN POWERS`,
      ogDescription: `Catálogo completo de productos en MΛN POWERS.`,
      ogImage: "/MAN-LOGO-BLANCO.png",
      canonicalUrl: `https://manpowers.es/products`,
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const all = await productsService.getProducts();
        setItems(all);
      } catch {
        setItems([]);
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!loading) {
      const id = requestAnimationFrame(() => setEnter(true));
      return () => cancelAnimationFrame(id);
    } else {
      setEnter(false);
    }
  }, [loading]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      if (sort === "clearance") {
        const hasDiscount =
          typeof p.discount_price === "number" &&
          Number.isFinite(p.discount_price);
        if (!hasDiscount) return false;
      }
      if (!q) return true;
      const name = (p.name?.[lang] || p.name?.es || "").toLowerCase();
      const nameEs = (p.name?.es || "").toLowerCase();
      const nameEn = (p.name?.en || "").toLowerCase();
      const nameCa = (p.name?.ca || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      const cat = getCategoryCandidates(p.category).join(" ").toLowerCase();
      return (
        name.includes(q) ||
        nameEs.includes(q) ||
        nameEn.includes(q) ||
        nameCa.includes(q) ||
        sku.includes(q) ||
        cat.includes(q)
      );
    });
  }, [items, lang, query, sort]);

  const buckets = useMemo(() => {
    const contains = (p: Product, tokens: string[]) => {
      const candidates = getCategoryCandidates(p.category).map((c) =>
        c.toLowerCase(),
      );
      return tokens.some((t) => candidates.some((c) => c.includes(t)));
    };

    const apparel = filtered.filter((p) =>
      contains(p, ["indumentaria", "apparel", "indumentària"]),
    );
    const care = filtered.filter((p) =>
      contains(p, ["cuidado", "care", "cura"]),
    );
    const supplements = filtered.filter((p) =>
      contains(p, ["suplementos", "supplements", "suplements"]),
    );

    const used = new Set<number>([
      ...apparel.map((p) => p.id),
      ...care.map((p) => p.id),
      ...supplements.map((p) => p.id),
    ]);

    const performance = filtered.filter((p) => {
      if (used.has(p.id)) return false;
      const candidates = getCategoryCandidates(p.category);
      const slugs = candidates.map((c) => normalizeCategorySlug(toSlug(c)));
      const hasPerformance = slugs.some((s) =>
        ["rendimiento", "performance", "sports"].includes(s),
      );
      if (hasPerformance) return true;
      return p.sportId === "multisport";
    });

    return { performance, supplements, care, apparel };
  }, [filtered]);

  const titles: Record<BucketKey, { es: string; en: string; ca: string }> = {
    performance: {
      es: "Rendimiento Deportivo",
      en: "Performance",
      ca: "Rendiment Esportiu",
    },
    supplements: { es: "Suplementos", en: "Supplements", ca: "Suplements" },
    care: { es: "Cuidado", en: "Care", ca: "Cura" },
    apparel: { es: "Indumentaria", en: "Apparel", ca: "Indumentària" },
  };

  const sortList = useCallback(
    (list: Product[]) => {
      if (sort === "relevance") return list;
      const copy = [...list];
      if (sort === "name") {
        copy.sort((a, b) => {
          const an = (a.name?.[lang] || a.name?.es || "").toLowerCase();
          const bn = (b.name?.[lang] || b.name?.es || "").toLowerCase();
          return an.localeCompare(bn);
        });
        return copy;
      }
      if (sort === "clearance") {
        copy.sort((a, b) => {
          const aHas =
            typeof a.discount_price === "number" &&
            Number.isFinite(a.discount_price);
          const bHas =
            typeof b.discount_price === "number" &&
            Number.isFinite(b.discount_price);
          if (aHas !== bHas) return aHas ? -1 : 1;
          const an = (a.name?.[lang] || a.name?.es || "").toLowerCase();
          const bn = (b.name?.[lang] || b.name?.es || "").toLowerCase();
          return an.localeCompare(bn);
        });
        return copy;
      }
      if (sort === "priceAsc" || sort === "priceDesc") {
        copy.sort((a, b) => {
          const ap =
            typeof a.discount_price === "number" &&
            Number.isFinite(a.discount_price)
              ? a.discount_price
              : a.price;
          const bp =
            typeof b.discount_price === "number" &&
            Number.isFinite(b.discount_price)
              ? b.discount_price
              : b.price;
          return sort === "priceAsc" ? ap - bp : bp - ap;
        });
        return copy;
      }
      return copy;
    },
    [lang, sort],
  );

  const sortedBuckets = useMemo(() => {
    return {
      performance: sortList(buckets.performance),
      supplements: sortList(buckets.supplements),
      care: sortList(buckets.care),
      apparel: sortList(buckets.apparel),
    };
  }, [buckets, sortList]);

  const flatSorted = useMemo(() => sortList(filtered), [filtered, sortList]);

  const openDetail = (p: Product) => {
    const slug = toSlug(p.name[lang] || p.name.es);
    navigate(`/product/${slug}`);
  };

  const clearFilters = () => {
    setQuery("");
    setCategoryFilter("all");
    setSort("relevance");
  };

  const emptyState = (
    <div className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center px-6 md:px-10">
        <img
          src="/MAN-LOGO-BLANCO.png"
          alt="MΛN POWERS"
          className="h-16 md:h-20 w-auto mx-auto mb-6 brightness-0"
        />
        <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-3">
          No hay productos
        </h2>
        <p className="text-black/70 text-base md:text-lg mb-8">
          No encontramos productos con los filtros seleccionados.
        </p>
        <button
          onClick={clearFilters}
          className="bg-[var(--color-secondary)] text-white font-bold py-3 px-8 rounded-lg hover:brightness-90 transition-all duration-300"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );

  const addToCart = (p: Product) => {
    const detail = {
      id: String(p.id),
      name: p.name[lang] || p.name.es,
      price: p.price,
      image: p.image,
      quantity: 1,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  const buyNow = (p: Product) => {
    const detail = {
      id: String(p.id),
      name: p.name[lang] || p.name.es,
      price: p.price,
      image: p.image,
      quantity: 1,
      buyNow: true,
      openCheckout: true,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  const allSections: Array<{ key: BucketKey; items: Product[] }> = [
    { key: "performance", items: sortedBuckets.performance },
    { key: "supplements", items: sortedBuckets.supplements },
    { key: "care", items: sortedBuckets.care },
    { key: "apparel", items: sortedBuckets.apparel },
  ];

  const sections: Array<{ key: BucketKey; items: Product[] }> =
    categoryFilter === "all"
      ? allSections
      : allSections.filter((s) => s.key === categoryFilter);

  const showGrouped = categoryFilter !== "all" || sort === "relevance";
  const hasResults = showGrouped
    ? sections.some((s) => s.items.length > 0)
    : flatSorted.length > 0;

  return (
    <div className="min-h-screen bg-[var(--color-primary)] text-black">
      <Header />

      <main
        className={`pt-10 md:pt-20 transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <section className="bg-[var(--color-primary)] border-b border-black/10 pt-10 pb-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4 uppercase">
              {t("allProducts.title")}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full bg-white/80 border border-black/10 rounded-lg px-4 py-3 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as BucketKey | "all")
                }
                className="w-full bg-white/80 border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              >
                <option value="all">Todas las categorías</option>
                <option value="performance">
                  {titles.performance[lang] || titles.performance.es}
                </option>
                <option value="supplements">
                  {titles.supplements[lang] || titles.supplements.es}
                </option>
                <option value="care">
                  {titles.care[lang] || titles.care.es}
                </option>
                <option value="apparel">
                  {titles.apparel[lang] || titles.apparel.es}
                </option>
              </select>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(
                    e.target.value as
                      | "relevance"
                      | "name"
                      | "priceAsc"
                      | "priceDesc"
                      | "clearance",
                  )
                }
                className="w-full bg-white/80 border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              >
                <option value="relevance">Orden: Relevancia</option>
                <option value="name">Orden: Nombre</option>
                <option value="clearance">Orden: Liquidación primero</option>
                <option value="priceAsc">Orden: Precio (menor a mayor)</option>
                <option value="priceDesc">Orden: Precio (mayor a menor)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="py-8 px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-16">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-secondary)] mx-auto mb-4"></div>
                <p className="text-black/60 text-lg">Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-3xl font-bold text-black mb-4">
                  Error al cargar productos
                </h2>
                <p className="text-black/60 text-lg mb-8">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[var(--color-secondary)] text-white font-bold py-3 px-8 rounded-lg hover:brightness-90 transition-all duration-300"
                >
                  Reintentar
                </button>
              </div>
            ) : !hasResults ? (
              emptyState
            ) : showGrouped ? (
              sections.map((section, idx) => {
                const title =
                  titles[section.key][lang] || titles[section.key].es;
                return (
                  <div key={section.key}>
                    {idx > 0 && (
                      <div className="w-full px-0">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-black/15 to-transparent mb-12" />
                      </div>
                    )}
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-8 uppercase text-black">
                      {title}
                    </h2>

                    {section.items.length === 0 ? (
                      <div className="text-black/50">—</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {section.items.map((p) => {
                          const normalizedCategory: Product["category"] =
                            typeof p.category === "string"
                              ? {
                                  es: getCategoryDisplayLabel(p.category, "es"),
                                  en: getCategoryDisplayLabel(p.category, "en"),
                                  ca: getCategoryDisplayLabel(p.category, "ca"),
                                }
                              : {
                                  ...p.category,
                                  es: getCategoryDisplayLabel(
                                    p.category.es,
                                    "es",
                                  ),
                                  en: getCategoryDisplayLabel(
                                    p.category.en,
                                    "en",
                                  ),
                                  ca: p.category.ca
                                    ? getCategoryDisplayLabel(
                                        p.category.ca,
                                        "ca",
                                      )
                                    : p.category.ca,
                                };

                          return (
                            <ProductCard
                              key={p.id}
                              product={{ ...p, category: normalizedCategory }}
                              language={lang}
                              onOpen={openDetail}
                              onAddToCart={addToCart}
                              onBuyNow={buyNow}
                              showAmazonLinks={true}
                              variant="full"
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : flatSorted.length === 0 ? (
              emptyState
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {flatSorted.map((p) => {
                  const normalizedCategory: Product["category"] =
                    typeof p.category === "string"
                      ? {
                          es: getCategoryDisplayLabel(p.category, "es"),
                          en: getCategoryDisplayLabel(p.category, "en"),
                          ca: getCategoryDisplayLabel(p.category, "ca"),
                        }
                      : {
                          ...p.category,
                          es: getCategoryDisplayLabel(p.category.es, "es"),
                          en: getCategoryDisplayLabel(p.category.en, "en"),
                          ca: p.category.ca
                            ? getCategoryDisplayLabel(p.category.ca, "ca")
                            : p.category.ca,
                        };

                  return (
                    <ProductCard
                      key={p.id}
                      product={{ ...p, category: normalizedCategory }}
                      language={lang}
                      onOpen={openDetail}
                      onAddToCart={addToCart}
                      onBuyNow={buyNow}
                      showAmazonLinks={true}
                      variant="full"
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AllProductsPage;
