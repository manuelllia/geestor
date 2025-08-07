
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { 
  Home, 
  FileText, 
  Layers, 
  BarChart2, 
  Users,
  Building2,
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
    setOpenGroup(openGroup === groupId ? null : groupId);
  };

  const menuGroups = [
    {
      id: 'main',
      label: t('businessManagement'),
      items: [
        {
          id: 'inicio',
          label: t('home'),
          icon: Home,
        },
      ]
    },
    {
      id: 'operations',
      label: t('operaciones'),
      items: [
        {
          id: 'analisis-coste',
          label: t('bidAnalyzer'),
          icon: BarChart2,
        },
      ]
    },
    {
      id: 'management',
      label: t('gestionTecnica'),
      items: [
        {
          id: 'hojas-cambio',
          label: t('hojasCambio'),
          icon: FileText,
        },
        {
          id: 'gestion-inmuebles',
          label: t('realEstateManagement'),
          icon: Building2,
        },
      ]
    },
    {
      id: 'talent',
      label: t('gestionTalento'),
      items: [
        {
          id: 'acuerdo-empleado',
          label: t('employeeAgreements'),
          icon: Users,
        },
      ]
    },
  ];

  return (
    <Sidebar className="border-r border-blue-200 dark:border-blue-800">
      <SidebarHeader className="border-b border-blue-200 dark:border-blue-800 p-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div>
              <h2 className="font-semibold text-blue-900 dark:text-blue-100">GEESTOR</h2>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                {t('businessManagement')}
              </p>
            </div>
          </div>
          <SidebarTrigger className="h-6 w-6" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.id}>
            <Collapsible 
              open={openGroup === group.id} 
              onOpenChange={() => handleGroupToggle(group.id)}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="group/label hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
                  <span>{group.label}</span>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/label:rotate-90" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeSection === item.id}
                          onClick={() => onSectionChange(item.id)}
                          className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
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
