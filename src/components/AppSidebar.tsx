
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
  useSidebar,
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
  Building2,
  ClipboardCheck
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useUserPermissions } from '../hooks/useUserPermissions';
import { Language } from '../utils/translations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '../hooks/use-mobile';

interface AppSidebarProps {
  language: Language;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ language, activeSection, onSectionChange }: AppSidebarProps) {
  const { t } = useTranslation(language);
  const { setOpenMobile, state } = useSidebar();
  const { permissions, isLoading } = useUserPermissions();
  const isMobile = useIsMobile();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  
  const isCollapsed = state === 'collapsed';

  const handleGroupToggle = (groupId: string) => {
    setOpenGroup(openGroup === groupId ? null : groupId);
  };

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    // Auto-close sidebar on mobile when a section is selected
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Si los permisos están cargando, mostrar skeleton
  if (isLoading) {
    return (
      <Sidebar 
        className="border-r border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900"
        collapsible="icon"
      >
        <SidebarHeader className="border-b border-blue-200 dark:border-blue-800 p-2 sm:p-4 h-14 sm:h-16">
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-1 sm:p-2">
          <div className="space-y-1 sm:space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  const menuGroups = [
    {
      id: 'operaciones',
      label: t('operations'),
      visible: permissions?.Per_Ope ?? true,
      items: [
        {
          id: 'analisis-coste',
          label: t('costAnalysis'),
          shortLabel: t('costAnalysisShort'),
          icon: BarChart2,
        },
      ]
    },
    {
      id: 'gestion-tecnica',
      label: t('technicalManagement'),
      shortLabel: t('technicalManagementShort'),
      visible: permissions?.Per_GT ?? true,
      items: [
        {
          id: 'calendario-mantenimiento',
          label: t('calendarManagement'),
          shortLabel: t('calendarManagementShort'),
          icon: Calendar,
        },
        {
          id: 'comprobadores',
          label: t('checkers'),
          shortLabel: t('checkers'),
          icon: CheckSquare,
        },
      ]
    },
    {
      id: 'gestion-talento',
      label: t('talentManagement'),
      shortLabel: t('talentManagementShort'),
      visible: permissions?.Per_GDT ?? true,
      items: [
        {
          id: 'solicitudes-contratacion',
          label: t('contractRequests'),
          shortLabel: t('contractRequests'),
          icon: Users,
        },
        {
          id: 'hojas-cambio',
          label: t('changeSheets'),
          shortLabel: t('changeSheets'),
          icon: FileText,
        },
        {
          id: 'acuerdo-empleado',
          label: t('employeeAgreements'),
          shortLabel: t('employeeAgreements'),
          icon: UserCheck,
        },
        {
          id: 'gestion-inmuebles',
          label: t('realEstateManagement'),
          shortLabel: t('realEstateManagement'),
          icon: Building2,
        },
        {
          id: 'valoracion-practicas',
          label: t('practiceEvaluation'),
          shortLabel: t('practiceEvaluation'),
          icon: ClipboardCheck,
        },
        {
          id: 'entrevista-salida',
          label: t('exitInterviews'),
          shortLabel: t('exitInterviews'),
          icon: MessageSquare,
        },
      ]
    },
  ].filter(group => group.visible);

  // Get all visible items for collapsed view
  const allItems = [
    { id: 'inicio', label: 'Inicio', shortLabel: 'Inicio', icon: Home },
    // Solo mostrar usuarios si tiene permisos
    ...(permissions?.Per_User ? [{ id: 'usuarios', label: t('users'), shortLabel: t('users'), icon: Users }] : []),
    ...menuGroups.flatMap(group => group.items)
  ];

  return (
    <Sidebar 
      className="border-r border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-blue-200 dark:border-blue-800 p-2 sm:p-4 h-14 sm:h-16">
        <div className="flex items-center justify-center h-full">
          {isCollapsed ? (
            <img 
              src="/lovable-uploads/1e2990fc-768b-4645-bfc4-725186d26e5b.png" 
              alt="GEE Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
          ) : (
            <img 
              src="/lovable-uploads/f7fd6e9d-43a7-47ba-815e-fdaa1b630f6b.png" 
              alt="GEESTOR Logo" 
              className="h-8 sm:h-10 w-auto object-contain max-w-full"
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-1 sm:p-2">
        {isCollapsed ? (
          // Collapsed view - show all icons vertically centered
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 sm:space-y-2">
                {allItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => handleSectionChange(item.id)}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 p-1.5 sm:p-2 w-full flex items-center justify-center"
                      tooltip={item.label}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          // Expanded view - show grouped structure
          <>
            {/* Inicio - Item individual */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'inicio'}
                      onClick={() => handleSectionChange('inicio')}
                      className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 mb-1 sm:mb-2 text-sm sm:text-base p-2 sm:p-3"
                    >
                      <Home className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="ml-2 truncate">Inicio</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Usuarios - Item individual - Solo si tiene permisos */}
            {permissions?.Per_User && (
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeSection === 'usuarios'}
                        onClick={() => handleSectionChange('usuarios')}
                        className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 mb-1 sm:mb-2 text-sm sm:text-base p-2 sm:p-3"
                      >
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="ml-2 truncate">Usuarios</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Grupos desplegables - solo mostrar los permitidos */}
            {menuGroups.map((group) => (
              <SidebarGroup key={group.id} className="mb-1 sm:mb-2">
                <Collapsible 
                  open={openGroup === group.id} 
                  onOpenChange={() => handleGroupToggle(group.id)}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="group/label hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-blue-600 dark:text-blue-300 font-semibold text-xs sm:text-sm uppercase tracking-wide p-1.5 sm:p-2 rounded-md flex items-center justify-between">
                      <span className="truncate pr-1">
                        <span className="hidden sm:inline">{group.label}</span>
                        <span className="sm:hidden">{group.shortLabel || group.label}</span>
                      </span>
                      <span className="flex-shrink-0">
                        {openGroup === group.id ? (
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 transition-transform" />
                        ) : (
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform" />
                        )}
                      </span>
                    </SidebarGroupLabel>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="ml-1 sm:ml-2">
                        {group.items.map((item) => (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                              isActive={activeSection === item.id}
                              onClick={() => handleSectionChange(item.id)}
                              className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-800 text-gray-700 dark:text-gray-300 py-1.5 sm:py-2 text-xs sm:text-sm"
                            >
                              <item.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="ml-2 truncate">
                                <span className="hidden sm:inline">{item.label}</span>
                                <span className="sm:hidden">{item.shortLabel || item.label}</span>
                              </span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>
            ))}
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
