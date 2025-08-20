import React from "react";
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  
  // Función para hacer scroll a la sección About Us
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-us');
    if (aboutSection) {
      const headerHeight = 100; // Altura aproximada del header fijo
      const elementPosition = aboutSection.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Video de fondo */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-10"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        webkit-playsinline="true"
        controls={false}
      >
        <source src="/video.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>

      {/* Overlay oscuro para mejorar la legibilidad del texto */}
 <div className="absolute inset-0 bg-black/50 z-20" />
      {/* Contenido del Hero */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen text-white px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">      
          {/* Subtítulo */}
          <h2 className="text-xl md:text-4xl lg:text-4xl font-semibold mb-8 text-gray-200 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">

            {t('heroSubtitle')}
          </h2>
          
          {/* Descripción */}
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-100 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            {t('heroDescription')}
          </p>
          
          {/* CTA Button */}
          <button 
            onClick={scrollToAbout}
            className="bg-white hover:bg-gray-100 text-black cursor-pointer font-bold py-4 px-8 md:py-5 md:px-12 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-[0_8px_30px_rgba(255,255,255,0.3)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.4)]"
          >
            {t('heroButton')}
          </button>
          
          {/* Indicador de scroll */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
