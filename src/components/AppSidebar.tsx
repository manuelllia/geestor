
import React, { useState } from 'react';
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
  MessageCircle
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
}

const AppSidebar: React.FC<AppSidebarProps> = ({ language, activeSection, onSectionChange }) => {
  const { t } = useTranslation(language);
  const { state, toggleSidebar } = useSidebar();
  const [isDepartamentosOpen, setIsDepartamentosOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const isCollapsed = state === 'collapsed';

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
      subItems: [
        { id: 'analisis-coste', title: t('analisisCoste'), icon: Calculator }
      ]
    },
    gestionTecnica: {
      title: t('gestionTecnica'),
      id: 'gestion-tecnica',
      icon: CheckCircle,
      subItems: [
        { id: 'calendario-mantenimiento', title: t('calendarioMantenimiento'), icon: Calendar },
        { id: 'comprobadores', title: t('comprobadores'), icon: CheckCircle }
      ]
    },
    gestionTalento: {
      title: t('gestionTalento'),
      id: 'gestion-talento',
      icon: UserPlus,
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
            { id: 'listado', title: t('listado'), icon: List },
            { id: 'valoracion', title: t('valoracion'), icon: Star }
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
                className={`w-full flex items-center justify-between px-${4 + level * 2} py-2 text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <subItem.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{subItem.title}</span>
                </div>
                <div className="transition-transform duration-200">
                  {openSubmenus.includes(subItem.id) ? (
                    <ChevronDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className={`ml-${2 + level * 2} mt-1 space-y-1 animate-slideDown`}>
              {renderSubItems(subItem.subItems, level + 1)}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleSubItemClick(subItem.id)}
              isActive={activeSection === subItem.id}
              className={`w-full flex items-center gap-3 px-${4 + level * 2} py-2 text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                activeSection === subItem.id 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <subItem.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>{subItem.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </div>
    ));
  };

  return (
    <Sidebar 
      className="border-r border-blue-200 dark:border-blue-800 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-blue-200 dark:border-blue-800 p-4 bg-blue-100 dark:bg-blue-900">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
                alt="GEESTOR Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                GEESTOR
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex h-8 w-8 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300"
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                      activeSection === item.id 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Departamentos */}
              <SidebarMenuItem>
                <Collapsible 
                  open={isDepartamentosOpen} 
                  onOpenChange={setIsDepartamentosOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors text-gray-700 dark:text-gray-300"
                      tooltip={isCollapsed ? t('departamentos') : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
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
                      {/* Operaciones */}
                      <Collapsible 
                        open={openSubmenus.includes('operaciones')} 
                        onOpenChange={() => toggleSubmenu('operaciones')}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <div className="flex items-center gap-3">
                              <departamentosStructure.operaciones.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <span>{departamentosStructure.operaciones.title}</span>
                            </div>
                            <ChevronRight className={`w-3 h-3 text-blue-600 dark:text-blue-400 transition-transform ${openSubmenus.includes('operaciones') ? 'rotate-90' : ''}`} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-4 mt-1 space-y-1">
                          {renderSubItems(departamentosStructure.operaciones.subItems)}
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Gestión Técnica */}
                      <Collapsible 
                        open={openSubmenus.includes('gestion-tecnica')} 
                        onOpenChange={() => toggleSubmenu('gestion-tecnica')}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <div className="flex items-center gap-3">
                              <departamentosStructure.gestionTecnica.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <span>{departamentosStructure.gestionTecnica.title}</span>
                            </div>
                            <ChevronRight className={`w-3 h-3 text-blue-600 dark:text-blue-400 transition-transform ${openSubmenus.includes('gestion-tecnica') ? 'rotate-90' : ''}`} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-4 mt-1 space-y-1">
                          {renderSubItems(departamentosStructure.gestionTecnica.subItems)}
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Gestión del Talento */}
                      <Collapsible 
                        open={openSubmenus.includes('gestion-talento')} 
                        onOpenChange={() => toggleSubmenu('gestion-talento')}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <div className="flex items-center gap-3">
                              <departamentosStructure.gestionTalento.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <span>{departamentosStructure.gestionTalento.title}</span>
                            </div>
                            <ChevronRight className={`w-3 h-3 text-blue-600 dark:text-blue-400 transition-transform ${openSubmenus.includes('gestion-talento') ? 'rotate-90' : ''}`} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-4 mt-1 space-y-1">
                          {renderSubItems(departamentosStructure.gestionTalento.subItems)}
                        </CollapsibleContent>
                      </Collapsible>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
