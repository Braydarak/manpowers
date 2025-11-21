import React from 'react';
import { useTranslation } from 'react-i18next';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import useCountUp from '../../hooks/useCountUp';

const AboutUs: React.FC = () => {
  const { t } = useTranslation();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: originsRef, isVisible: originsVisible } = useScrollAnimation();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation();
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation();
  const { ref: visionRef, isVisible: visionVisible } = useScrollAnimation();
  const { count: productsCount, ref: productsRef } = useCountUp({ end: 25, duration: 2000 });
  const { count: qualityCount, ref: qualityRef } = useCountUp({ end: 100, duration: 2500 });
  
  return (
    <section id="about-us" className="text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Título principal */}
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {t('aboutTitle')}
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('aboutSubtitle')}
          </p>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Historia */}
          <div 
            ref={originsRef as React.RefObject<HTMLDivElement>}
            className={`space-y-6 transition-all text-center duration-1000 delay-200 ${
              originsVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              {t('aboutOriginsTitle')}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('aboutOrigins1')}
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('aboutOrigins2')}
            </p>
          </div>
        {/* Valores */}
          <div 
            ref={valuesRef as React.RefObject<HTMLDivElement>}
            className={`bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-1000 delay-400 ${
              valuesVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
          >
            <h4 className="text-2xl font-bold text-white mb-6">{t('aboutValuesTitle')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h5 className="font-semibold text-white">{t('aboutQuality')}</h5>
                  <p className="text-gray-400">{t('aboutQualityDesc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h5 className="font-semibold text-white">{t('aboutInnovation')}</h5>
                  <p className="text-gray-400">{t('aboutInnovationDesc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h5 className="font-semibold text-white">{t('aboutCommitment')}</h5>
                  <p className="text-gray-400">{t('aboutCommitmentDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div 
            ref={missionRef as React.RefObject<HTMLDivElement>}
            className={`bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-1000 delay-200 ${
              missionVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">{t('aboutMissionTitle')}</h3>
            </div>
            <p className="text-gray-300 text-center leading-relaxed">
               {t('aboutMission')}
             </p>
          </div>

          <div 
            ref={visionRef as React.RefObject<HTMLDivElement>}
            className={`bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-1000 delay-400 ${
              visionVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">{t('aboutVisionTitle')}</h3>
            </div>
            <p className="text-gray-300 text-center leading-relaxed">
               {t('aboutVision')}
             </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 mb-20">
          <h3 className="text-3xl font-bold text-center text-white mb-12">{t('aboutStatsTitle')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <div ref={productsRef as React.RefObject<HTMLDivElement>} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {productsCount}+
              </div>
              <div className="text-gray-400 text-sm md:text-base">{t('aboutProducts')}</div>
            </div>
            <div ref={qualityRef as React.RefObject<HTMLDivElement>} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {qualityCount}%
              </div>
              <div className="text-gray-400 text-sm md:text-base">{t('aboutQualityGuarantee')}</div>
            </div>
          </div>
        </div>

        {/* Compromiso con la calidad */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
            {t('aboutCommitmentTitle')}
          </h3>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            {t('aboutCommitmentText')}
          </p>
          <div className="inline-flex items-center space-x-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-semibold">{t('aboutSuccess')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;