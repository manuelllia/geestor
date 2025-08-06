
import React from 'react';
import { Home, Building, Calculator, Wrench, Calendar, CheckSquare, Users, FileText, HandHeart, UserCheck, GraduationCap, MessageCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  language: Language;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  language, 
  activeSection, 
  onSectionChange 
}) => {
  const { t } = useTranslation(language);
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const menuItems = [
    { 
      id: 'inicio', 
      icon: Home, 
      label: t('inicio')
    },
    { 
      id: 'departamentos', 
      icon: Building, 
      label: t('departamentos')
    }
  ];

  const operationsItems = [
    {
      id: 'analisis-coste',
      icon: Calculator,
      label: t('analisisCoste')
    }
  ];

  const technicalItems = [
    {
      id: 'calendario-mantenimiento',
      icon: Calendar,
      label: t('calendarioMantenimiento')
    },
    {
      id: 'comprobadores',
      icon: CheckSquare,
      label: t('comprobadores')
    }
  ];

  const talentItems = [
    {
      id: 'solicitudes-contratacion',
      icon: Users,
      label: t('solicitudesContratacion')
    },
    {
      id: 'hojas-cambio',
      icon: FileText,
      label: t('hojasCambio')
    },
    {
      id: 'acuerdo-empleado',
      icon: HandHeart,
      label: t('acuerdoEmpleado')
    },
    {
      id: 'practicas',
      icon: GraduationCap,
      label: t('practicas'),
      submenu: [
        {
          id: 'practicas-listado',
          label: t('practicasListado')
        },
        {
          id: 'practicas-valoracion',
          label: t('practicasValoracion')
        }
      ]
    },
    {
      id: 'entrevista-salida',
      icon: MessageCircle,
      label: t('entrevistaSalida')
    },
    {
      id: 'gestion-inmuebles',
      icon: Building,
      label: t('gestionInmuebles')
    }
  ];

  const handleItemClick = (id: string) => {
    onSectionChange(id);
  };

  const renderMenuItem = (item: any) => (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton 
        onClick={() => handleItemClick(item.id)}
        className={`
          flex items-center gap-3 w-full p-3 rounded-lg transition-colors cursor-pointer
          ${activeSection === item.id 
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }
        `}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className="border-r border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900">
      <SidebarHeader className="p-4 border-b border-blue-100 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
            G
          </div>
          {!collapsed && (
            <span className="font-semibold text-blue-800 dark:text-blue-200 text-lg">
              GEESTOR
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={`text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ${collapsed ? 'sr-only' : ''}`}>
            {t('operaciones')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {operationsItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={`text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ${collapsed ? 'sr-only' : ''}`}>
            {t('gestionTecnica')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {technicalItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={`text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ${collapsed ? 'sr-only' : ''}`}>
            {t('gestionTalento')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {talentItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
