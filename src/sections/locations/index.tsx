import React from 'react';
import { useTranslation } from 'react-i18next';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const Locations: React.FC = () => {
  const { t } = useTranslation();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: locationsRef, isVisible: locationsVisible } = useScrollAnimation();

  return (
    <section className="bg-gradient-to-b from-black to-gray-950 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {t('locationsTitle')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('locationsSubtitle')}
          </p>
        </div>

        {/* Ubicaciones */}
        <div
          ref={locationsRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-300 ${
            locationsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Sede Principal - Madrid */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-8 border border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.1)] transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{t('locationsMadridTitle')}</h3>
                <span className="text-blue-400 font-medium">{t('locationsMadridType')}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-white font-medium">C. Severo Ochoa, 5</p>
                  <p className="text-gray-300">28860 Paracuellos de Jarama, Madrid</p>
                  <p className="text-gray-300">España</p>
                </div>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-gray-300">+34 670 372 239</p>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-300">info@manpowers.es</p>
              </div>
            </div>
          </div>

          {/* Oficina - Mallorca */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-8 border border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.1)] transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-green-600 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{t('locationsMallorcaTitle')}</h3>
                <span className="text-green-400 font-medium">{t('locationsMallorcaType')}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-white font-medium">Carrer Ferrers, 6</p>
                  <p className="text-gray-300">07500 Manacor, Illes Balears</p>
                  <p className="text-gray-300">España</p>
                </div>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-gray-300">+34 670 372 239</p>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-300">info@manpowers.es</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje adicional */}
        <div className="text-center mt-12">
          <p className="text-gray-300 text-lg">
            {t('locationsMessage')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Locations;