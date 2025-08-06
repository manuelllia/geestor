
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, LogOut, ChevronDown, Languages, Palette, SidebarOpen } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '../types/auth';
import { useTranslation } from '../hooks/useTranslation';
import { Language, Theme } from '../utils/translations';
import { useSidebar } from '@/components/ui/sidebar';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  language: Language;
  theme: Theme;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogout, 
  language, 
  theme, 
  onLanguageChange, 
  onThemeChange 
}) => {
  const { t } = useTranslation(language);
  const { toggleSidebar } = useSidebar();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <SidebarOpen className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
            alt="GEESTOR Logo" 
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-xl font-bold text-primary">
            {t('appName')}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Preferencias visibles */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {/* Switch de idioma */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-20 h-8 border-0 bg-transparent text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="en">EN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

          {/* Switch de tema */}
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
              className="data-[state=checked]:bg-primary h-5 w-9"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[40px]">
              {theme === 'light' ? '☀️' : '🌙'}
            </span>
          </div>
        </div>

        {/* Usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto hover:bg-gray-100 dark:hover:bg-gray-800">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="bg-primary text-white text-sm">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            {/* Preferencias móvil */}
            <div className="md:hidden p-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    <span className="text-sm">{t('language')}</span>
                  </div>
                  <Select value={language} onValueChange={onLanguageChange}>
                    <SelectTrigger className="w-16 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">ES</SelectItem>
                      <SelectItem value="en">EN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span className="text-sm">{t('theme')}</span>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                    className="h-4 w-7"
                  />
                </div>
              </div>
              <DropdownMenuSeparator className="my-2" />
            </div>
            
            <DropdownMenuItem 
              onClick={onLogout}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
