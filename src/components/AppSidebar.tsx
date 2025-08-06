
import React, { useState } from 'react';
import { Home, Building2, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AppSidebarProps {
  language: Language;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ language, activeSection, onSectionChange }) => {
  const { t } = useTranslation(language);
  const { state, toggleSidebar } = useSidebar();
  const [isDepartamentosOpen, setIsDepartamentosOpen] = useState(false);
  const isCollapsed = state === 'collapsed';

  const menuItems = [
    {
      id: 'inicio',
      title: t('inicio'),
      icon: Home,
      onClick: () => onSectionChange('inicio')
    }
  ];

  const departamentosSubItems = [
    { id: 'operaciones', title: t('operaciones') },
    { id: 'gestion-tecnica', title: t('gestionTecnica') },
    { id: 'gestion-talento', title: t('gestionTalento') }
  ];

  const handleSubItemClick = (subItemId: string) => {
    onSectionChange(subItemId);
  };

  return (
    <Sidebar 
      className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
                alt="GEESTOR Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                GEESTOR
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Inicio */}
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    isActive={activeSection === item.id}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Departamentos */}
              <SidebarMenuItem>
                <Collapsible 
                  open={isDepartamentosOpen} 
                  onOpenChange={setIsDepartamentosOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      tooltip={isCollapsed ? t('departamentos') : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">{t('departamentos')}</span>}
                      </div>
                      {!isCollapsed && (
                        <div className="transition-transform duration-200">
                          {isDepartamentosOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  {!isCollapsed && (
                    <CollapsibleContent className="ml-6 mt-2 space-y-1 animate-slideDown">
                      {departamentosSubItems.map((subItem) => (
                        <SidebarMenuItem key={subItem.id}>
                          <SidebarMenuButton
                            onClick={() => handleSubItemClick(subItem.id)}
                            isActive={activeSection === subItem.id}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="w-2 h-2 bg-current rounded-full flex-shrink-0" />
                            <span>{subItem.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
