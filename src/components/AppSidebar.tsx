
import React from 'react';
import { Home, Building, Calculator, Wrench, Calendar, CheckSquare, Users, FileText, HandHeart, UserCheck, GraduationCap, MessageCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';
import { NavLink } from 'react-router-dom';
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
}

const AppSidebar: React.FC<AppSidebarProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const menuItems = [
    { 
      id: 'inicio', 
      icon: Home, 
      label: t('inicio'),
      path: '/'
    },
    { 
      id: 'departamentos', 
      icon: Building, 
      label: t('departamentos'),
      path: '/departamentos'
    }
  ];

  const operationsItems = [
    {
      id: 'analisis-coste',
      icon: Calculator,
      label: t('analisisCoste'),
      path: '/analisis-coste'
    }
  ];

  const technicalItems = [
    {
      id: 'calendario-mantenimiento',
      icon: Calendar,
      label: t('calendarioMantenimiento'),
      path: '/calendario-mantenimiento'
    },
    {
      id: 'comprobadores',
      icon: CheckSquare,
      label: t('comprobadores'),
      path: '/comprobadores'
    }
  ];

  const talentItems = [
    {
      id: 'solicitudes-contratacion',
      icon: Users,
      label: t('solicitudesContratacion'),
      path: '/solicitudes-contratacion'
    },
    {
      id: 'hojas-cambio',
      icon: FileText,
      label: t('hojasCambio'),
      path: '/hojas-cambio'
    },
    {
      id: 'acuerdo-empleado',
      icon: HandHeart,
      label: t('acuerdoEmpleado'),
      path: '/acuerdo-empleado'
    },
    {
      id: 'practicas',
      icon: GraduationCap,
      label: t('practicas'),
      path: '/practicas',
      submenu: [
        {
          id: 'practicas-listado',
          label: t('practicasListado'),
          path: '/practicas/listado'
        },
        {
          id: 'practicas-valoracion',
          label: t('practicasValoracion'),
          path: '/practicas/valoracion'
        }
      ]
    },
    {
      id: 'entrevista-salida',
      icon: MessageCircle,
      label: t('entrevistaSalida'),
      path: '/entrevista-salida'
    },
    {
      id: 'gestion-inmuebles',
      icon: Building,
      label: t('gestionInmuebles'),
      path: '/gestion-inmuebles'
    }
  ];

  return (
    <Sidebar className="border-r border-blue-200 dark:border-blue-800">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
            G
          </div>
          {!collapsed && (
            <span className="font-semibold text-blue-800 dark:text-blue-200">
              GEESTOR
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-2 w-full p-2 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            {t('operaciones')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-2 w-full p-2 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            {t('gestionTecnica')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {technicalItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-2 w-full p-2 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            {t('gestionTalento')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {talentItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-2 w-full p-2 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
