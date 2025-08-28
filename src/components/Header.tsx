
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-800 px-3 py-2.5 flex items-center justify-between h-14 w-full shadow-sm">
        <div className="flex items-center flex-shrink-0 min-w-0">
          <SidebarTrigger className="h-8 w-8 flex-shrink-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors mr-3">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
          
          <div className="hidden sm:flex items-center">
            <h1 className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100 whitespace-nowrap">
              GEESTOR V.2.0
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <UserProfileModal
            user={user}
            language={language}
            onUserUpdate={onUserUpdate}
            onLogout={onLogout}
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 h-8 min-w-8 flex-shrink-0 rounded-md transition-colors"
            >
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="ml-1.5 hidden md:inline text-sm font-medium whitespace-nowrap">
                {t('profile')}
              </span>
            </Button>
          </UserProfileModal>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSettingsClick}
            className="flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 h-8 min-w-8 flex-shrink-0 rounded-md transition-colors"
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span className="ml-1.5 hidden md:inline text-sm font-medium whitespace-nowrap">
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
