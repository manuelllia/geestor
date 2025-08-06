
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeftOpen,
  Calculator,
  Calendar,
  CheckCircle,
  Building,
  UserPlus,
  FileText,
  Handshake,
  GraduationCap,
  List,
  Star,
  MessageCircle,
  TrendingUp,
  Wrench,
  ClipboardList,
  Award
} from 'lucide-react';
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
  permissionsKey?: number;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  language, 
  activeSection, 
  onSectionChange,
  permissionsKey 
}) => {
  const { t } = useTranslation(language);
  const { state, toggleSidebar } = useSidebar();
  const [isDepartamentosOpen, setIsDepartamentosOpen] = useState(false);
  const [openDepartment, setOpenDepartment] = useState<string | null>(null);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);
  
  // Hacer visibles todos los departamentos por defecto
  const [userPermissions] = useState({
    departments: {
      operaciones: true,
      gestionTecnica: true,
      gestionTalento: true
    }
  });

  const isCollapsed = state === 'collapsed';

  const toggleDepartment = (departmentId: string) => {
    if (openDepartment === departmentId) {
      setOpenDepartment(null);
    } else {
      setOpenDepartment(departmentId);
      setOpenSubmenus([]);
    }
  };

  const toggleSubmenu = (submenuId: string) => {
    setOpenSubmenus(prev => 
      prev.includes(submenuId) 
        ? prev.filter(id => id !== submenuId)
        : [...prev, submenuId]
    );
  };

  const menuItems = [
    {
      id: 'inicio',
      title: t('inicio'),
      icon: Home,
      onClick: () => onSectionChange('inicio')
    }
  ];

  const departamentosStructure = {
    operaciones: {
      title: t('operaciones'),
      id: 'operaciones',
      icon: Calculator,
      visible: userPermissions.departments.operaciones,
      subItems: [
        { id: 'analisis-coste', title: t('analisisCoste'), icon: TrendingUp }
      ]
    },
    gestionTecnica: {
      title: t('gestionTecnica'),
      id: 'gestion-tecnica',
      icon: CheckCircle,
      visible: userPermissions.departments.gestionTecnica,
      subItems: [
        { id: 'calendario-mantenimiento', title: t('calendarioMantenimiento'), icon: Calendar },
        { id: 'comprobadores', title: t('comprobadores'), icon: Wrench }
      ]
    },
    gestionTalento: {
      title: t('gestionTalento'),
      id: 'gestion-talento',
      icon: UserPlus,
      visible: userPermissions.departments.gestionTalento,
      subItems: [
        { id: 'gestion-inmuebles', title: t('gestionInmuebles'), icon: Building },
        { id: 'solicitudes-contratacion', title: t('solicitudesContratacion'), icon: UserPlus },
        { id: 'hojas-cambio', title: t('hojasCambio'), icon: FileText },
        { id: 'acuerdo-empleado', title: t('acuerdoEmpleado'), icon: Handshake },
        {
          id: 'practicas',
          title: t('practicas'),
          icon: GraduationCap,
          hasSubItems: true,
          subItems: [
            { id: 'practicas-listado', title: t('practicasListado'), icon: ClipboardList },
            { id: 'practicas-valoracion', title: t('practicasValoracion'), icon: Award }
          ]
        },
        { id: 'entrevista-salida', title: t('entrevistaSalida'), icon: MessageCircle }
      ]
    }
  };

  const handleSubItemClick = (subItemId: string) => {
    onSectionChange(subItemId);
  };

  const renderSubItems = (items: any[], level: number = 0) => {
    return items.map((subItem) => (
      <div key={subItem.id}>
        {subItem.hasSubItems ? (
          <Collapsible 
            open={openSubmenus.includes(subItem.id)} 
            onOpenChange={() => toggleSubmenu(subItem.id)}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                  isCollapsed ? 'px-2' : `px-${4 + level * 2}`
                }`}
                tooltip={isCollapsed ? subItem.title : undefined}
              >
                <div className="flex items-center gap-2">
                  <subItem.icon className={`text-blue-600 dark:text-blue-400 flex-shrink-0 ${
                    isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                  }`} />
                  {!isCollapsed && (
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{subItem.title}</span>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="transition-transform duration-200">
                    {openSubmenus.includes(subItem.id) ? (
                      <ChevronDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="ml-6 mt-1 space-y-1 animate-slideDown">
                {renderSubItems(subItem.subItems, level + 1)}
              </CollapsibleContent>
            )}
          </Collapsible>
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleSubItemClick(subItem.id)}
              isActive={activeSection === subItem.id}
              className={`w-full flex items-center gap-2 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                isCollapsed ? 'px-2 justify-center' : `px-${4 + level * 2}`
              } ${
                activeSection === subItem.id 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              tooltip={isCollapsed ? subItem.title : undefined}
            >
              <subItem.icon className={`text-blue-600 dark:text-blue-400 flex-shrink-0 ${
                isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
              }`} />
              {!isCollapsed && <span className="text-sm">{subItem.title}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </div>
    ));
  };

  // Filtrar departamentos visibles basado en permisos
  const visibleDepartments = Object.values(departamentosStructure).filter(dept => dept.visible);

  // Render collapsed department hover menu
  const renderCollapsedDepartmentMenu = (department: any) => {
    if (!isCollapsed || hoveredDepartment !== department.id) return null;

    return (
      <div 
        className="fixed left-14 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg shadow-lg p-2 z-50 min-w-48"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        onMouseEnter={() => setHoveredDepartment(department.id)}
        onMouseLeave={() => setHoveredDepartment(null)}
      >
        <div className="font-medium text-blue-900 dark:text-blue-100 mb-2 px-2">
          {department.title}
        </div>
        <div className="space-y-1">
          {department.subItems.map((subItem: any) => (
            <button
              key={subItem.id}
              onClick={() => handleSubItemClick(subItem.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                activeSection === subItem.id 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <subItem.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>{subItem.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Sidebar 
      className="border-r border-blue-200 dark:border-blue-800 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-blue-200 dark:border-blue-800 h-16 p-4 bg-blue-100 dark:bg-blue-900 flex items-center">
        <div className="flex items-center justify-between w-full">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
                alt="GEESTOR Logo" 
                className="w-6 h-6 object-contain flex-shrink-0"
              />
              <span className="font-semibold text-sm text-blue-900 dark:text-blue-100 truncate">
                GEESTOR
              </span>
            </div>
          )}
          {isCollapsed && (
            <img 
              src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
              alt="GEESTOR Logo" 
              className="w-6 h-6 object-contain mx-auto"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="flex-shrink-0 h-8 w-8 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300"
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
                    className={`w-full flex items-center gap-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                      isCollapsed ? 'px-2 justify-center' : 'px-3'
                    } ${
                      activeSection === item.id 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className={`text-blue-600 dark:text-blue-400 flex-shrink-0 ${
                      isCollapsed ? 'w-5 h-5' : 'w-5 h-5'
                    }`} />
                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Departamentos - Mostrar todos los departamentos visibles */}
              {visibleDepartments.length > 0 && (
                <SidebarMenuItem>
                  <Collapsible 
                    open={isDepartamentosOpen} 
                    onOpenChange={setIsDepartamentosOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`w-full flex items-center justify-between py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors text-gray-700 dark:text-gray-300 ${
                          isCollapsed ? 'px-2' : 'px-3'
                        }`}
                        tooltip={isCollapsed ? t('departamentos') : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className={`text-blue-600 dark:text-blue-400 flex-shrink-0 ${
                            isCollapsed ? 'w-5 h-5' : 'w-5 h-5'
                          }`} />
                          {!isCollapsed && <span className="font-medium">{t('departamentos')}</span>}
                        </div>
                        {!isCollapsed && (
                          <div className="transition-transform duration-200">
                            {isDepartamentosOpen ? (
                              <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    
                    {!isCollapsed && (
                      <CollapsibleContent className="ml-6 mt-2 space-y-2 animate-slideDown">
                        {visibleDepartments.map((department) => (
                          <Collapsible 
                            key={department.id}
                            open={openDepartment === department.id} 
                            onOpenChange={() => toggleDepartment(department.id)}
                          >
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors text-gray-700 dark:text-gray-300"
                              >
                                <div className="flex items-center gap-3">
                                  <department.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                  <span>{department.title}</span>
                                </div>
                                <ChevronRight className={`w-3 h-3 text-blue-600 dark:text-blue-400 transition-transform ${openDepartment === department.id ? 'rotate-90' : ''}`} />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="ml-4 mt-1 space-y-1">
                              {renderSubItems(department.subItems)}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </SidebarMenuItem>
              )}

              {/* Departamentos para modo colapsado con hover */}
              {isCollapsed && visibleDepartments.map((department) => (
                <SidebarMenuItem key={`collapsed-${department.id}`}>
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredDepartment(department.id)}
                    onMouseLeave={() => setHoveredDepartment(null)}
                  >
                    <SidebarMenuButton
                      className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors text-gray-700 dark:text-gray-300 px-2"
                      tooltip={department.title}
                    >
                      <department.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    </SidebarMenuButton>
                    {renderCollapsedDepartmentMenu(department)}
                  </div>
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
