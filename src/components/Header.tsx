
import React, { useState } from 'react';
import { User, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language, Theme } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';
import { SidebarTrigger } from '@/components/ui/sidebar'; 
import { User as UserType } from '../types/auth';
import SettingsModal from './SettingsModal';
import UserProfileModal from './UserProfileModal';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  language: Language;
  theme: Theme;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: Theme) => void;
  onUserUpdate: (updatedUser: UserType) => void;
  onPermissionsUpdate: () => void;
}

export function Header({ 
  user, 
  onLogout, 
  language, 
  theme, 
  onLanguageChange, 
  onThemeChange, 
  onUserUpdate, 
  onPermissionsUpdate 
}: HeaderProps) {
  const { t } = useTranslation(language);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-800 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between h-12 sm:h-14 w-full min-w-0 z-30 sticky top-0">
        <div className="flex items-center min-w-0 flex-shrink-0">
          <SidebarTrigger className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
            <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </SidebarTrigger>
          
          {/* Logo/Título solo en pantallas grandes */}
          <div className="hidden lg:flex items-center ml-4">
            <h1 className="text-lg font-bold text-blue-900 dark:text-blue-100">
              GEESTOR V.2.0
            </h1>
          </div>
        </div>
        
        {/* Botones de usuario - completamente responsivos */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
          <UserProfileModal
            user={user}
            language={language}
            onUserUpdate={onUserUpdate}
            onLogout={onLogout}
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1.5 sm:px-2 py-1 h-7 sm:h-8 min-w-7 sm:min-w-8 flex-shrink-0 rounded-md transition-colors"
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {/* Texto solo en pantallas medianas y grandes */}
              <span className="ml-1 hidden md:inline text-xs sm:text-sm font-medium">
                {t('profile')}
              </span>
            </Button>
          </UserProfileModal>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSettingsClick}
            className="flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1.5 sm:px-2 py-1 h-7 sm:h-8 min-w-7 sm:min-w-8 flex-shrink-0 rounded-md transition-colors"
          >
            <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {/* Texto solo en pantallas medianas y grandes */}
            <span className="ml-1 hidden md:inline text-xs sm:text-sm font-medium">
              {t('settings')}
            </span>
          </Button>
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        theme={theme}
        onLanguageChange={onLanguageChange}
        onThemeChange={onThemeChange}
      />
    </>
  );
}
