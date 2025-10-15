import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import useLanguageUpdater from "../hooks/useLanguageUpdater";
import productsData from "../../public/products.json";

interface Product {
  id: number;
  name: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  image: string;
  category: string;
  sportId: string;
  available: boolean;
  amazonLinks?: {
    [key: string]: string;
  };
  price?: string;
}

interface ProductsData {
  products: Product[];
}

const ProductsPage: React.FC = () => {
  const { sportId } = useParams<{ sportId: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [sportName, setSportName] = useState<string>("");
  
  useLanguageUpdater();

  useEffect(() => {
    if (sportId && t) {
      // Filtrar productos por sportId específico y productos multisport
      const filteredProducts = (productsData as ProductsData).products.filter(
        (product: Product) => product.sportId === sportId || product.sportId === "multisport"
      );
      setProducts(filteredProducts);

      // Obtener el nombre del deporte
      const sportNames: { [key: string]: string } = {
        archery: t('sports.archery'),
        cycling: t('sports.cycling'),
        fencing: t('sports.fencing'),
        golf: t('sports.golf'),
        sailing: t('sports.sailing')
      };
      setSportName(sportNames[sportId] || sportId);
    }
  }, [sportId, t, i18n.language]);  

  const handleBackToSports = () => {
    navigate('/sports');
  };

  const currentLanguage = i18n.language as 'es' | 'en';

  // Añadir al carrito: despacha evento que consume CartWidget
  const handleAddToCart = (product: Product) => {
    const priceNumber = product.price ? parseFloat(product.price) : undefined;
    const detail = {
      id: String(product.id),
      name: product.name[currentLanguage],
      price: priceNumber,
      image: product.image,
      quantity: 1,
    };
    window.dispatchEvent(new CustomEvent('cart:add', { detail }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      <Header />
      
      <main className="pt-24 md:pt-28">
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
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:transform hover:scale-105 flex flex-col h-full min-h-[500px]"
                  >
                    <div className="h-64 bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                            {product.category}
                          </span>
                          {product.available && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                              Disponible
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
                            >
                              {t('sports.buy')} {size}
                            </a>
                          ))
                        ) : (
                          <button
                            className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 text-center text-sm"
                            disabled={!product.available}
                          >
                            {product.available ? t('sports.buy') : t('sports.comingSoon')}
                          </button>
                        )}

                        {product.available && (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-center text-sm"
                          >
                            {t('sports.addToCart')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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