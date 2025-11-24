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
    const baseLang = i18n.resolvedLanguage?.split('-')[0] || i18n.language?.split('-')[0] || 'es';
    const currentLanguage: 'es' | 'en' | 'ca' = baseLang === 'en' ? 'en' : (baseLang === 'ca' ? 'ca' : 'es');
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
          : p.category[currentLanguage]
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
  }, [sportId, sportName, products, i18n.language]);

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
              backendError
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
              })
            );
          }

          // Filtrar productos por sportId específico y productos multisport
          const filteredProducts = allProducts.filter(
            (product: Product) =>
              product.sportId === sportId || product.sportId === "multisport"
          );

          // Ordenar: primero los específicos del deporte, luego los multisport
          const sortedProducts = filteredProducts.sort(
            (a: Product, b: Product) => {
              const aIsSpecific = a.sportId === sportId;
              const bIsSpecific = b.sportId === sportId;
              if (aIsSpecific === bIsSpecific) return 0;
              return aIsSpecific ? -1 : 1;
            }
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

  const baseLang = i18n.resolvedLanguage?.split('-')[0] || i18n.language?.split('-')[0] || 'es';
  const currentLanguage: 'es' | 'en' | 'ca' = baseLang === 'en' ? 'en' : (baseLang === 'ca' ? 'ca' : 'es');

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

  const toSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
  const openProductDetail = (product: Product) => {
    if (!sportId) return;
    const slug = toSlug(product.name[currentLanguage] || product.name.es);
    navigate(`/products/${sportId}/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      <Header />

      <main
        className={`pt-16 md:pt-28 transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Breadcrumb y Header */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <button
              onClick={handleBackToSports}
              className="text-yellow-400 hover:text-yellow-300 mb-4 flex items-center gap-2 transition-colors"
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

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {t("sports.productsFor")} {sportName}
            </h1>
            <p className="text-xl text-gray-300">
              {t("sports.discoverSelection")} {sportName}
            </p>
          </div>
        </section>

        {/* Productos */}
        <section className="py-20 px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-gray-400 text-lg">Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Error al cargar productos
                </h2>
                <p className="text-gray-400 text-lg mb-8">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
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
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t("sports.productsInDevelopment")}
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  {t("sports.workingOnProducts", {
                    sportName: sportName.toLowerCase(),
                  })}{" "}
                  {t("sports.soonNews")}
                </p>
                <button
                  onClick={handleBackToSports}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
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
