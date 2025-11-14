import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const PrivacyPolicyPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
          <p className="text-gray-300 mb-4">
            En MANPOWERS, respetamos tu privacidad y cumplimos con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Responsable del tratamiento</h2>
          <p className="text-gray-300 mb-4">MANPOWERS, C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid. Email: <a href="mailto:info@manpowers.es" className="text-blue-400 underline">info@manpowers.es</a>.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Finalidades del tratamiento</h2>
          <p className="text-gray-300 mb-4">
            Gestionar pedidos y pagos, atención al cliente, comunicaciones relacionadas con los productos, y mejora de la experiencia de uso del sitio.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Legitimación</h2>
          <p className="text-gray-300 mb-4">Ejecución de contrato, cumplimiento de obligaciones legales e interés legítimo. Para marketing y analítica, se solicitará tu consentimiento.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Destinatarios</h2>
          <p className="text-gray-300 mb-4">Proveedores de servicios necesarios para la operativa (p. ej., pasarela de pago, logística) y, en su caso, analítica/marketing cuando aceptes cookies no esenciales.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Derechos</h2>
          <p className="text-gray-300 mb-4">
            Puedes ejercer acceso, rectificación, supresión, limitación, oposición y portabilidad a través de <a href="mailto:info@manpowers.es" className="text-blue-400 underline">info@manpowers.es</a>.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Conservación</h2>
          <p className="text-gray-300 mb-4">Los datos se conservan durante los plazos necesarios para las finalidades y obligaciones legales aplicables.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Cookies</h2>
          <p className="text-gray-300 mb-4">
            Consulta la <a href="/cookies" className="text-blue-400 underline">Política de Cookies</a> para más información sobre el uso de tecnologías de seguimiento.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;