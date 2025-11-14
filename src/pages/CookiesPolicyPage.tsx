import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const CookiesPolicyPage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <Header />
      <main className={`flex-grow pt-24 md:pt-28 transition-all duration-500 ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-16">
          <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
          <p className="text-gray-300 mb-4">
            Utilizamos cookies propias y de terceros para finalidades necesarias, analíticas y de marketing, siempre con tu consentimiento cuando no sean imprescindibles.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">¿Qué son las cookies?</h2>
          <p className="text-gray-300 mb-4">
            Son archivos que se guardan en tu dispositivo para recordar preferencias, mejorar la experiencia y realizar medición de uso.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Tipos de cookies que usamos</h2>
          <ul className="list-disc ml-6 text-gray-300 mb-4">
            <li><span className="font-medium">Necesarias:</span> Imprescindibles para el funcionamiento del sitio.</li>
            <li><span className="font-medium">Analíticas:</span> Ayudan a entender el uso del sitio web.</li>
            <li><span className="font-medium">Marketing:</span> Personalizan la publicidad y el contenido.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Gestión de cookies</h2>
          <p className="text-gray-300 mb-4">
            Puedes configurar tus preferencias en el banner de cookies o desde la configuración de tu navegador.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Revocar consentimiento</h2>
          <p className="text-gray-300 mb-4">
            Puedes borrar el almacenamiento del navegador para restablecer el banner de consentimiento o contactarnos en <a href="mailto:info@manpowers.es" className="text-blue-400 underline">info@manpowers.es</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPolicyPage;