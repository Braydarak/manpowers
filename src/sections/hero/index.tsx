import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const desktopFlyers = useMemo(
    () => ["/flyer-maca.avif", "/flyer-tiro.avif"],
    []
  );
  const mobileFlyers = useMemo(
    () => ["/flyer-maca-mobile.avif", "/flyer-tiro-mobile.avif"],
    []
  );
  const [idx, setIdx] = useState(0);
  const autoIntervalRef = useRef<number | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const AUTO_MS = 20000;
  const FADE_MS = 700;

  const [prevIdx, setPrevIdx] = useState(0);
  const [showPrev, setShowPrev] = useState(false);
  const lastIdxRef = useRef(0);
  const fadeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const nextDesktop = new Image();
    nextDesktop.src = desktopFlyers[(idx + 1) % desktopFlyers.length];
    const nextMobile = new Image();
    nextMobile.src = mobileFlyers[(idx + 1) % mobileFlyers.length];
  }, [idx, desktopFlyers, mobileFlyers]);

  useEffect(() => {
    if (lastIdxRef.current !== idx) {
      setPrevIdx(lastIdxRef.current);
      setShowPrev(true);
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
      const id = requestAnimationFrame(() => {
        setShowPrev(false);
      });
      fadeTimeoutRef.current = window.setTimeout(() => {
        // garantía de limpieza si hubo múltiples clics rápidos
        setShowPrev(false);
        cancelAnimationFrame(id);
      }, FADE_MS + 50);
    }
    lastIdxRef.current = idx;
    return () => {
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
    };
  }, [idx]);

  useEffect(() => {
    const start = () => {
      if (autoIntervalRef.current)
        window.clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = window.setInterval(() => {
        setIdx((i) => (i + 1) % desktopFlyers.length);
      }, AUTO_MS);
    };
    start();
    return () => {
      if (autoIntervalRef.current)
        window.clearInterval(autoIntervalRef.current);
      if (restartTimeoutRef.current)
        window.clearTimeout(restartTimeoutRef.current);
    };
  }, [desktopFlyers.length]);

  const handleDotClick = (i: number) => {
    setIdx(i % desktopFlyers.length);
    if (autoIntervalRef.current) window.clearInterval(autoIntervalRef.current);
    if (restartTimeoutRef.current)
      window.clearTimeout(restartTimeoutRef.current);
    restartTimeoutRef.current = window.setTimeout(() => {
      autoIntervalRef.current = window.setInterval(() => {
        setIdx((prev) => (prev + 1) % desktopFlyers.length);
      }, AUTO_MS);
    }, 5000);
  };

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Imagen de flyer rotativa con crossfade */}
        <div className="absolute inset-0 z-10">
          <picture
            className={`absolute inset-0 ${
              showPrev ? "opacity-100" : "opacity-0"
            } transition-opacity duration-700`}
          >
            <source
              media="(min-width: 640px)"
              srcSet={desktopFlyers[prevIdx]}
            />
            <img
              src={mobileFlyers[prevIdx]}
              alt="Flyer anterior"
              className="w-full h-full object-cover"
            />
          </picture>
          <picture
            className={`absolute inset-0 ${
              showPrev ? "opacity-0" : "opacity-100"
            } transition-opacity duration-700`}
          >
            <source media="(min-width: 640px)" srcSet={desktopFlyers[idx]} />
            <img
              src={mobileFlyers[idx]}
              alt="Flyer"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[120] hidden md:flex items-center gap-2">
          {desktopFlyers.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDotClick(i)}
              aria-label={`Cambiar a slide ${i + 1}`}
              aria-current={i === idx}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleDotClick(i);
              }}
              className={
                `h-3 w-3 rounded-full transition-all duration-300 cursor-pointer ` +
                (i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80")
              }
            />
          ))}
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
          </div>
        </div>
      </section>
      <InfoStripe />
    </>
  );
};

export default Hero;
