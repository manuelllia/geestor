
import { translations, Language } from '../utils/translations';

export const useTranslation = (language: Language) => {
  const t = (key: keyof typeof translations): string => {
    const translation = translations[key];
    if (translation && typeof translation === 'object' && translation[language]) {
      return translation[language];
    }
    if (translation && typeof translation === 'object' && translation.es) {
      return translation.es;
    }
    return String(key);
  };

  return { t };
};
