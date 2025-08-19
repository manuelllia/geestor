
import { useState, useEffect } from 'react';
import { Language, Theme } from '../utils/translations';

interface Preferences {
  language: Language;
  theme: Theme;
}

const DEFAULT_PREFERENCES: Preferences = {
  language: 'es',
  theme: 'light'
};

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('geestor-preferences');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
  }, [preferences.theme]);

  const updatePreferences = (newPrefs: Partial<Preferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('geestor-preferences', JSON.stringify(updated));
  };

  return {
    preferences,
    updatePreferences,
    setLanguage: (language: Language) => updatePreferences({ language }),
    setTheme: (theme: Theme) => updatePreferences({ theme })
  };
};
