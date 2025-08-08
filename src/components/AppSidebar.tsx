
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
  ChevronRight
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

  const handleGroupToggle = (groupId: string) => {
    // Si el grupo ya está abierto, lo cerramos. Si no, abrimos solo este grupo
    setOpenGroup(openGroup === groupId ? null : groupId);
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
          id: 'practicas',
          label: 'Prácticas',
          icon: Briefcase,
          hasSubmenu: true
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
      <SidebarHeader className="border-b border-blue-200 dark:border-blue-800 p-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div>
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
                  {openGroup === group.id ? (
                    <ChevronDown className="w-4 h-4 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 transition-transform" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="ml-2">
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeSection === item.id}
                          onClick={() => onSectionChange(item.id)}
                          className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 text-gray-700 dark:text-gray-300 py-2"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                          {item.hasSubmenu && (
                            <ChevronRight className="w-3 h-3 ml-auto" />
                          )}
                        </SidebarMenuButton>
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
