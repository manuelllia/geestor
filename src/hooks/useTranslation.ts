
import { translations, Language } from '../utils/translations';

export const useTranslation = (language: Language) => {
  const t = (key: keyof typeof translations): string => {
    const translation = translations[key];
    if (translation && typeof translation === 'object' && translation[language]) {
      return translation[language];
    }
    // Fallback al español si no existe la traducción en el idioma solicitado
    if (translation && typeof translation === 'object' && translation.es) {
      return translation.es;
    }
    // Fallback al string de la clave si no existe traducción
    return String(key);
  };

  return { t };
};
