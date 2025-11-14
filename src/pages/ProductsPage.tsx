import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import productsService, { type Product } from "../services/productsService";



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
            console.warn('Backend no disponible, usando datos locales:', backendError);
          }
          
          // Si el backend no devuelve productos, usar el archivo JSON local
          if (allProducts.length === 0) {
            const response = await fetch('/products.json');
            const data = await response.json();
            allProducts = data.products.map((product: { price: string | number }) => ({
              ...product,
              // Convertir precio de string a number
              price: typeof product.price === 'string' 
                ? parseFloat(product.price.replace(',', '.')) 
                : product.price
            }));
          }
          
          // Filtrar productos por sportId específico y productos multisport
          const filteredProducts = allProducts.filter(
            (product: Product) => product.sportId === sportId || product.sportId === "multisport"
          );

          // Ordenar: primero los específicos del deporte, luego los multisport
          const sortedProducts = filteredProducts.sort((a: Product, b: Product) => {
            const aIsSpecific = a.sportId === sportId;
            const bIsSpecific = b.sportId === sportId;
            if (aIsSpecific === bIsSpecific) return 0;
            return aIsSpecific ? -1 : 1;
          });

          setProducts(sortedProducts);

          // Obtener el nombre del deporte
          const sportNames: { [key: string]: string } = {
            archery: t('sports.archery'),
            cycling: t('sports.cycling'),
            fencing: t('sports.fencing'),
            golf: t('sports.golf'),
            sailing: t('sports.sailing')
          };
          setSportName(sportNames[sportId] || sportId);
        } catch (err) {
          console.error('Error loading products:', err);
          setError('Error al cargar los productos');
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
    navigate('/sports');
  };

  const currentLanguage = i18n.language as 'es' | 'en';

  // Añadir al carrito: despacha evento que consume CartWidget
  const handleAddToCart = (product: Product) => {
    const detail = {
      id: String(product.id),
      name: product.name[currentLanguage],
      price: product.price, // Ya es un número en el nuevo formato
      image: product.image,
      quantity: 1,
    };
    window.dispatchEvent(new CustomEvent('cart:add', { detail }));
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
    window.dispatchEvent(new CustomEvent('cart:add', { detail }));
  };

  const openProductDetail = (id: number) => {
    if (!sportId) return;
    navigate(`/products/${sportId}/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      <Header />
      
      <main className={`pt-24 md:pt-28 transition-all duration-500 ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Breadcrumb y Header */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <button
              onClick={handleBackToSports}
              className="text-yellow-400 hover:text-yellow-300 mb-4 flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('sports.backToSports')}
            </button>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {t('sports.productsFor')} {sportName}
            </h1>
            <p className="text-xl text-gray-300">
              {t('sports.discoverSelection')} {sportName}
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
                <h2 className="text-3xl font-bold text-white mb-4">Error al cargar productos</h2>
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
                {products.map((product) => {
                  const primarySize = product.size;
                  const priceLabel = product.price_formatted || (product.price ? `${product.price} €` : undefined);
                  
                  return (
                  <div
                    key={product.id}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:transform hover:scale-105 flex flex-col h-full min-h-[500px] cursor-pointer"
                    onClick={() => openProductDetail(product.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        openProductDetail(product.id);
                      }
                    }}
                  >
                    <div className="relative h-64 bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {/* Size badge (top-left) */}
                      {primarySize && (
                        <span className="absolute top-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded-full">
                          {primarySize}
                        </span>
                      )}
                      {/* Price badge (top-right) */}
                      {priceLabel && (
                        <span className="absolute top-2 right-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-bold">
                          {priceLabel}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.name[currentLanguage]}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = `<span class="text-gray-400">${t('sports.imageNotAvailable')}</span>`;
                          }
                        }}
                      />
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">
                            {product.category
                              ? (typeof product.category === 'string'
                                  ? product.category
                                  : product.category[currentLanguage])
                              : ''}
                          </span>
                          {product.available && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                              {t('sports.available')}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">
                          {product.name[currentLanguage]}
                        </h3>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                          {product.description[currentLanguage]}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2 mt-auto">
                        {product.available && product.amazonLinks ? (
                          Object.entries(product.amazonLinks).map(([size, link]) => (
                            <a
                              key={size}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 text-center text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {t('sports.buy')} {size}
                            </a>
                          ))
                        ) : (
                          <button
                            className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 text-center text-sm"
                            disabled={!product.available}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (product.available) handleBuyNow(product);
                            }}
                          >
                            {product.available ? t('sports.buy') : t('sports.comingSoon')}
                          </button>
                        )}
                        
                        {product.available && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-center text-sm"
                          >
                            {t('sports.addToCart')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('sports.productsInDevelopment')}
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  {t('sports.workingOnProducts', { sportName: sportName.toLowerCase() })} {' '}
                  {t('sports.soonNews')}
                </p>
                <button
                  onClick={handleBackToSports}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
                >
                  {t('sports.exploreOtherSports')}
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