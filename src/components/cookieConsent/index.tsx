import React, { useEffect, useState } from "react";

type ConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

const STORAGE_KEY = "cookieConsent";

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ConsentPreferences = JSON.parse(raw);
        if (
          typeof parsed.analytics === "boolean" &&
          typeof parsed.marketing === "boolean"
        ) {
          setPrefs(parsed);
          setShowBanner(false);
          return;
        }
      }
      setShowBanner(true);
    } catch {
      setShowBanner(true);
    }
  }, []);

  const saveAndClose = (next: ConsentPreferences) => {
    const toSave = { ...next, timestamp: Date.now(), necessary: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setPrefs(toSave);
    setShowBanner(false);
    setShowSettings(false);

    // Si quieres cargar scripts tras consentimiento, hazlo aquí.
    // if (toSave.analytics) {
    //   const s = document.createElement("script");
    //   s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
    //   s.async = true;
    //   document.head.appendChild(s);
    //   (window as any).dataLayer = (window as any).dataLayer || [];
    //   const gtag = function(){ (window as any).dataLayer.push(arguments); };
    //   gtag("js", new Date());
    //   gtag("config", "G-XXXXXXX");
    // }
  };

  const acceptAll = () =>
    saveAndClose({ ...prefs, analytics: true, marketing: true });
  const rejectAll = () =>
    saveAndClose({ ...prefs, analytics: false, marketing: false });

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[1000]" 
      style={{ 
        position: 'fixed',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      <div className="mx-auto max-w-4xl m-2 md:m-4 rounded-xl bg-gray-900 text-white border border-gray-700 shadow-2xl">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-1">Tu privacidad nos importa</h3>
          <p className="text-sm text-gray-300 mb-4">
            Usamos cookies para mejorar tu experiencia. Algunas son necesarias para que el sitio funcione.
            Puedes aceptar todas, rechazar las no esenciales o configurar tus preferencias.
          </p>

          {!showSettings && (
            <div className="flex flex-col md:flex-row gap-2">
              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
              >
                Aceptar todas
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Rechazar no esenciales
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                Configurar
              </button>
              <a
                href="/cookies"
                className="px-4 py-2 rounded-lg bg-transparent text-blue-400 underline underline-offset-2"
              >
                Política de Cookies
              </a>
              <a
                href="/privacidad"
                className="px-4 py-2 rounded-lg bg-transparent text-blue-400 underline underline-offset-2"
              >
                Política de Privacidad
              </a>
            </div>
          )}

          {showSettings && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">Necesarias</p>
                  <p className="text-xs text-gray-400">
                    Requeridas para el funcionamiento básico. Siempre activas.
                  </p>
                </div>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">Activadas</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">Analíticas</p>
                  <p className="text-xs text-gray-400">
                    Nos ayudan a entender el uso del sitio (p. ej., Google Analytics).
                  </p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={prefs.analytics}
                    onChange={(e) =>
                      setPrefs({ ...prefs, analytics: e.target.checked })
                    }
                  />
                  <div className="w-10 h-5 bg-gray-700 peer-checked:bg-blue-600 rounded-full transition-all relative">
                    <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full peer-checked:left-5 transition-all" />
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-xs text-gray-400">
                    Para personalización y publicidad (píxeles de seguimiento, etc.).
                  </p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={prefs.marketing}
                    onChange={(e) =>
                      setPrefs({ ...prefs, marketing: e.target.checked })
                    }
                  />
                  <div className="w-10 h-5 bg-gray-700 peer-checked:bg-blue-600 rounded-full transition-all relative">
                    <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full peer-checked:left-5 transition-all" />
                  </div>
                </label>
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={() => saveAndClose(prefs)}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
                >
                  Guardar preferencias
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;