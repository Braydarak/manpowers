import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CartWidget from "../cart/CartWidget";
import ProductSearch from "../search/ProductSearch";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<string>(
    i18n.resolvedLanguage?.split("-")[0] || "es"
  );
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // Estado para controlar el menú hamburguesa
  const [isMobile, setIsMobile] = useState<boolean>(false); // Estado para detectar si es dispositivo móvil
  const [searchOpenMobile, setSearchOpenMobile] = useState<boolean>(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [langOpenMobile, setLangOpenMobile] = useState<boolean>(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const langRefMobile = useRef<HTMLDivElement | null>(null);

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

  // Detectar si estamos en un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px es el breakpoint de md en Tailwind
    };

    // Verificar al cargar y cuando cambie el tamaño de la ventana
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    // Limpiar el event listener
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Evitar scroll cuando el menú o la búsqueda están abiertos en móvil
  useEffect(() => {
    if ((menuOpen || searchOpenMobile) && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen, searchOpenMobile, isMobile]);

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
    <header className="bg-gradient-to-b from-gray-900 to-black text-white py-4 px-6 w-full border-b border-gray-700 shadow-lg fixed top-0 z-50">
      <div className="max-w-[80%] mx-auto flex justify-between items-center h-full">
        {/* Logo */}
        <h1 className="cursor-pointer" onClick={handleLogoClick}>
          <img
            src="/MAN-LOGO-BLANCO.png"
            alt="MANPOWERS - Suplementos Premium"
            className="h-16 md:h-26 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-transform duration-300 hover:scale-105"
          />
        </h1>

        <div className="flex items-center space-x-4">
          <div className="md:hidden">
            <CartWidget />
          </div>

          <button
            className="md:hidden p-2 text-white/90 hover:text-white focus:outline-none"
            onClick={() => setSearchOpenMobile(true)}
            aria-label="Buscar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </button>

          {/* Botón de menú hamburguesa (solo visible en móvil) */}
          <button
            className="md:hidden flex flex-col justify-center items-center p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Menú"
          >
            <span
              className={`block w-6 h-0.5 bg-white mb-1.5 transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white mb-1.5 transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Menú de navegación (visible en desktop) */}
        <div className="hidden md:flex flex-row items-center space-x-4">

          <ProductSearch className="ml-2" />
                    <CartWidget />


          <div ref={langRef} className="ml-0 md:ml-6 relative">
            <button
              type="button"
              aria-label="Idioma"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((v) => !v)}
              className="bg-gradient-to-r from-gray-900 to-black border border-white/20 text-white pl-10 pr-10 py-2 rounded-full shadow-md hover:from-gray-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500/40 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-white/70 absolute left-3">
                <circle cx="12" cy="12" r="9" />
                <path d="M2 12h20M12 2v20M4 8h16M4 16h16" />
              </svg>
              <span className="select-none">{language === "es" ? "🇪🇸 Español" : language === "ca" ? "🇦🇩 Català" : "🇬🇧 English"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white/70 absolute right-2">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            {langOpen && (
              <ul className="absolute right-0 mt-2 w-44 bg-gradient-to-r from-gray-900 to-black border border-white/20 rounded-xl shadow-xl overflow-hidden z-50">
                <li>
                  <button
                    type="button"
                    onClick={() => { handleLanguageChange("es"); setLangOpen(false); }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                  >
                    🇪🇸 Español
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { handleLanguageChange("en"); setLangOpen(false); }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                  >
                    🇬🇧 English
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { handleLanguageChange("ca"); setLangOpen(false); }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                  >
                    🇦🇩 Català
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* Botón TAMD Cosmetics */}
          <a
            href="https://tamdcosmetics.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#DAB889] hover:bg-[#C5A678] text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            TAMD Cosmetics
          </a>
          {/* Botón Colaboradores */}
          <button
            onClick={() => navigate('/colaboradores')}
            className="border border-white/60 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-white hover:text-black"
          >
            {t('headerCollaborators')}
          </button>
                    <div className="flex flex-col">
            <div className="flex items-center hover:text-gray-100 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{t("phone")}</span>
            </div>

            <div className="flex items-center hover:text-gray-100 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{t("email")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil de pantalla completa */}
      <div
        className={`fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-40 transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col justify-center items-center pt-20 pb-10 px-6`}
      >
        {/* Botón X para cerrar el menú (esquina superior derecha) */}
        <button
          onClick={toggleMenu}
          className="absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-full transition-colors duration-300 focus:outline-none"
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
        <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
          {/* Información de contacto */}
          <div className="flex items-center hover:text-gray-100 transition-colors duration-300 text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{t("phone")}</span>
          </div>

          <div className="flex items-center hover:text-gray-100 transition-colors duration-300 text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{t("email")}</span>
          </div>

          {/* Botón TAMD Cosmetics */}
          <a
            href="https://tamdcosmetics.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#DAB889] hover:bg-[#C5A678] text-black px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full text-center"
          >
            TAMD Cosmetics
          </a>
          {/* Botón Colaboradores (móvil) */}
          <button
            onClick={() => { navigate('/colaboradores'); setMenuOpen(false); }}
            className="border border-white/60 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-black w-full text-center"
          >
            {t('headerCollaborators')}
          </button>

          <div ref={langRefMobile} className="w-full mt-6 relative">
            <button
              type="button"
              aria-label="Idioma"
              aria-expanded={langOpenMobile}
              onClick={() => setLangOpenMobile((v) => !v)}
              className="w-full bg-gradient-to-r from-gray-900 to-black border border-white/20 text-white pl-12 pr-12 py-3 rounded-full text-lg shadow-lg hover:from-gray-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500/40 transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white/70 absolute left-4">
                <circle cx="12" cy="12" r="9" />
                <path d="M2 12h20M12 2v20M4 8h16M4 16h16" />
              </svg>
              <span className="select-none">{language === "es" ? "🇪🇸 Español" : language === "ca" ? "🇦🇩 Català" : "🇬🇧 English"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white/70 absolute right-3">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            {langOpenMobile && (
              <ul className="absolute left-0 right-0 mt-2 bg-gradient-to-r from-gray-900 to-black border border-white/20 rounded-xl shadow-xl overflow-hidden z-50">
                <li>
                  <button
                    type="button"
                    onClick={() => { handleLanguageChange("es"); setLangOpenMobile(false); setMenuOpen(false); }}
                    className="w-full text-left px-5 py-3 text-white hover:bg-gray-800"
                  >
                    🇪🇸 Español
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { handleLanguageChange("en"); setLangOpenMobile(false); setMenuOpen(false); }}
                    className="w-full text-left px-5 py-3 text-white hover:bg-gray-800"
                  >
                    🇬🇧 English
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { handleLanguageChange("ca"); setLangOpenMobile(false); setMenuOpen(false); }}
                    className="w-full text-left px-5 py-3 text-white hover:bg-gray-800"
                  >
                    🇦🇩 Català
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* Carrito dentro del menú móvil */}
          <div className="mt-6">
            <CartWidget />
          </div>
        </div>
      </div>

      {searchOpenMobile && (
        <ProductSearch fullScreen onClose={() => setSearchOpenMobile(false)} autoFocus />
      )}
    </header>
  );
};

export default Header;
