import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import InfoStripe from "../../components/info/InfoStripe";

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Removed unused destructured elements from useScrollAnimation
  const { ref: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation();
  const { ref: descriptionRef, isVisible: descriptionVisible } =
    useScrollAnimation();
  const { ref: buttonRef } = useScrollAnimation();

  // Función para navegar a la página de deportes
  const navigateToSports = () => {
    navigate("/sports");
  };

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Imagen de flyer-maca en lugar del slider de video */}
        <div className="absolute inset-0 z-10">
          <picture>
            <source media="(min-width: 640px)" srcSet="/flyer-maca.jpg" />
            <img
              src="/flyer-maca-mobile.jpg"
              alt="Flyer Maca"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-30 flex flex-col items-center justify-center min-h-screen text-white px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 sm:pt-50 w-full lg:w-[60%] lg:ml-auto">
          {/* Logo */}
          <div className="mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
            <img
              src="/MAN-LOGO-BLANCO.png"
              alt="MΛN POWERS Logo"
              className="h-16 sm:h-20 lg:h-24 xl:h-32 2xl:h-36 w-auto drop-shadow-2xl"
            />
          </div>
          <div className="text-center w-full">
            {/* Subtítulo */}
            <h2
              ref={subtitleRef as React.RefObject<HTMLHeadingElement>}
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light mb-3 sm:mb-4 lg:mb-6 xl:mb-8 text-gray-200 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-all duration-1000 px-2 max-w-4xl mx-auto ${
                subtitleVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {t("heroSubtitle")}
            </h2>

            {/* Descripción */}
            <p
              ref={descriptionRef as React.RefObject<HTMLParagraphElement>}
              className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mb-6 sm:mb-8 lg:mb-10 xl:mb-12 text-gray-300 leading-relaxed max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-all duration-1000 delay-300 px-2 ${
                descriptionVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {t("heroDescription")}
            </p>

            {/* CTA Buttons */}
            <div
              ref={buttonRef as React.RefObject<HTMLDivElement>}
              className="flex flex-col items-center gap-4 mb-30 sm:gap-6 lg:gap-8 xl:gap-10 justify-center transition-all duration-1000 delay-500 z-50 w-full max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto"
            >
              {/* Botón principal de deportes */}
              <button
                onClick={navigateToSports}
                className="bg-white text-black cursor-pointer font-bold py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-12 lg:py-6 lg:px-16 rounded-full text-base sm:text-lg md:text-xl lg:text-2xl transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-lg"
              >
                {t("heroSportsButton")}
              </button>
            </div>

            {/* Indicador de scroll */}
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
      <InfoStripe />
    </>
  );
};

export default Hero;
