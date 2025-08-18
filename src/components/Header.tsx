
import React, { useState } from 'react';
import { User, Settings, Menu, LogOut, Shield } from 'lucide-react';
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

  const handleLogout = () => {
    onLogout();
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-800 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between h-14 sm:h-16">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <SidebarTrigger className="h-6 w-6 sm:h-8 sm:w-8">
            <Menu className="h-3 w-3 sm:h-4 sm:w-4" />
          </SidebarTrigger>
          
          {/* Mostrar indicador de admin si es administrador */}
          {user.isAdmin && (
            <div className="flex items-center bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-2 py-1 rounded-md text-xs font-semibold">
              <Shield className="h-3 w-3 mr-1" />
              {t('admin')}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <UserProfileModal
            user={user}
            language={language}
            onUserUpdate={onUserUpdate}
            onPermissionsUpdate={onPermissionsUpdate}
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">{t('profile')}</span>
            </Button>
          </UserProfileModal>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSettingsClick}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">{t('settings')}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">{t('logout')}</span>
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
