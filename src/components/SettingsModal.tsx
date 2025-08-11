
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '../hooks/useTranslation';
import { Language, Theme } from '../utils/translations';
import { Globe, Palette, Settings, Sun, Moon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: Theme;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: Theme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  onLanguageChange,
  onThemeChange
}) => {
  const { t } = useTranslation(language);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900 border border-blue-200 dark:border-blue-700 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('settings')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-6">
          {/* Language Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {t('language')}
              </Label>
            </div>
            <div className="pl-13">
              <Select value={language} onValueChange={onLanguageChange}>
                <SelectTrigger className="w-full h-12 bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600">
                  <SelectValue className="font-medium" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-xl">
                  <SelectItem 
                    value="es" 
                    className="h-12 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🇪🇸</span>
                      <span>{t('spanish')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem 
                    value="en" 
                    className="h-12 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🇺🇸</span>
                      <span>{t('english')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {t('theme')}
              </Label>
            </div>
            <div className="pl-13">
              <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                    {theme === 'light' ? (
                      <Sun className="w-4 h-4 text-white" />
                    ) : (
                      <Moon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {theme === 'light' ? t('light') : t('dark')}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {theme === 'light' ? 'Tema claro y profesional' : 'Tema oscuro y elegante'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
