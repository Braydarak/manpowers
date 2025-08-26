import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useScrollAnimation, { useStaggeredAnimation } from '../../hooks/useScrollAnimation';
import useIsMobile from '../../hooks/useIsMobile';
import useAutoCarousel from '../../hooks/useAutoCarousel';

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
  price: string;
  category: string;
  available: boolean;
  amazonLinks?: {
    '100ml'?: string;
    '50ml'?: string;
  };
}

const Products: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: bannerRef, isVisible: bannerVisible } = useScrollAnimation();
  const { ref: finalRef, isVisible: finalVisible } = useScrollAnimation();
  const isMobile = useIsMobile();
  
  // Estado para los productos
  const [products, setProducts] = useState<Product[]>([]);
  // Loading state removed since it wasn't being used in the UI
  
  // Cargar productos desde el archivo público
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        // Loading state was removed since it wasn't being used
      }
    };
    
    loadProducts();
  }, []);
  const { containerRef: productsRef, visibleItems: productVisible } = useStaggeredAnimation(products.length, 150);
  const currentLanguage = i18n.language as 'es' | 'en';
  
  // Separar productos por disponibilidad
   const availableProducts = products.filter(product => product.available);
   const unavailableProducts = products.filter(product => !product.available);
   
   // Carrusel para productos disponibles
   const {
     currentIndex: availableIndex,
     goToNext: goToNextAvailable,
     goToPrev: goToPrevAvailable,
     containerRef: availableCarouselRef,
     handleMouseEnter: handleMouseEnterAvailable,
     handleMouseLeave: handleMouseLeaveAvailable,
     handleTouchStart: handleTouchStartAvailable,
     handleTouchEnd: handleTouchEndAvailable
   } = useAutoCarousel({
     itemCount: availableProducts.length,
     visibleItems: 1,
     autoScrollInterval: 4000,
     pauseOnHover: true
   });
   
   // Carrusel para productos no disponibles
   const {
     currentIndex: unavailableIndex,
     goToNext: goToNextUnavailable,
     goToPrev: goToPrevUnavailable,
     containerRef: unavailableCarouselRef,
     handleMouseEnter: handleMouseEnterUnavailable,
     handleMouseLeave: handleMouseLeaveUnavailable,
     handleTouchStart: handleTouchStartUnavailable,
     handleTouchEnd: handleTouchEndUnavailable
   } = useAutoCarousel({
     itemCount: unavailableProducts.length,
     visibleItems: 1,
     autoScrollInterval: 5000,
     pauseOnHover: true
   });

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

        {/* Grid de productos - Desktop / Carruseles separados - Mobile */}
         {isMobile ? (
           <div className="space-y-12">
             {/* Productos Disponibles */}
             {availableProducts.length > 0 && (
               <div>
                 <h3 className="text-2xl font-bold text-white mb-6 text-center">
                   {currentLanguage === 'es' ? 'Productos Disponibles' : 'Available Products'}
                 </h3>
                 <div className="relative">
                   <div 
                     ref={availableCarouselRef}
                     className="overflow-hidden"
                     onMouseEnter={handleMouseEnterAvailable}
                     onMouseLeave={handleMouseLeaveAvailable}
                     onTouchStart={handleTouchStartAvailable}
                     onTouchEnd={handleTouchEndAvailable}
                   >
                     <div 
                       className="flex transition-transform duration-500 ease-in-out"
                       style={{
                         transform: `translateX(-${availableIndex * 100}%)`
                       }}
                     >
                       {availableProducts.map((product) => (
                         <div
                           key={product.id}
                           className="w-full flex-shrink-0 px-4"
                         >
                           <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-gray-700 flex flex-col h-full max-w-sm mx-auto">
                             {/* Imagen del producto */}
                             <div className="h-64 overflow-hidden relative bg-gradient-to-br from-gray-900 to-black">
                               <img
                                 src={product.image}
                                 alt={`${product.name[currentLanguage]} - Producto premium MANPOWERS disponible en España`}
                                 className="h-full w-full object-cover drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                               />
                               {/* Badge de categoría sobre la imagen */}
                               <div className="absolute top-2 right-2">
                                 <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
                                   product.category === 'suplementos' ? 'bg-blue-600 text-white' :
                                   product.category === 'cuidado' ? 'bg-green-600 text-white' :
                                   product.category === 'deportes' ? 'bg-red-600 text-white' :
                                   'bg-gray-600 text-white'
                                 }`}>
                                   {product.category === 'suplementos' ? (currentLanguage === 'es' ? 'Suplementos' : 'Supplements') :
                                    product.category === 'cuidado' ? (currentLanguage === 'es' ? 'Cuidado' : 'Care') :
                                    product.category === 'deportes' ? (currentLanguage === 'es' ? 'Deportes' : 'Sports') :
                                    product.category}
                                 </span>
                               </div>
                             </div>

                             {/* Información del producto */}
                             <div className="p-4 flex-grow flex flex-col">
                               <h3 className="text-lg font-bold text-white mb-3 leading-tight">
                                 {product.name[currentLanguage]}
                               </h3>
                               <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                                 {product.description[currentLanguage]}
                               </p>
                               <div className="flex items-center justify-center mt-auto mb-4">
                                 <span className="text-2xl font-bold text-white">{product.price}</span>
                               </div>
                             </div>

                             {/* Botones de Amazon */}
                             <div className="px-4 pb-4 mt-auto">
                               {product.amazonLinks && (
                                 <div className="space-y-3">
                                   {product.amazonLinks?.['100ml'] && (
                                     <a
                                       href={product.amazonLinks['100ml']}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="flex items-center justify-center w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg text-sm transition-all duration-300"
                                     >
                                       <span className="flex items-center space-x-2">
                                         <span>{t('buyOn')}</span>
                                         <span>{t('buyOn100ml')}</span>
                                       </span>
                                     </a>
                                   )}
                                   {product.amazonLinks?.['50ml'] && (
                                     <a
                                       href={product.amazonLinks['50ml']}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="flex items-center justify-center w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg text-sm transition-all duration-300"
                                     >
                                       <span className="flex items-center space-x-2">
                                         <span>{t('buyOn')}</span>
                                         <span>{t('buyOn50ml')}</span>
                                       </span>
                                     </a>
                                   )}
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                   
                   {/* Controles del carrusel disponibles */}
                   {availableProducts.length > 1 && (
                     <div className="flex justify-center mt-4 space-x-2">
                       <button
                         onClick={goToPrevAvailable}
                         className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                         </svg>
                       </button>
                       <button
                         onClick={goToNextAvailable}
                         className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                         </svg>
                       </button>
                     </div>
                   )}
                 </div>
               </div>
             )}

             {/* Productos No Disponibles */}
             {unavailableProducts.length > 0 && (
               <div>
                 <h3 className="text-2xl font-bold text-white mb-6 text-center">
                   {currentLanguage === 'es' ? 'Próximamente Disponibles' : 'Coming Soon'}
                 </h3>
                 <div className="relative">
                   <div 
                     ref={unavailableCarouselRef}
                     className="overflow-hidden"
                     onMouseEnter={handleMouseEnterUnavailable}
                     onMouseLeave={handleMouseLeaveUnavailable}
                     onTouchStart={handleTouchStartUnavailable}
                     onTouchEnd={handleTouchEndUnavailable}
                   >
                     <div 
                       className="flex transition-transform duration-500 ease-in-out"
                       style={{
                         transform: `translateX(-${unavailableIndex * 100}%)`
                       }}
                     >
                       {unavailableProducts.map((product) => (
                         <div
                           key={product.id}
                           className="w-full flex-shrink-0 px-4"
                         >
                           <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-gray-700 flex flex-col h-full max-w-sm mx-auto">
                             {/* Imagen del producto */}
                             <div className="h-64 overflow-hidden relative bg-gradient-to-br from-gray-900 to-black">
                               <img
                                 src={product.image}
                                 alt={`${product.name[currentLanguage]} - Producto premium MANPOWERS próximamente disponible`}
                                 className="h-full w-full object-cover drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                               />
                               {/* Badge de categoría sobre la imagen */}
                               <div className="absolute top-2 right-2">
                                 <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
                                   product.category === 'suplementos' ? 'bg-blue-600 text-white' :
                                   product.category === 'cuidado' ? 'bg-green-600 text-white' :
                                   product.category === 'deportes' ? 'bg-red-600 text-white' :
                                   'bg-gray-600 text-white'
                                 }`}>
                                   {product.category === 'suplementos' ? (currentLanguage === 'es' ? 'Suplementos' : 'Supplements') :
                                    product.category === 'cuidado' ? (currentLanguage === 'es' ? 'Cuidado' : 'Care') :
                                    product.category === 'deportes' ? (currentLanguage === 'es' ? 'Deportes' : 'Sports') :
                                    product.category}
                                 </span>
                               </div>
                             </div>

                             {/* Información del producto */}
                             <div className="p-4 flex-grow flex flex-col">
                               <h3 className="text-lg font-bold text-white mb-3 leading-tight">
                                 {product.name[currentLanguage]}
                               </h3>
                               <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                                 {product.description[currentLanguage]}
                               </p>
                               <div className="flex items-center justify-center mt-auto mb-4">
                                 <span className="text-2xl font-bold text-white">{product.price}</span>
                               </div>
                             </div>

                             {/* Badge "Próximamente" */}
                             <div className="px-4 pb-4 mt-auto">
                               <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white text-center py-3 px-4 rounded-lg font-semibold text-sm">
                                 {t('productsAvailableSoon')}
                               </div>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                   
                   {/* Controles del carrusel no disponibles */}
                   {unavailableProducts.length > 1 && (
                     <div className="flex justify-center mt-4 space-x-2">
                       <button
                         onClick={goToPrevUnavailable}
                         className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                         </svg>
                       </button>
                       <button
                         onClick={goToNextUnavailable}
                         className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                         </svg>
                       </button>
                     </div>
                   )}
                 </div>
               </div>
             )}
           </div>
        ) : (
          // Grid desktop - Separado por disponibilidad
          <div className="space-y-16">
            {/* Productos Disponibles - Desktop */}
            {availableProducts.length > 0 && (
              <div>
                <h3 className="text-3xl font-bold text-white mb-8 text-center">
                  {currentLanguage === 'es' ? 'Productos Disponibles' : 'Available Products'}
                </h3>
                <div ref={productsRef as React.RefObject<HTMLDivElement>} className={`gap-8 ${
                   availableProducts.length === 1 
                     ? 'flex justify-center w-full' 
                     : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                 }`}>
                  {availableProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] transform transition-all duration-1000 hover:scale-105 hover:shadow-[0_12px_40px_rgba(255,255,255,0.1)] border border-gray-700 flex flex-col h-full ${
                        availableProducts.length === 1 ? 'max-w-sm w-full' : ''
                      } ${
                        productVisible[index] 
                          ? 'opacity-100 translate-y-0 scale-100' 
                          : 'opacity-0 translate-y-12 scale-95'
                      }`}
                    >
              {/* Imagen del producto */}
              <div className="h-64 overflow-hidden relative bg-gradient-to-br from-gray-900 to-black">
                <img
                  src={product.image}
                  alt={`${product.name[currentLanguage]} - Producto premium MANPOWERS disponible en España`}
                  className="h-full w-full object-cover drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                />
                {/* Badge de categoría sobre la imagen */}
                 <div className="absolute top-2 right-2">
                   <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
                     product.category === 'suplementos' ? 'bg-blue-600 text-white' :
                     product.category === 'cuidado' ? 'bg-green-600 text-white' :
                     product.category === 'deportes' ? 'bg-red-600 text-white' :
                     'bg-gray-600 text-white'
                   }`}>
                     {product.category === 'suplementos' ? (currentLanguage === 'es' ? 'Suplementos' : 'Supplements') :
                      product.category === 'cuidado' ? (currentLanguage === 'es' ? 'Cuidado' : 'Care') :
                      product.category === 'deportes' ? (currentLanguage === 'es' ? 'Deportes' : 'Sports') :
                      product.category}
                   </span>
                 </div>
              </div>

              {/* Información del producto */}
               <div className="p-6 flex-grow flex flex-col">
                 <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                   {product.name[currentLanguage]}
                 </h3>
                 <p className="text-gray-300 leading-relaxed mb-4 flex-grow">
                    {product.description[currentLanguage]}
                  </p>
                  <div className="flex items-center justify-center mt-auto">
                    <span className="text-2xl font-bold text-white">{product.price}</span>
                  </div>
               </div>

                      {/* Botones de Amazon */}
                      <div className="px-6 pb-6 mt-auto">
                        {product.amazonLinks && (
                          <div className="space-y-3">
                            {product.amazonLinks?.['100ml'] && (
                              <a
                                href={product.amazonLinks['100ml']}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all duration-300 shadow-[0_4px_10px_rgba(234,88,12,0.3)]"
                              >
                                <span className="flex items-center space-x-1">
                                  <span>{t('buyOn')}</span>
                                  <span>{t('buyOn100ml')}</span>
                                </span>
                              </a>
                            )}
                            {product.amazonLinks?.['50ml'] && (
                              <a
                                href={product.amazonLinks['50ml']}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all duration-300 shadow-[0_4px_10px_rgba(234,88,12,0.3)]"
                              >
                                <span className="flex items-center space-x-1">
                                  <span>{t('buyOn')}</span>
                                  <span>{t('buyOn50ml')}</span>
                                </span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Productos No Disponibles - Desktop */}
            {unavailableProducts.length > 0 && (
              <div>
                <h3 className="text-3xl font-bold text-white mb-8 text-center">
                  {currentLanguage === 'es' ? 'Próximamente Disponibles' : 'Coming Soon'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {unavailableProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] transform transition-all duration-1000 hover:scale-105 hover:shadow-[0_12px_40px_rgba(255,255,255,0.1)] border border-gray-700 flex flex-col h-full ${
                        productVisible[availableProducts.length + index] 
                          ? 'opacity-100 translate-y-0 scale-100' 
                          : 'opacity-0 translate-y-12 scale-95'
                      }`}
                    >
                      {/* Imagen del producto */}
                      <div className="h-64 overflow-hidden relative bg-gradient-to-br from-gray-900 to-black">
                        <img
                          src={product.image}
                          alt={`${product.name[currentLanguage]} - Producto premium MANPOWERS próximamente disponible`}
                          className="h-full w-full object-cover drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                        />
                        {/* Badge de categoría sobre la imagen */}
                         <div className="absolute top-2 right-2">
                           <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
                             product.category === 'suplementos' ? 'bg-blue-600 text-white' :
                             product.category === 'cuidado' ? 'bg-green-600 text-white' :
                             product.category === 'deportes' ? 'bg-red-600 text-white' :
                             'bg-gray-600 text-white'
                           }`}>
                             {product.category === 'suplementos' ? (currentLanguage === 'es' ? 'Suplementos' : 'Supplements') :
                              product.category === 'cuidado' ? (currentLanguage === 'es' ? 'Cuidado' : 'Care') :
                              product.category === 'deportes' ? (currentLanguage === 'es' ? 'Deportes' : 'Sports') :
                              product.category}
                           </span>
                         </div>
                      </div>

                      {/* Información del producto */}
                       <div className="p-6 flex-grow flex flex-col">
                         <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                           {product.name[currentLanguage]}
                         </h3>
                         <p className="text-gray-300 leading-relaxed mb-4 flex-grow">
                            {product.description[currentLanguage]}
                          </p>
                          <div className="flex items-center justify-center mt-auto">
                            <span className="text-2xl font-bold text-white">{product.price}</span>
                          </div>
                       </div>

                      {/* Badge "Próximamente" */}
                      <div className="px-6 pb-6 mt-auto">
                        <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white text-center py-3 px-4 rounded-lg font-semibold">
                          {t('productsAvailableSoon')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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