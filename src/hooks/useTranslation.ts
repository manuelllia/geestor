
import { translations, Language } from '../utils/translations';

export const useTranslation = (language: Language) => {
  const t = (key: keyof typeof translations): string => {
    return translations[key][language] || translations[key].es || key;
  };

  return { t };
};
