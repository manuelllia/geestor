
import React, { useState } from 'react';
import { Home, Building2, ChevronDown, ChevronRight } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';

interface AppSidebarProps {
  language: Language;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ language, activeSection, onSectionChange }) => {
  const { t } = useTranslation(language);
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    {
      id: 'inicio',
      title: t('inicio'),
      icon: Home,
      onClick: () => onSectionChange('inicio')
    },
    {
      id: 'departamentos',
      title: t('departamentos'),
      icon: Building2,
      hasSubMenu: true,
      subItems: [
        { id: 'operaciones', title: t('operaciones') },
        { id: 'gestion-tecnica', title: t('gestionTecnica') },
        { id: 'gestion-talento', title: t('gestionTalento') }
      ]
    }
  ];

  const handleDepartamentosClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubItemClick = (subItemId: string) => {
    onSectionChange(subItemId);
  };

  return (
    <Sidebar className="w-64 bg-primary border-r border-primary-foreground/10">
      <SidebarContent className="p-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 p-4">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={item.hasSubMenu ? handleDepartamentosClick : item.onClick}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${
                        activeSection === item.id ? 'bg-sidebar-accent' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {item.hasSubMenu && (
                        isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {item.hasSubMenu && isExpanded && (
                    <div className="ml-6 mt-2 space-y-1 animate-slideDown">
                      {item.subItems?.map((subItem) => (
                        <SidebarMenuItem key={subItem.id}>
                          <SidebarMenuButton
                            onClick={() => handleSubItemClick(subItem.id)}
                            className={`w-full flex items-center p-2 pl-4 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors ${
                              activeSection === subItem.id ? 'bg-sidebar-accent text-sidebar-foreground' : ''
                            }`}
                          >
                            <div className="w-2 h-2 bg-current rounded-full mr-3" />
                            {subItem.title}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
