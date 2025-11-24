import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const CookiesPolicyPage: React.FC = () => {
  const { t } = useTranslation();
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <Header />
      <main className={`flex-grow pt-24 md:pt-28 transition-all duration-500 ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-16">
          <h1 className="text-3xl font-bold mb-6">{t('cookies.title')}</h1>
          <p className="text-gray-300 mb-4">{t('cookies.intro')}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('cookies.whatTitle')}</h2>
          <p className="text-gray-300 mb-4">{t('cookies.whatText')}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('cookies.typesTitle')}</h2>
          <ul className="list-disc ml-6 text-gray-300 mb-4">
            <li><span className="font-medium">{t('cookies.typesNecessary').split(':')[0]}:</span> {t('cookies.typesNecessary').split(':').slice(1).join(':').trim()}</li>
            <li><span className="font-medium">{t('cookies.typesAnalytics').split(':')[0]}:</span> {t('cookies.typesAnalytics').split(':').slice(1).join(':').trim()}</li>
            <li><span className="font-medium">{t('cookies.typesMarketing').split(':')[0]}:</span> {t('cookies.typesMarketing').split(':').slice(1).join(':').trim()}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('cookies.manageTitle')}</h2>
          <p className="text-gray-300 mb-4">{t('cookies.manageText')}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('cookies.revokeTitle')}</h2>
          <p className="text-gray-300 mb-4">{t('cookies.revokeText')}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('cookies.detailCookiesTitle')}</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('cookies.functionalTitle')}</h3>
          <p className="text-gray-300 mb-4">{t('cookies.functionalText')}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('cookies.performanceTitle')}</h3>
          <p className="text-gray-300 mb-4">{t('cookies.performanceText')}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('cookies.thirdPartiesTitle')}</h3>
          <p className="text-gray-300 mb-4">{t('cookies.thirdPartiesText')}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('cookies.consentTitle')}</h2>
          <p className="text-gray-300 mb-4">{t('cookies.consentText')}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t('cookies.updateTitle')}</h2>
          <p className="text-gray-300 mb-4">{t('cookies.updateText')}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPolicyPage;
