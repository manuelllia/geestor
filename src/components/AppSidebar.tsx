
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  SidebarFooter,
} from './ui/sidebar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Settings,
  User,
  Calendar,
  FileText,
  BarChart3,
  Users,
  Building2,
  Calculator,
  DollarSign,
  UserCheck,
  MessageSquare,
  Star,
  Home,
  ClipboardList,
  Wrench,
  TrendingUp,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ComponentType<any>;
  badge?: string;
  children?: MenuItem[];
}

interface AppSidebarProps {
  language: 'es' | 'en';
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems: MenuItem[] = [
  {
    title: 'Inicio',
    url: '/',
    icon: Home,
  },
  {
    title: 'Gestión Técnica',
    icon: Wrench,
    children: [
      {
        title: 'Calendario de Mantenimientos',
        url: '/maintenance-calendar',
        icon: Calendar,
      },
    ],
  },
  {
    title: 'Operaciones',
    icon: TrendingUp,
    children: [
      {
        title: 'Análisis de Licitaciones',
        url: '/bid-analyzer',
        icon: BarChart3,
      },
      {
        title: 'Análisis de Costes',
        url: '/cost-analysis',
        icon: DollarSign,
      },
    ],
  },
  {
    title: 'Inmobiliaria',
    icon: Building2,
    children: [
      {
        title: 'Dashboard Inmobiliario',
        url: '/real-estate',
        icon: Building2,
      },
    ],
  },
  {
    title: 'RRHH',
    icon: Users,
    children: [
      {
        title: 'Acuerdos de Empleados',
        url: '/employee-agreements',
        icon: FileText,
      },
      {
        title: 'Entrevistas de Salida',
        url: '/exit-interviews',
        icon: MessageSquare,
      },
      {
        title: 'Evaluaciones de Prácticas',
        url: '/practice-evaluations',
        icon: Star,
      },
    ],
  },
  {
    title: 'Solicitudes de Contratos',
    url: '/contract-requests',
    icon: ClipboardList,
  },
  {
    title: 'Hojas de Cambio',
    url: '/change-sheets',
    icon: FileText,
  },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ language, activeSection, onSectionChange }) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Gestión Técnica', 'Operaciones']);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupTitle)
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const isGroupExpanded = (groupTitle: string) => expandedGroups.includes(groupTitle);

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    if (item.children) {
      const hasActiveChild = item.children.some(child => child.url && isActive(child.url));
      const isExpanded = isGroupExpanded(item.title);

      return (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel>
            <Button
              variant="ghost"
              onClick={() => toggleGroup(item.title)}
              className={`w-full justify-between h-auto p-2 ${hasActiveChild ? 'bg-blue-50 dark:bg-blue-900/20' : ''} text-xs sm:text-sm md:text-base`}
            >
              <div className="flex items-center gap-2">
                <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-medium">{item.title}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </SidebarGroupLabel>
          {isExpanded && (
            <SidebarGroupContent>
              <SidebarMenu>
                {item.children.map(child => renderMenuItem(child, true))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      );
    }

    if (item.url) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink
              to={item.url}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-xs sm:text-sm ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${isChild ? 'ml-4 text-xs' : ''}`
              }
            >
              <item.icon className={`${isChild ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              <span className="text-xs sm:text-sm">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    return null;
  };

  return (
    <Sidebar className="w-64 min-w-64 border-r bg-white dark:bg-gray-900">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">GEE</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
              Grupo Empresarial
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Electromédico
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map(item => renderMenuItem(item))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Configuración
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Perfil
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
