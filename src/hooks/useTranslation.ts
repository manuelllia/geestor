
import { translations, Language } from '../utils/translations';

export const useTranslation = (language: Language) => {
  const t = (key: keyof typeof translations.es, params?: Record<string, any>): string => {
    const translation = translations[language]?.[key];
    
    if (translation) {
      let result = translation;
      
      // Si se proporcionan parámetros, reemplazar los placeholders
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
        });
      }
      
      return result;
    }
    
    // Fallback al español si no existe la traducción en el idioma solicitado
    const fallback = translations.es[key];
    if (fallback) {
      let result = fallback;
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
