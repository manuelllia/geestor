
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
      <header className="bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-800 px-2 py-2 flex items-center justify-between h-14 w-full min-w-0">
        <div className="flex items-center min-w-0 flex-shrink-0">
          <SidebarTrigger className="h-8 w-8 flex-shrink-0">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <UserProfileModal
            user={user}
            language={language}
            onUserUpdate={onUserUpdate}
            onLogout={onLogout}
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 h-8 min-w-8 flex-shrink-0"
            >
              <User className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline text-sm">{t('profile')}</span>
            </Button>
          </UserProfileModal>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSettingsClick}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 h-8 min-w-8 flex-shrink-0"
          >
            <Settings className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline text-sm">{t('settings')}</span>
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
