// src/hooks/useTranslation.ts
import { useCallback } from 'react'; // Importa useCallback
import { translations, Language, Translations } from '../utils/translations'; // Ajusta la ruta y el tipo Translations

export const useTranslation = (language: Language) => {
  // Envuelve la función 't' en useCallback.
  // Esto asegura que 't' solo se recrea (su referencia cambia)
  // cuando la 'language' cambia.
  const t = useCallback((key: keyof Translations, params?: Record<string, any>): string => {
    // Asegúrate de que `key` sea de tipo `keyof Translations` para mejor tipado.
    // Asumimos que `Translations` contiene todas las claves posibles.
    const translation = translations[language]?.[key];
    
    if (translation) {
      let result = translation;
      
      // Si se proporcionan parámetros, reemplazar los placeholders
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          // Usamos {{paramKey}} en las traducciones del archivo, no {paramKey}
          // Para que funcione con tu hook actual, ajusta a \{{paramKey}\} o mantén {paramKey}
          // Si cambiaste tu translation.ts para usar {{paramKey}} como sugerí antes,
          // usa new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g') aquí.
          // Basado en tu `showingRecords: 'Mostrando {{start}} a {{end}} de {{total}} registros'`,
          // la regex debería ser `\\{\\{${paramKey}\\}\\}`, si no, ajusta `translations.ts` o aquí.
          result = result.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(value));
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
          result = result.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(value));
        });
      }
      return result;
    }
    
    // Fallback al string de la clave si no existe traducción
    return String(key);
  }, [language]); // <-- ¡IMPORTANTE! `t` solo depende de `language`

  return { t };
};