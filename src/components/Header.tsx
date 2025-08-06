
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { LogOut, User, Languages, Palette } from 'lucide-react';
import { User as UserType } from '../types/auth';
import { Language, Theme } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';
import UserProfileModal from './UserProfileModal';

interface HeaderProps {
  user: UserType;
  language: Language;
  theme: Theme;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: Theme) => void;
  onUserUpdate: (user: UserType) => void;
  onLogout: () => void;
  onPermissionsUpdate?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  language, 
  theme, 
  onLanguageChange, 
  onThemeChange, 
  onUserUpdate, 
  onLogout,
  onPermissionsUpdate 
}) => {
  const { t } = useTranslation(language);
  const [permissionsUpdateKey, setPermissionsUpdateKey] = useState(0);

  const handlePermissionsUpdate = () => {
    setPermissionsUpdateKey(prev => prev + 1);
    if (onPermissionsUpdate) {
      onPermissionsUpdate();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-800 px-6 h-16 flex items-center">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
            alt="GEESTOR Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
                  {user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700">
              <UserProfileModal 
                user={user} 
                language={language}
                onUserUpdate={onUserUpdate}
                onPermissionsUpdate={handlePermissionsUpdate}
              >
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-700 dark:text-gray-300"
                  onSelect={(e) => e.preventDefault()}
                >
                  <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  {t('userProfile')}
                </DropdownMenuItem>
              </UserProfileModal>
              
              <DropdownMenuSeparator className="bg-blue-200 dark:bg-blue-700" />
              
              {/* Language Switch */}
              <div className="px-2 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('language')}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className={language === 'es' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>ES</span>
                  <Switch
                    checked={language === 'en'}
                    onCheckedChange={(checked) => onLanguageChange(checked ? 'en' : 'es')}
                    className="mx-1 scale-75"
                  />
                  <span className={language === 'en' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>EN</span>
                </div>
              </div>
              
              {/* Theme Switch */}
              <div className="px-2 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('theme')}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className={theme === 'light' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>☀️</span>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                    className="mx-1 scale-75"
                  />
                  <span className={theme === 'dark' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>🌙</span>
                </div>
              </div>
              
              <DropdownMenuSeparator className="bg-blue-200 dark:bg-blue-700" />
              
              <DropdownMenuItem 
                onClick={onLogout}
                className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
