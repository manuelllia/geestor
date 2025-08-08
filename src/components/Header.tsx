
import React from 'react';
import { User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
  language: Language;
  isDarkMode: boolean;
  onSettingsClick: () => void;
  onUserProfileClick: () => void;
}

export function Header({ language, isDarkMode, onSettingsClick, onUserProfileClick }: HeaderProps) {
  const { t } = useTranslation(language);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-800 px-4 py-3 flex items-center justify-between h-16">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="h-8 w-8" />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onUserProfileClick}
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <User className="h-4 w-4 mr-2" />
          {t('profile')}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onSettingsClick}
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <Settings className="h-4 w-4 mr-2" />
          {t('settings')}
        </Button>
      </div>
    </header>
  );
}
