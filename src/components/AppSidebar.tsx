
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  Home, 
  FileText, 
  BarChart2, 
  Users,
  Calendar,
  CheckSquare,
  UserCheck,
  Briefcase,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Building2
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '../hooks/use-mobile';

interface AppSidebarProps {
  language: Language;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ language, activeSection, onSectionChange }: AppSidebarProps) {
  const { t } = useTranslation(language);
  const { setOpenMobile, state } = useSidebar();
  const isMobile = useIsMobile();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  
  const isCollapsed = state === 'collapsed';

  const handleGroupToggle = (groupId: string) => {
    setOpenGroup(openGroup === groupId ? null : groupId);
  };

  const handleSubmenuToggle = (submenuId: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [submenuId]: !prev[submenuId]
    }));
  };

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    // Auto-close sidebar on mobile when a section is selected
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const menuGroups = [
    {
      id: 'operaciones',
      label: 'OPERACIONES',
      items: [
        {
          id: 'analisis-coste',
          label: 'Análisis de Coste',
          icon: BarChart2,
        },
      ]
    },
    {
      id: 'gestion-tecnica',
      label: 'GESTIÓN TÉCNICA',
      items: [
        {
          id: 'calendario-mantenimiento',
          label: 'Calendario de Mant...',
          icon: Calendar,
        },
        {
          id: 'comprobadores',
          label: 'Comprobadores',
          icon: CheckSquare,
        },
      ]
    },
    {
      id: 'gestion-talento',
      label: 'GESTIÓN DE TALENTO',
      items: [
        {
          id: 'solicitudes-contratacion',
          label: 'Solicitudes de Cont...',
          icon: Users,
        },
        {
          id: 'hojas-cambio',
          label: 'Hojas de Cambio',
          icon: FileText,
        },
        {
          id: 'acuerdo-empleado',
          label: 'Acuerdo con Emple...',
          icon: UserCheck,
        },
        {
          id: 'gestion-inmuebles',
          label: 'Gestión de Inmuebles',
          icon: Building2,
        },
        {
          id: 'practicas',
          label: 'Prácticas',
          icon: Briefcase,
          hasSubmenu: true,
          submenuItems: [
            { id: 'practicas-generales', label: 'Prácticas Generales' },
            { id: 'practicas-especializadas', label: 'Prácticas Especializadas' },
            { id: 'convenios', label: 'Convenios de Prácticas' }
          ]
        },
        {
          id: 'entrevista-salida',
          label: 'Entrevista de Salida',
          icon: MessageSquare,
        },
      ]
    },
  ];

  // Get all items for collapsed view
  const allItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    ...menuGroups.flatMap(group => group.items.flatMap(item => {
      if (item.hasSubmenu && item.submenuItems) {
        return [item, ...item.submenuItems.map(subItem => ({ ...subItem, icon: item.icon }))];
      }
      return [item];
    }))
  ];

  return (
    <Sidebar 
      className="border-r border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-blue-200 dark:border-blue-800 p-4 h-16">
        <div className="flex items-center justify-center h-full">
          {isCollapsed ? (
            <img 
              src="/lovable-uploads/1e2990fc-768b-4645-bfc4-725186d26e5b.png" 
              alt="GEE Logo" 
              className="h-10 w-10 object-contain"
            />
          ) : (
            <img 
              src="/lovable-uploads/f7fd6e9d-43a7-47ba-815e-fdaa1b630f6b.png" 
              alt="GEESTOR Logo" 
              className="h-10 w-auto object-contain"
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {isCollapsed ? (
          // Collapsed view - show all icons vertically centered
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {allItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => handleSectionChange(item.id)}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 p-2 w-full flex items-center justify-center"
                      tooltip={item.label}
                    >
                      <item.icon className="w-5 h-5" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          // Expanded view - show grouped structure
          <>
            {/* Inicio - Item individual */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'inicio'}
                      onClick={() => handleSectionChange('inicio')}
                      className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 mb-2"
                    >
                      <Home className="w-4 h-4" />
                      <span>Inicio</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Grupos desplegables */}
            {menuGroups.map((group) => (
              <SidebarGroup key={group.id} className="mb-2">
                <Collapsible 
                  open={openGroup === group.id} 
                  onOpenChange={() => handleGroupToggle(group.id)}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="group/label hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-blue-600 dark:text-blue-300 font-semibold text-xs uppercase tracking-wide p-2 rounded-md flex items-center justify-between">
                      <span>{group.label}</span>
                      <span>
                        {openGroup === group.id ? (
                          <ChevronDown className="w-4 h-4 transition-transform" />
                        ) : (
                          <ChevronRight className="w-4 h-4 transition-transform" />
                        )}
                      </span>
                    </SidebarGroupLabel>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="ml-2">
                        {group.items.map((item) => (
                          <SidebarMenuItem key={item.id}>
                            {item.hasSubmenu ? (
                              <div>
                                <SidebarMenuButton
                                  isActive={activeSection === item.id}
                                  onClick={() => {
                                    handleSubmenuToggle(item.id);
                                    handleSectionChange(item.id);
                                  }}
                                  className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 text-gray-700 dark:text-gray-300 py-2"
                                >
                                  <item.icon className="w-4 h-4" />
                                  <span>{item.label}</span>
                                  <span>
                                    {openSubmenus[item.id] ? (
                                      <ChevronDown className="w-3 h-3 ml-auto" />
                                    ) : (
                                      <ChevronRight className="w-3 h-3 ml-auto" />
                                    )}
                                  </span>
                                </SidebarMenuButton>
                                
                                {openSubmenus[item.id] && item.submenuItems && (
                                  <div className="ml-6 mt-1 space-y-1">
                                    {item.submenuItems.map((subItem) => (
                                      <SidebarMenuButton
                                        key={subItem.id}
                                        isActive={activeSection === subItem.id}
                                        onClick={() => handleSectionChange(subItem.id)}
                                        className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 text-gray-600 dark:text-gray-400 py-1 text-sm"
                                      >
                                        <span>{subItem.label}</span>
                                      </SidebarMenuButton>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <SidebarMenuButton
                                isActive={activeSection === item.id}
                                onClick={() => handleSectionChange(item.id)}
                                className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 text-gray-700 dark:text-gray-300 py-2"
                              >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            )}
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>
            ))}
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
