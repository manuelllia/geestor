
import React, { useState } from 'react';
import { Home, Calculator, Wrench, Calendar, CheckSquare, Users, FileText, HandHeart, UserCheck, GraduationCap, MessageCircle, ChevronDown, ChevronRight, Building, Menu, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';
import { Button } from './ui/button';

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
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{[key: string]: boolean}>({
    'gestion-talento': true,
    'operaciones': true,
    'gestion-tecnica': true
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    { 
      id: 'inicio', 
      icon: Home, 
      label: t('inicio')
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
    // Cerrar sidebar en móvil después de seleccionar
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const renderMenuItem = (item: any, level = 0) => (
    <li key={item.id} className="mb-1">
      <div 
        onClick={() => {
          if (item.submenu) {
            toggleMenu(item.id);
          } else {
            handleItemClick(item.id);
          }
        }}
        className={`
          flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 cursor-pointer
          ${level === 0 ? 'mb-1' : 'mb-0.5 ml-4'}
          ${activeSection === item.id 
            ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-sm dark:from-blue-900/50 dark:to-blue-800/30 dark:text-blue-200' 
            : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
          }
        `}
      >
        <div className="flex items-center gap-3 min-w-0">
          <item.icon className={`w-5 h-5 flex-shrink-0 ${
            activeSection === item.id ? 'text-blue-600 dark:text-blue-300' : 'text-blue-500 dark:text-blue-400'
          }`} />
          <span className="text-sm font-medium truncate">{item.label}</span>
        </div>
        
        {item.submenu && (
          <div className="flex-shrink-0 ml-2">
            {expandedMenus[item.id] ? (
              <ChevronDown className="w-4 h-4 text-blue-500 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-blue-500 transition-transform duration-200" />
            )}
          </div>
        )}
      </div>
      
      {item.submenu && expandedMenus[item.id] && (
        <ul className="ml-8 mt-1 space-y-1 animate-accordion-down">
          {item.submenu.map((subItem: any) => (
            <li key={subItem.id}>
              <div
                onClick={() => handleItemClick(subItem.id)}
                className={`
                  flex items-center gap-3 w-full p-2 pl-4 rounded-md transition-all duration-200 cursor-pointer
                  ${activeSection === subItem.id 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300'
                  }
                `}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-sm truncate">{subItem.label}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  const renderMenuGroup = (title: string, items: any[], groupId: string) => (
    <div className="mb-6">
      <div className="px-3 mb-3">
        <div 
          onClick={() => toggleMenu(groupId)}
          className="flex items-center justify-between cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-md transition-colors duration-200"
        >
          <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {title}
          </h3>
          {expandedMenus[groupId] ? (
            <ChevronDown className="w-4 h-4 text-blue-500 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-4 h-4 text-blue-500 transition-transform duration-200" />
          )}
        </div>
        <div className="mt-1 h-px bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-700"></div>
      </div>
      {expandedMenus[groupId] && (
        <ul className="space-y-1 px-3 animate-accordion-down">
          {items.map(item => renderMenuItem(item))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      {/* Toggle Button - Siempre visible */}
      <Button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        size="icon"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-blue-200 dark:border-blue-800 z-50 
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:z-auto md:w-80
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-blue-800 dark:text-blue-200 text-lg">
                GEESTOR
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Gestión Empresarial
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto pb-20">
          {/* Menú Principal */}
          <div className="mb-6">
            <ul className="space-y-1">
              {menuItems.map(item => renderMenuItem(item))}
            </ul>
          </div>

          {/* Operaciones */}
          {renderMenuGroup(t('operaciones'), operationsItems, 'operaciones')}

          {/* Gestión Técnica */}
          {renderMenuGroup(t('gestionTecnica'), technicalItems, 'gestion-tecnica')}

          {/* Gestión de Talento */}
          {renderMenuGroup(t('gestionTalento'), talentItems, 'gestion-talento')}
        </div>
      </aside>

      {/* Spacer para desktop */}
      <div className="hidden md:block w-80 flex-shrink-0" />
    </>
  );
};

export default AppSidebar;
