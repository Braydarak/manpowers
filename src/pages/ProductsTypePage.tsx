import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const getCategoryDisplayLabel = (
  slug: string,
  lang: "es" | "en" | "ca",
  fallbackLabel: string,
) => {
  if (slug !== "rendimiento") return fallbackLabel;
  if (lang === "en") return "Performance";
  if (lang === "ca") return "Rendiment";
  return "Rendimiento";
};

const titleFromSlug = (slug: string) => {
  const s = slug.replace(/-/g, " ").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : slug;
};

const getCategoryCandidates = (category: Product["category"]): string[] => {
  if (typeof category === "string") return [category];
  return [category.es, category.en, category.ca].filter(
    (v): v is string => typeof v === "string" && v.trim() !== "",
  );
};

const ProductsTypePage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useLanguageUpdater();

  const baseLang =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "es";
  const currentLanguage: "es" | "en" | "ca" =
    baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!categorySlug) {
        setProducts([]);
        setLoading(false);
        setError("Faltan parámetros en la URL");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const allProducts = await productsService.getProducts();
        const decodedCategorySlug = decodeURIComponent(categorySlug);
        const requestedSlug = normalizeCategorySlug(decodedCategorySlug);

        const byCategory = allProducts.filter((p) => {
          const candidates = getCategoryCandidates(p.category);
          return candidates.some((c) => {
            const dataSlug = normalizeCategorySlug(toSlug(c));
            return dataSlug === requestedSlug;
          });
        });

        setProducts(byCategory);

        const first = byCategory[0];
        if (first) {
          const rawLabel =
            typeof first.category === "string"
              ? first.category
              : first.category[currentLanguage] || first.category.es;
          setCategoryTitle(
            getCategoryDisplayLabel(requestedSlug, currentLanguage, rawLabel),
          );
        } else {
          setCategoryTitle(
            getCategoryDisplayLabel(
              requestedSlug,
              currentLanguage,
              titleFromSlug(requestedSlug),
            ),
          );
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts([]);
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categorySlug, currentLanguage]);

  useEffect(() => {
    if (!categorySlug) return;
    const decoded = decodeURIComponent(categorySlug);
    const requestedSlug = normalizeCategorySlug(decoded);
    const baseLabel = categoryTitle || titleFromSlug(requestedSlug);
    const title = `${baseLabel.toUpperCase()} | MΛN POWERS`;
    const description = `Catálogo de ${baseLabel} en MΛN POWERS.`;
    const keywords = `${categoryTitle || categorySlug}, MΛN POWERS, suplementos, cosmética, indumentaria`;
    const ogImage = products[0]?.image
      ? products[0].image
      : "/MAN-LOGO-BLANCO.png";
    updateSEOTags({
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      canonicalUrl: `https://manpowers.es/products/category/${requestedSlug}`,
    });
  }, [categorySlug, categoryTitle, products]);

  useEffect(() => {
    if (!loading) {
      const id = requestAnimationFrame(() => setEnter(true));
      return () => cancelAnimationFrame(id);
    } else {
      setEnter(false);
    }
  }, [loading]);

  const handleBackHome = () => {
    navigate("/");
  };

  const handleAddToCart = (product: Product) => {
    const detail = {
      id: String(product.id),
      name: product.name[currentLanguage],
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  const handleBuyNow = (product: Product) => {
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

  const openProductDetail = (product: Product) => {
    const slug = toSlug(product.name[currentLanguage] || product.name.es);
    navigate(`/product/${slug}`);
  };

  const uiTitle = useMemo(() => {
    if (!categorySlug) return "";
    const fallback = titleFromSlug(decodeURIComponent(categorySlug));
    return categoryTitle || fallback;
  }, [categorySlug, categoryTitle]);

  const uiTitleUpper = useMemo(() => uiTitle.toUpperCase(), [uiTitle]);

  return (
    <div className="min-h-screen bg-[var(--color-primary)] text-black">
      <Header />

      <main
        className={`pt-10 md:pt-20 transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <section className="bg-[var(--color-primary)] border-b border-black/10 pt-10 pb-4">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <button
                onClick={handleBackHome}
                className="text-[var(--color-secondary)] hover:brightness-90 flex items-center gap-2 transition-colors"
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
                {t("cta.backHome")}
              </button>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4 uppercase">
              {uiTitleUpper}
            </h1>
            <p className="text-xl text-black/70">{t("allProducts.title")}</p>
          </div>
        </section>

        <section className="py-5 px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
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
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={currentLanguage}
                    onOpen={openProductDetail}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    showAmazonLinks={true}
                    variant="full"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-black mb-4">
                  {t("sports.productsInDevelopment")}
                </h2>
                <p className="text-black/60 text-lg mb-8">
                  {t("sports.soonNews")}
                </p>
                <button
                  onClick={handleBackHome}
                  className="bg-[var(--color-secondary)] text-white font-bold py-3 px-8 rounded-lg hover:brightness-90 transition-all duration-300"
                >
                  {t("cta.backHome")}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsTypePage;
