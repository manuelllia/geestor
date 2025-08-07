import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, FileText, Layers, BarChart2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';

interface AppSidebarProps {
  language: Language;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ language, activeSection, onSectionChange }: AppSidebarProps) {
  const { t } = useTranslation(language);

  const menuItems = [
    {
      id: 'inicio',
      label: t('home'),
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'analisis-coste',
      label: t('bidAnalyzer'),
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      id: 'hojas-cambio',
      label: t('hojasCambio'),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'acuerdo-empleado',
      label: t('employeeAgreements'),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'gestion-inmuebles',
      label: t('realEstateManagement'),
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  return (
    <Sidebar className="border-r border-blue-200 dark:border-blue-800">
      <SidebarHeader className="border-b border-blue-200 dark:border-blue-800 p-4">
        {/* Ajustar la altura del header para que coincida con el header principal */}
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
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            active={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
