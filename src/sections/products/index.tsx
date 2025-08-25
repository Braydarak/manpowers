import React from 'react';
import { useTranslation } from 'react-i18next';
import useScrollAnimation, { useStaggeredAnimation } from '../../hooks/useScrollAnimation';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
}

const Products: React.FC = () => {
  const { t } = useTranslation();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: bannerRef, isVisible: bannerVisible } = useScrollAnimation();
  const { containerRef: productsRef, visibleItems: productVisible } = useStaggeredAnimation(3, 200);
  const { ref: finalRef, isVisible: finalVisible } = useScrollAnimation();
  
  // Datos de productos
  const products: Product[] = [
    {
      id: 1,
      name: t('macaName'),
      description: t('macaDescription'),
      image: "/products/MACA 500.png",
      price: "$36.30",
    },
    {
      id: 2,
      name: t('omegaName'),
      description: t('omegaDescription'),
      image: "/products/OMEGA 3 CAPSULAS.png",
      price: "$30.25",
    },
    {
      id: 3,
      name: t('solarName'),
      description: t('solarDescription'),
      image: "/products/MAN PROTECTOR SOLAR.png",
      price: "$24.20",
    },
  ];

  return (
    <section id="products" className="bg-gradient-to-b from-gray-950 to-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Título principal */}
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {t('productsTitle')}
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('productsSubtitle')}
          </p>
        </div>

        {/* Mensaje de próximo lanzamiento */}
        <div 
          ref={bannerRef as React.RefObject<HTMLDivElement>}
          className={`bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 mb-16 max-w-4xl mx-auto text-center transition-all duration-1000 delay-200 ${
            bannerVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            {t('productsComingSoon')}
          </h3>
          <p className="text-gray-300">
            {t('productsComingSoonDesc')}
          </p>
        </div>

        {/* Grid de productos */}
        <div ref={productsRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] transform transition-all duration-1000 hover:scale-105 hover:shadow-[0_12px_40px_rgba(255,255,255,0.1)] border border-gray-700 ${
                productVisible[index] 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-12 scale-95'
              }`}
            >
              {/* Imagen del producto */}
              <div className="h-64 overflow-hidden relative bg-gradient-to-br from-gray-900 to-black">
                <img
                  src={product.image}
                  alt={`${product.name} - Suplemento premium MANPOWERS disponible en España`}
                  className="h-full w-full object-cover drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                />
              </div>

              {/* Información del producto */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                  {product.name}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Badge de "Próximamente" o Botones de Amazon */}
              <div className="px-6 pb-6">
                {product.id === 3 ? (
                  // Botones de Amazon para el protector solar
                  <div className="space-y-3">
                    <a
                      href="https://www.amazon.es/dp/B0FMRZL91K"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all duration-300 shadow-[0_4px_10px_rgba(234,88,12,0.3)]"
                    >
                      <span className="flex items-center space-x-1">
                          <span>{t('buyOn')}</span>
                          <span>{t('buyOn100ml')}</span>
                        </span>
                    </a>
                    <a
                      href="https://www.amazon.es/dp/B0FMRYF82L"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 w-full  bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all duration-300 shadow-[0_4px_10px_rgba(234,88,12,0.3)]"
                    >
                      <span className="flex items-center space-x-1">
                          <span>{t('buyOn')}</span>
                          <span>{t('buyOn50ml')}</span>
                        </span>
                    </a>
                  </div>
                ) : (
                  // Badge "Próximamente" para otros productos
                  <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white text-center py-3 px-4 rounded-lg font-semibold">
                    {t('productsAvailableSoon')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje final */}
        <div className="text-center mt-16">
          <div 
            ref={finalRef as React.RefObject<HTMLDivElement>}
            className={`bg-gradient-to-r from-gray-900 to-black p-8 rounded-xl border border-gray-700 max-w-4xl mx-auto transition-all duration-1000 delay-600 ${
              finalVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('productsInterested')}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {t('productsInterestedDesc')}
            </p>
            <a 
              href="https://wa.me/670372239?text=Hola,%20estoy%20interesado%20en%20los%20productos%20MANPOWERS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_8px_25px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_35px_rgba(34,197,94,0.4)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
              </svg>
              <span className="text-lg font-semibold">{t('productsWhatsapp')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;