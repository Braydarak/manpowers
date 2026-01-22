import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CartWidget from "../cart/CartWidget";
import ProductSearch from "../search/ProductSearch";
import InfoStripe from "../info/InfoStripe";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<string>(
    i18n.resolvedLanguage?.split("-")[0] || "es"
  );
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // Estado para controlar el menú hamburguesa
  const [isMobile, setIsMobile] = useState<boolean>(false); // Estado para detectar si es dispositivo móvil
  const [searchOpenMobile, setSearchOpenMobile] = useState<boolean>(false);
  const [isBelow1000, setIsBelow1000] = useState<boolean>(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [langOpenMobile, setLangOpenMobile] = useState<boolean>(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const langRefMobile = useRef<HTMLDivElement | null>(null);
  const [hideHeader, setHideHeader] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);

  // Función para manejar el cambio de idioma
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    // Sync <html lang> for detectors and accessibility
    if (document?.documentElement) {
      document.documentElement.lang = lang;
    }
    // Cerrar el menú móvil al cambiar idioma
    if (isMobile && menuOpen) {
      setMenuOpen(false);
    }
  };

  // Mantener el estado de idioma normalizado cuando i18n cambia
  useEffect(() => {
    const baseLang = i18n.resolvedLanguage?.split("-")[0] || "es";
    setLanguage(baseLang);
    if (document?.documentElement) {
      document.documentElement.lang = baseLang;
    }
  }, [i18n.language, i18n.resolvedLanguage]);

  // Función para abrir/cerrar el menú hamburguesa
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Función para navegar al inicio y hacer scroll al top
  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Detectar tamaños de pantalla para comportamientos responsive
  useEffect(() => {
    const checkWidths = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsBelow1000(w < 1000);
    };

    checkWidths();
    window.addEventListener("resize", checkWidths);
    return () => {
      window.removeEventListener("resize", checkWidths);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setHideHeader(false);
      return;
    }
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (y <= 0) {
        setHideHeader(false);
        lastScrollY.current = 0;
        return;
      }
      const goingDown = y > lastScrollY.current;
      setHideHeader(goingDown && y > 20);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile]);

  const scrollLockY = useRef<number>(0);
  useEffect(() => {
    if (menuOpen || searchOpenMobile) {
      scrollLockY.current = window.scrollY || 0;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollLockY.current}px`;
      document.body.style.width = "100%";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      const y = Math.max(scrollLockY.current, 0);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [menuOpen, searchOpenMobile]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (langRef.current && !langRef.current.contains(t)) {
        setLangOpen(false);
      }
      if (langRefMobile.current && !langRefMobile.current.contains(t)) {
        setLangOpenMobile(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setLangOpenMobile(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      className={`bg-gradient-to-b from-gray-900 to-black text-white py-2 px-6 w-full border-b border-gray-700 shadow-lg fixed top-0 z-50 transition-transform duration-300 ${
        isMobile && hideHeader && !menuOpen && !searchOpenMobile
          ? "-translate-y-full"
          : "translate-y-0"
      }`}
    >
      <div className="w-full mx-auto grid grid-cols-3 items-center md:flex md:justify-between md:items-center h-full relative">
        {/* Controles izquierdos (móvil): menú + búsqueda */}
        <div className="md:hidden flex items-center gap-3">
          <button
            className="flex flex-col justify-center items-center p-3 focus:outline-none cursor-pointer"
            onClick={toggleMenu}
            aria-label="Menú"
          >
            <span
              className={`block w-6 h-px bg-white mb-1.5 transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-px bg-white mb-1.5 transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-6 h-px bg-white transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
          <button
            className="p-2 text-white/90 hover:text-white focus:outline-none"
            onClick={() => setSearchOpenMobile(true)}
            aria-label="Buscar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>
        </div>

        {/* Logo centrado en móvil */}
        <h1
          className="cursor-pointer justify-self-center md:justify-self-start min-[1500px]:pl-50 max-[1500px]:pl-5"
          onClick={handleLogoClick}
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/MAN-LOGO-BLANCO.png" />
            <img
              src="/MAN-BLANCO.png"
              alt="MΛN POWERS - Suplementos Premium"
              className={`${
                isBelow1000 ? "h-10 md:h-20" : "h-12 md:h-26"
              } drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
            />
          </picture>
        </h1>

        {/* Carrito a la derecha (móvil) */}
        <div className="md:hidden flex justify-end pr-2">
          <CartWidget />
        </div>

        {/* Menú de navegación (visible en desktop) */}
        <div className="hidden md:flex flex-row items-center space-x-4">
          {!isBelow1000 && <ProductSearch className="ml-2" />}
          {isBelow1000 && (
            <button
              className="p-2 text-white/90 hover:text-white focus:outline-none"
              onClick={() => setSearchOpenMobile(true)}
              aria-label="Buscar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>
          )}
          <CartWidget />

          <div ref={langRef} className="ml-0 md:ml-6 relative">
            <button
              type="button"
              aria-label="Idioma"
              aria-expanded={langOpen}
              onClick={(e) => {
                setLangOpen((v) => !v);
                (e.currentTarget as HTMLButtonElement).blur();
              }}
              className="bg-gradient-to-r from-gray-900 to-black border border-white/20 text-white pl-10 pr-10 py-2 rounded-md shadow-md hover:from-gray-800 hover:to-gray-900 focus:outline-none transition-all flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 text-white/70 absolute left-3"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M2 12h20M12 2v20M4 8h16M4 16h16" />
              </svg>
              <span className="select-none">
                {language === "es"
                  ? "Español"
                  : language === "ca"
                  ? "Català"
                  : "English"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-white/70 absolute right-2"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            {langOpen && (
              <ul className="absolute right-0 mt-2 w-44 bg-gradient-to-r from-gray-900 to-black border border-white/20 rounded-xl shadow-xl overflow-hidden z-50">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleLanguageChange("es");
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                  >
                    Español
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleLanguageChange("en");
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                  >
                    English
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleLanguageChange("ca");
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                  >
                    Català
                  </button>
                </li>
              </ul>
            )}
          </div>
          <button
            className="flex flex-col justify-center items-center p-3 focus:outline-none cursor-pointer"
            onClick={toggleMenu}
            aria-label="Menú"
          >
            <span
              className={`block w-6 h-px bg-white mb-1.5 transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-px bg-white mb-1.5 transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-6 h-px bg-white transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Overlay + Panel responsive */}
      <div
        className={`fixed inset-0 z-[110] ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={toggleMenu}
          className={`absolute top-0 left-0 h-screen w-full md:w-[60%] bg-black/60 md:backdrop-blur-lg transition-opacity duration-300 z-[110] ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute top-0 left-0 h-screen w-full md:left-auto md:right-0 md:w-[40%] bg-gradient-to-b from-gray-900 to-black transition-transform duration-300 ease-in-out z-[120] ${
            menuOpen
              ? "translate-x-0 md:translate-x-0"
              : "-translate-x-full md:translate-x-full"
          } flex flex-col overflow-hidden`}
        >
          <div className="sticky top-0 w-full bg-gradient-to-r from-gray-900 to-black border-b border-white/20 px-4 py-4 flex items-center justify-end z-50">
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors duration-300 focus:outline-none"
              aria-label="Cerrar menú"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col items-center w-full">
              <InfoStripe forceMobile />
              <div className="w-full grid grid-cols-1 gap-0">
                <div>
                  <span className="text-white/70 text-xl text-center mb-4 border-t border-white/30 py-5 px-4 flex justify-center items-center">
                    {t("menu.viewBySport")}
                  </span>
                  <button
                    onClick={() => {
                      navigate("/products/archery");
                      setMenuOpen(false);
                    }}
                    className="group relative w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 overflow-hidden cursor-pointer"
                  >
                    <img
                      src="/tiro.jpeg"
                      alt="Archery"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span>{t("sports.archery")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M13 7l5 5-5 5"
                        />
                      </svg>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/products/fencing");
                      setMenuOpen(false);
                    }}
                    className="group relative w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 overflow-hidden cursor-pointer"
                  >
                    <img
                      src="/esgrima.jpg"
                      alt="Fencing"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span>{t("sports.fencing")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M13 7l5 5-5 5"
                        />
                      </svg>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/products/golf");
                      setMenuOpen(false);
                    }}
                    className="group relative w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 overflow-hidden cursor-pointer"
                  >
                    <img
                      src="/golf.jpg"
                      alt="Golf"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span>{t("sports.golf")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M13 7l5 5-5 5"
                        />
                      </svg>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/products/cycling");
                      setMenuOpen(false);
                    }}
                    className="group relative w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 overflow-hidden cursor-pointer"
                  >
                    <img
                      src="/ciclismo.jpg"
                      alt="Cycling"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span>{t("sports.cycling")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M13 7l5 5-5 5"
                        />
                      </svg>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/products/sailing");
                      setMenuOpen(false);
                    }}
                    className="group relative w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 overflow-hidden cursor-pointer"
                  >
                    <img
                      src="/nautica.jpg"
                      alt="Sailing"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span>{t("sports.sailing")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M13 7l5 5-5 5"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Botón TAMD Cosmetics */}
              <a
                href="https://tamdcosmetics.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#DAB889] hover:bg-[#C5A678] mt-6 text-black px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-[90%] text-center cursor-pointer"
              >
                TAMD Cosmetics
              </a>
              {/* Botón Colaboradores (móvil) */}
              <button
                onClick={() => {
                  navigate("/colaboradores");
                  setMenuOpen(false);
                }}
                className="border border-white/60 text-white px-6 py-3 mt-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-black w-[90%] text-center cursor-pointer"
              >
                {t("headerCollaborators")}
              </button>

              <button
                onClick={() => {
                  navigate("/");
                  setMenuOpen(false);
                  setTimeout(() => {
                    try {
                      document.getElementById("about-us")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    } catch {
                      /* empty */
                    }
                  }, 300);
                }}
                className="group w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 mt-6 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 flex items-center justify-between cursor-pointer"
              >
                {t("menu.aboutUs")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M13 7l5 5-5 5"
                  />
                </svg>
              </button>

              <div ref={langRefMobile} className="w-[90%] mt-6 relative">
                <button
                  type="button"
                  aria-label="Idioma"
                  aria-expanded={langOpenMobile}
                  onClick={(e) => {
                    setLangOpenMobile((v) => !v);
                    (e.currentTarget as HTMLButtonElement).blur();
                  }}
                  className="w-full bg-gradient-to-r from-gray-900 to-black border border-white/20 text-white pl-12 pr-12 py-3 rounded-md text-lg shadow-lg hover:from-gray-800 hover:to-gray-900 focus:outline-none transition-all flex items-center justify-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5 text-white/70 absolute left-4"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M2 12h20M12 2v20M4 8h16M4 16h16" />
                  </svg>
                  <span className="select-none">
                    {language === "es"
                      ? "Español"
                      : language === "ca"
                      ? "Català"
                      : "English"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 text-white/70 absolute right-3"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z" />
                  </svg>
                </button>

                {langOpenMobile && (
                  <ul className="absolute left-0 right-0 mt-2 bg-gradient-to-r from-gray-900 to-black border border-white/20 rounded-xl shadow-xl overflow-hidden z-50">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          handleLanguageChange("es");
                          setLangOpenMobile(false);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-white hover:bg-gray-800"
                      >
                        Español
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          handleLanguageChange("en");
                          setLangOpenMobile(false);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-white hover:bg-gray-800"
                      >
                        English
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          handleLanguageChange("ca");
                          setLangOpenMobile(false);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-white hover:bg-gray-800"
                      >
                        Català
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <div className="w-full grid grid-cols-1 gap-0 mt-4">
                <span className="text-white/70 text-xl text-center mb-4 border-t border-white/30 py-5 px-4">
                  {t("menu.legal")}
                </span>
                <button
                  onClick={() => {
                    navigate("/privacidad");
                    setMenuOpen(false);
                  }}
                  className="group w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 flex items-center justify-between cursor-pointer"
                >
                  <span>{t("footerPrivacy")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 7l5 5-5 5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    navigate("/cookies");
                    setMenuOpen(false);
                  }}
                  className="group w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 flex items-center justify-between cursor-pointer"
                >
                  <span>{t("footerCookies")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 7l5 5-5 5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    navigate("/aviso-legal");
                    setMenuOpen(false);
                  }}
                  className="group w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 flex items-center justify-between cursor-pointer"
                >
                  <span>{t("footerLegal")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 7l5 5-5 5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    window.dispatchEvent(new Event("openCookiePreferences"));
                    setMenuOpen(false);
                  }}
                  className="group w-full bg-gradient-to-r from-gray-900 to-black border-y border-white/30 text-white font-semibold py-5 px-4 transition-all duration-300 hover:bg-gray-800 flex items-center justify-between cursor-pointer"
                >
                  <span>{t("cookies.changePreferences")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 7l5 5-5 5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {searchOpenMobile && (
        <ProductSearch
          fullScreen
          onClose={() => setSearchOpenMobile(false)}
          autoFocus
        />
      )}
    </header>
  );
};

export default Header;
