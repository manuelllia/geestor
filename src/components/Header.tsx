
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
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleUserProfileClick = () => {
    setIsUserProfileOpen(true);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-800 px-4 py-3 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleUserProfileClick}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <User className="h-4 w-4 mr-2" />
            {t('profile')}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSettingsClick}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Settings className="h-4 w-4 mr-2" />
            {t('settings')}
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

      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={user}
        onLogout={onLogout}
        onUserUpdate={onUserUpdate}
        onPermissionsUpdate={onPermissionsUpdate}
        language={language}
      />
    </>
  );
}
