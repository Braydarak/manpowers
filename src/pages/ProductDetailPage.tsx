import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ShareModal from "../components/modals/ShareModal";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import productsService, { type Product } from "../services/productsService";

// Tipado del JSON local para evitar 'any' en el fallback
type ProductJson = {
  id: number;
  name: Product['name'];
  description: Product['description'];
  price: string | number;
  price_formatted?: string;
  size: string;
  image: string;
  category: Product['category'] | string;
  sportId: string;
  available: boolean;
  sku?: string;
  amazonLinks?: { [key: string]: string };
};

const ProductDetailPage: React.FC = () => {
  const { sportId: sportParam, id } = useParams<{ sportId?: string; id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.language as 'es' | 'en') || 'es';

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [checkoutOpenGlobal, setCheckoutOpenGlobal] = useState<boolean>(false);

  useLanguageUpdater();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError("");

      try {
        // Primero intentamos desde backend por id
        const productsById = await productsService.getProducts({ id: Number(id) });

        if (!productsById || productsById.length === 0) {
          // Fallback al JSON local
          const response = await fetch('/products.json');
          const data = await response.json();
          const normalized: Product[] = (data.products as ProductJson[]).map((p: ProductJson) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: typeof p.price === 'string' ? parseFloat(p.price.replace(',', '.')) : p.price,
            price_formatted: p.price_formatted ?? '',
            size: p.size,
            image: p.image,
            category: typeof p.category === 'string' ? { es: p.category, en: p.category } : p.category,
            sportId: p.sportId,
            available: p.available,
            sku: p.sku ?? '',
            amazonLinks: p.amazonLinks,
          }));
          const localFound = normalized.find((p: Product) => String(p.id) === String(id));
          if (localFound) {
            setProduct(localFound);
          } else {
            setError('Producto no encontrado');
          }
        } else {
          // Si el backend devuelve más de uno, tomamos el primero
          const p = productsById[0];
          setProduct(p);
        }
      } catch (err) {
        console.error('Error cargando producto por id:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    const onCheckoutToggle = (e: Event) => {
      const ce = e as CustomEvent<boolean>;
      setCheckoutOpenGlobal(Boolean(ce.detail));
    };
    window.addEventListener('cart:checkoutOpen', onCheckoutToggle as EventListener);
    return () => {
      window.removeEventListener('cart:checkoutOpen', onCheckoutToggle as EventListener);
    };
  }, []);

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
    window.dispatchEvent(new CustomEvent('cart:add', { detail }));
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
    window.dispatchEvent(new CustomEvent('cart:add', { detail }));
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  const sportLabelName = (() => {
    const s = sportParam || product?.sportId;
    if (!s) return '';
    const names: { [key: string]: string } = {
      archery: t('sports.archery'),
      cycling: t('sports.cycling'),
      fencing: t('sports.fencing'),
      golf: t('sports.golf'),
      sailing: t('sports.sailing'),
      waterSports: t('sports.waterSports'),
    };
    return names[s] || s;
  })();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <Header />
      <main className="flex-grow pt-10 md:pt-28">
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
                {t('cart.back')}
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('sports.backToSpecific', { sport: sportLabelName })}
                  </button>
                  <button
                    onClick={handleShare}
                    className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-700"
                  >
                    {t('product.share')}
                  </button>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div className="group bg-gray-900/60 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                  <div className="relative aspect-[4/3] bg-black">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={product.image}
                      alt={product.name[currentLanguage]}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[0.5deg]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `<span class='block p-6 text-gray-400'>Imagen no disponible</span>`;
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">
                      {product.category
                        ? (typeof product.category === 'string'
                            ? product.category
                            : product.category[currentLanguage])
                        : ''}
                    </span>
                    {product.sku && (
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">SKU {product.sku}</span>
                    )}
                    {product.available && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">{t('sports.available')}</span>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-extrabold">
                    {product.name[currentLanguage]}
                  </h1>

                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                      {product.price_formatted ? product.price_formatted : `€ ${Number(product.price).toFixed(2)}`}
                    </span>
                  </div>

                  <p className="text-gray-300 text-base leading-relaxed">
                    {product.description[currentLanguage]}
                  </p>

                  {product.available && product.amazonLinks && (
                    <div className="flex flex-col gap-3">
                      <span className="text-sm text-gray-400">{t('product.selectSize')}</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(product.amazonLinks).map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`${selectedSize === size ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-200'} font-semibold px-3 py-1 rounded-lg border border-gray-700`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    {product.available && product.amazonLinks && selectedSize ? (
                      <a
                        href={product.amazonLinks[selectedSize]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 text-center"
                      >
                        {t('sports.buy')} {selectedSize}
                      </a>
                    ) : (
                      <button
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
                        disabled={!product.available}
                        onClick={() => product.available && handleBuyNow()}
                      >
                        {product.available ? t('sports.buy') : t('sports.comingSoon')}
                      </button>
                    )}

                    {product.available && (
                      <button
                        onClick={handleAddToCart}
                        className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                      >
                        {t('sports.addToCart')}
                      </button>
                    )}
                  </div>


                </div>
              </div>

              {product.available && !checkoutOpenGlobal && (
                <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                  <div className="bg-black/80 backdrop-blur border-t border-gray-800 px-4 py-3 flex items-center justify-between">
                    <div className="font-bold">{product.price_formatted ? product.price_formatted : `€ ${Number(product.price).toFixed(2)}`}</div>
                    <div className="flex gap-2">
                      {product.amazonLinks && selectedSize ? (
                        <a
                          href={product.amazonLinks[selectedSize]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg"
                        >
                          {t('sports.buy')}
                        </a>
                      ) : (
                        <button
                          onClick={handleBuyNow}
                          className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg"
                        >
                          {t('sports.buy')}
                        </button>
                      )}
                      <button
                        onClick={handleAddToCart}
                        className="bg-gray-900 text-white font-bold px-4 py-2 rounded-lg"
                      >
                        {t('sports.addToCart')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
      <Footer />
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        productName={product ? product.name[currentLanguage] : undefined}
      />
    </div>
  );
};

export default ProductDetailPage;