import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import ProductCard from "../components/product-card";
import productsService, { type Product } from "../services/productsService";
import { updateSEOTags } from "../utils/seoConfig";

const ProductsPage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  const { sportId } = useParams<{ sportId: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [sportName, setSportName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useLanguageUpdater();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!sportId) return;
    const baseLang =
      i18n.resolvedLanguage?.split("-")[0] ||
      i18n.language?.split("-")[0] ||
      "es";
    const currentLanguage: "es" | "en" | "ca" =
      baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";
    const sport = sportName || sportId;
    const title = `Productos de ${sport} | MΛN POWERS`;
    const description = `Catálogo de ${sport} en MΛN POWERS. ${products
      .slice(0, 3)
      .map((p) => p.name[currentLanguage])
      .join(", ")}`;
    const keywords = `${sport}, MΛN POWERS, suplementos, ${products
      .slice(0, 3)
      .map((p) =>
        typeof p.category === "string"
          ? p.category
          : p.category[currentLanguage],
      )
      .join(", ")}`;
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
      canonicalUrl: `https://manpowers.es/products/${sportId}`,
    });
  }, [sportId, sportName, products, i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    const loadProducts = async () => {
      if (sportId && t) {
        setLoading(true);
        setError("");

        try {
          let allProducts: Product[] = [];

          try {
            // Intentar cargar productos desde el backend
            allProducts = await productsService.getProducts();
          } catch (backendError) {
            console.warn(
              "Backend no disponible, usando datos locales:",
              backendError,
            );
          }

          // Si el backend no devuelve productos, usar el archivo JSON local
          if (allProducts.length === 0) {
            const response = await fetch("/products.json");
            const data = await response.json();
            allProducts = data.products.map(
              (product: { price: string | number }) => ({
                ...product,
                // Convertir precio de string a number
                price:
                  typeof product.price === "string"
                    ? parseFloat(product.price.replace(",", "."))
                    : product.price,
              }),
            );
          }

          // Filtrar productos por sportId específico y productos multisport
          const filteredProducts = allProducts.filter(
            (product: Product) =>
              product.sportId === sportId || product.sportId === "multisport",
          );

          // Ordenar: primero los específicos del deporte, luego los multisport
          const sortedProducts = filteredProducts.sort(
            (a: Product, b: Product) => {
              const aIsSpecific = a.sportId === sportId;
              const bIsSpecific = b.sportId === sportId;
              if (aIsSpecific === bIsSpecific) return 0;
              return aIsSpecific ? -1 : 1;
            },
          );

          setProducts(sortedProducts);

          // Obtener el nombre del deporte
          const sportNames: { [key: string]: string } = {
            archery: t("sports.archery"),
            cycling: t("sports.cycling"),
            fencing: t("sports.fencing"),
            golf: t("sports.golf"),
            sailing: t("sports.sailing"),
          };
          setSportName(sportNames[sportId] || sportId);
        } catch (err) {
          console.error("Error loading products:", err);
          setError("Error al cargar los productos");
        } finally {
          setLoading(false);
        }
      }
    };

    loadProducts();
  }, [sportId, t, i18n.language]);

  useEffect(() => {
    if (!loading) {
      const id = requestAnimationFrame(() => setEnter(true));
      return () => cancelAnimationFrame(id);
    } else {
      setEnter(false);
    }
  }, [loading]);

  const handleBackToSports = () => {
    navigate("/sports");
  };

  const baseLang =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "es";
  const currentLanguage: "es" | "en" | "ca" =
    baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";

  // Añadir al carrito: despacha evento que consume CartWidget
  const handleAddToCart = (product: Product) => {
    const detail = {
      id: String(product.id),
      name: product.name[currentLanguage],
      price: product.price, // Ya es un número en el nuevo formato
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

  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  const openProductDetail = (product: Product) => {
    if (!sportId) return;
    const slug = toSlug(product.name[currentLanguage] || product.name.es);
    navigate(`/products/${sportId}/${slug}`);
  };

  // Separate products by category
  const cosmetics = products.filter((p) => {
    const cat = typeof p.category === "string" ? p.category : p.category.es;
    const lowerCat = cat.toLowerCase();
    // Include products that are explicitly 'cuidado' OR 'suplementos' OR multisport items that are not apparel
    return (
      lowerCat.includes("cuidado") ||
      lowerCat.includes("suplementos") ||
      lowerCat.includes("deportes") ||
      (p.sportId === "multisport" && !lowerCat.includes("indumentaria"))
    );
  });

  const apparel = products.filter((p) => {
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
    <div className="min-h-screen bg-[var(--color-primary)] text-black">
      <Header />

      <main
        className={`pt-16 md:pt-28 transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Breadcrumb y Header */}
        <section className="bg-[var(--color-primary)] border-b border-black/10 py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <button
              onClick={handleBackToSports}
              className="text-[var(--color-secondary)] hover:brightness-90 mb-4 flex items-center gap-2 transition-colors"
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
              {t("sports.backToSports")}
            </button>

            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
              {t("sports.productsFor")} {sportName}
            </h1>
            <p className="text-xl text-black/70">
              {t("sports.discoverSelection")} {sportName}
            </p>
          </div>
        </section>

        {/* Productos */}
        <section className="py-20 px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-20">
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
              <>
                {/* Cosmetics Section */}
                {cosmetics.length > 0 && (
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-8 uppercase text-black">
                      {titles.cosmetics[currentLanguage] || titles.cosmetics.es}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {cosmetics.map((product) => (
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
                  </div>
                )}

                {/* Separator */}
                {cosmetics.length > 0 && apparel.length > 0 && (
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent my-4 mt-10 mb-10" />
                )}

                {/* Apparel Section */}
                {apparel.length > 0 && (
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-8 uppercase text-black">
                      {titles.apparel[currentLanguage] || titles.apparel.es}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {apparel.map((product) => (
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
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-black mb-4">
                  {t("sports.productsInDevelopment")}
                </h2>
                <p className="text-black/60 text-lg mb-8">
                  {t("sports.workingOnProducts", {
                    sportName: sportName.toLowerCase(),
                  })}{" "}
                  {t("sports.soonNews")}
                </p>
                <button
                  onClick={handleBackToSports}
                  className="bg-[var(--color-secondary)] text-white font-bold py-3 px-8 rounded-lg hover:brightness-90 transition-all duration-300"
                >
                  {t("sports.exploreOtherSports")}
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

export default ProductsPage;
