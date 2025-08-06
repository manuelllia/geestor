
import { translations, Language } from '../utils/translations';

export const useTranslation = (language: Language) => {
  const t = (key: keyof typeof translations.es): string => {
    return translations[language][key] || translations.es[key] || key;
  };

  return { t };
};
