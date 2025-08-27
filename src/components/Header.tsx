
import React, { useState } from 'react';
import { User, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language, Theme } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';
import { SidebarTrigger } from '@/components/ui/sidebar'; 
import { User as UserType } from '../types/auth';
import SettingsModal from './SettingsModal';
import UserProfileModal from './UserProfileModal';
import { useResponsive } from '../hooks/useResponsive';

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
  const { isMobile } = useResponsive();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  return (
    <>
      <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between h-16 w-full min-w-0 sticky top-0 z-50">
        <div className="flex items-center min-w-0">
          <SidebarTrigger className="h-9 w-9 p-0">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
        </div>
        
        <div className="flex items-center responsive-gap">
          <UserProfileModal
            user={user}
            language={language}
            onUserUpdate={onUserUpdate}
            onLogout={onLogout}
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center justify-center text-primary hover:bg-accent h-9 px-3"
            >
              <User className="h-4 w-4" />
              {!isMobile && <span className="ml-2 text-sm">{t('profile')}</span>}
            </Button>
          </UserProfileModal>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSettingsClick}
            className="flex items-center justify-center text-primary hover:bg-accent h-9 px-3"
          >
            <Settings className="h-4 w-4" />
            {!isMobile && <span className="ml-2 text-sm">{t('settings')}</span>}
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
