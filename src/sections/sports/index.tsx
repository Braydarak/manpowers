import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import sportsDataFile from '../../data/sports.json';

const Sports: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  
  // Extraer los datos de deportes del archivo JSON
  const sportsData = sportsDataFile.sports;


  const handleSportClick = (sportId: string) => {
    navigate(`/products/${sportId}`);
  };

  return (
    <section id="sports" className="bg-gradient-to-b mt-20 from-black to-gray-950 text-white py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-full mx-auto">
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
            {t('sportsTitle')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('sportsSubtitle')}
          </p>
        </div>
        
        {/* Grid de deportes */}
        <div 
          ref={cardsRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-1000 delay-300 ${
            cardsVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          {sportsData.map((sport, index) => {
            return (
              <div 
                key={index} 
                className="group relative rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 border border-gray-700 h-[30rem] cursor-pointer"
                style={{
                  backgroundImage: `url(${sport.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={() => handleSportClick(sport.sportId)}
              >
                {/* Overlay negro que desaparece en hover */}
                <div className="absolute group-hover:opacity-0 inset-0 bg-black/50 transition-all duration-500 z-10"></div>

                {/* Contenido principal - siempre visible */}
                <div className="absolute inset-0 flex items-center justify-center z-20 group-hover:opacity-0 transition-all duration-500">
                  <h3 className="text-3xl md:text-4xl font-bold uppercase text-white text-center px-4 drop-shadow-[0_4px_20px_rgba(0,0,0,1)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_100%)]">
                    {t(sport.name)}
                  </h3>
                </div>

                {/* Contenido hover - aparece al hacer hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center text-center p-8 z-20 bg-opacity-40">
                  <h3 className="text-2xl md:text-3xl font-bold text-white uppercase mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {t(sport.name)}
                  </h3>
                  <p className="text-lg text-yellow-400 font-semibold mb-6 italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    "{t(sport.slogan)}"
                  </p>
                  <p className="text-gray-200 leading-relaxed mb-8 text-sm md:text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    {t(sport.description)}
                  </p>
                  <button 
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:from-yellow-500 hover:to-yellow-400 hover:scale-105 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSportClick(sport.sportId);
                    }}
                  >
                    {t('sportsButton')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Sports;