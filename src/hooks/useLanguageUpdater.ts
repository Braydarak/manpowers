import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageUpdater = () => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // Actualizar el atributo lang del HTML usando base code (es/en)
    const baseLang = i18n.resolvedLanguage?.split('-')[0] || i18n.language?.split('-')[0] || 'es';
    document.documentElement.lang = baseLang;
    
    // Actualizar el título de la página
    document.title = t('pageTitle');
  }, [i18n.language, i18n.resolvedLanguage, t]);

  return null;
};

export default useLanguageUpdater;