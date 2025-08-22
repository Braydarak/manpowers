import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageUpdater = () => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // Actualizar el atributo lang del HTML
    document.documentElement.lang = i18n.language;
    
    // Actualizar el título de la página
    document.title = t('pageTitle');
  }, [i18n.language, t]);

  return null;
};

export default useLanguageUpdater;