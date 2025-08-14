
import { translations, Language } from '../utils/translations';

export const useTranslation = (language: Language) => {
  const t = (key: keyof typeof translations.es, params?: Record<string, any>): string => {
    const translation = translations[language]?.[key];
    
    if (translation) {
      // Check if translation is a string before calling replace
      if (typeof translation === 'string') {
        let result = translation;
        
        // Si se proporcionan parámetros, reemplazar los placeholders
        if (params) {
          Object.entries(params).forEach(([paramKey, value]) => {
            result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
          });
        }
        
        return result;
      } else {
        // If it's an object, return the key as fallback
        return String(key);
      }
    }
    
    // Fallback al español si no existe la traducción en el idioma solicitado
    const fallback = translations.es[key];
    if (fallback) {
      if (typeof fallback === 'string') {
        let result = fallback;
        if (params) {
          Object.entries(params).forEach(([paramKey, value]) => {
            result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
          });
        }
        return result;
      } else {
        return String(key);
      }
    }
    
    // Fallback al string de la clave si no existe traducción
    return String(key);
  };

  return { t };
};
