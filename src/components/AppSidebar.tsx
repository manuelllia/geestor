
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
  SidebarTrigger,
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

interface AppSidebarProps {
  language: Language;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ language, activeSection, onSectionChange }: AppSidebarProps) {
  const { t } = useTranslation(language);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

  const handleGroupToggle = (groupId: string) => {
    setOpenGroup(openGroup === groupId ? null : groupId);
  };

  const handleSubmenuToggle = (submenuId: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [submenuId]: !prev[submenuId]
    }));
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

  return (
    <Sidebar className="border-r border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900">
      <SidebarHeader className="border-b border-blue-200 dark:border-blue-800 p-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-semibold text-blue-900 dark:text-blue-100">GEESTOR</h2>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Gestión Empresarial
              </p>
            </div>
          </div>
          <SidebarTrigger className="h-6 w-6" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Inicio - Item individual */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === 'inicio'}
                  onClick={() => onSectionChange('inicio')}
                  className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 mb-2"
                >
                  <Home className="w-4 h-4" />
                  <span className="group-data-[collapsible=icon]:hidden">Inicio</span>
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
                <SidebarGroupLabel className="group/label hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-blue-600 dark:text-blue-300 font-semibold text-xs uppercase tracking-wide p-2 rounded-md flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                  <span className="group-data-[collapsible=icon]:hidden">{group.label}</span>
                  <span className="group-data-[collapsible=icon]:hidden">
                    {openGroup === group.id ? (
                      <ChevronDown className="w-4 h-4 transition-transform" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform" />
                    )}
                  </span>
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
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
                                onSectionChange(item.id);
                              }}
                              className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 text-gray-700 dark:text-gray-300 py-2"
                            >
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                              {openSubmenus[item.id] ? (
                                <ChevronDown className="w-3 h-3 ml-auto" />
                              ) : (
                                <ChevronRight className="w-3 h-3 ml-auto" />
                              )}
                            </SidebarMenuButton>
                            
                            {openSubmenus[item.id] && item.submenuItems && (
                              <div className="ml-6 mt-1 space-y-1">
                                {item.submenuItems.map((subItem) => (
                                  <SidebarMenuButton
                                    key={subItem.id}
                                    isActive={activeSection === subItem.id}
                                    onClick={() => onSectionChange(subItem.id)}
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
                            onClick={() => onSectionChange(item.id)}
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
      </SidebarContent>
    </Sidebar>
  );
}
