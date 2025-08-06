
import React, { useState } from 'react';
import { Home, Building2, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
      subItems: [
        { id: 'analisis-coste', title: t('analisisCoste') }
      ]
    },
    gestionTecnica: {
      title: t('gestionTecnica'),
      id: 'gestion-tecnica',
      subItems: [
        { id: 'calendario-mantenimiento', title: t('calendarioMantenimiento') },
        { id: 'comprobadores', title: t('comprobadores') }
      ]
    },
    gestionTalento: {
      title: t('gestionTalento'),
      id: 'gestion-talento',
      subItems: [
        { id: 'gestion-inmuebles', title: t('gestionInmuebles') },
        { id: 'solicitudes-contratacion', title: t('solicitudesContratacion') },
        { id: 'hojas-cambio', title: t('hojasCambio') },
        { id: 'acuerdo-empleado', title: t('acuerdoEmpleado') },
        {
          id: 'practicas',
          title: t('practicas'),
          hasSubItems: true,
          subItems: [
            { id: 'listado-valoracion', title: t('listadoValoracion') }
          ]
        },
        { id: 'entrevista-salida', title: t('entrevistaSalida') }
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
                className={`w-full flex items-center justify-between px-${4 + level * 2} py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-current rounded-full flex-shrink-0" />
                  <span>{subItem.title}</span>
                </div>
                <div className="transition-transform duration-200">
                  {openSubmenus.includes(subItem.id) ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
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
              className={`w-full flex items-center gap-3 px-${4 + level * 2} py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
            >
              <div className="w-2 h-2 bg-current rounded-full flex-shrink-0" />
              <span>{subItem.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </div>
    ));
  };

  return (
    <Sidebar 
      className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
                alt="GEESTOR Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                GEESTOR
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
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
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      tooltip={isCollapsed ? t('departamentos') : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">{t('departamentos')}</span>}
                      </div>
                      {!isCollapsed && (
                        <div className="transition-transform duration-200">
                          {isDepartamentosOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
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
                            className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-current rounded-full flex-shrink-0" />
                              <span>{departamentosStructure.operaciones.title}</span>
                            </div>
                            <ChevronRight className={`w-3 h-3 transition-transform ${openSubmenus.includes('operaciones') ? 'rotate-90' : ''}`} />
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
                            className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-current rounded-full flex-shrink-0" />
                              <span>{departamentosStructure.gestionTecnica.title}</span>
                            </div>
                            <ChevronRight className={`w-3 h-3 transition-transform ${openSubmenus.includes('gestion-tecnica') ? 'rotate-90' : ''}`} />
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
                            className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-current rounded-full flex-shrink-0" />
                              <span>{departamentosStructure.gestionTalento.title}</span>
                            </div>
                            <ChevronRight className={`w-3 h-3 transition-transform ${openSubmenus.includes('gestion-talento') ? 'rotate-90' : ''}`} />
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
