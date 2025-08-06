
import { translations, Language } from '../utils/translations';

export const useTranslation = (language: Language) => {
  const t = (key: keyof typeof translations, params?: Record<string, any>): string => {
    const translation = translations[key];
    if (translation && typeof translation === 'object' && translation[language]) {
      let result = translation[language];
      
      // Si se proporcionan parámetros, reemplazar los placeholders
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
        });
      }
      
      return result;
    }
    // Fallback al español si no existe la traducción en el idioma solicitado
    if (translation && typeof translation === 'object' && translation.es) {
      let result = translation.es;
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
        });
      }
      return result;
    }
    // Fallback al string de la clave si no existe traducción
    return String(key);
  };

  return { t };
};
