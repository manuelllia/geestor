import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Calendar, FileText, BarChart2, CheckSquare, UserCheck, MessageSquare, ClipboardCheck } from 'lucide-react';
import { Language } from '../utils/translations';

// Component imports
import CostAnalysisView from './CostAnalysis/CostAnalysisView';
import MaintenanceCalendarView from './MaintenanceCalendar/MaintenanceCalendarView';
import ContractRequestsListView from './ContractRequests/ContractRequestsListView';
import ChangeSheetsListView from './ChangeSheets/ChangeSheetsListView';
import EmployeeAgreementsListView from './EmployeeAgreements/EmployeeAgreementsListView';
import RealEstateDashboard from './RealEstate/RealEstateDashboard';
import ExitInterviewsListView from './ExitInterviews/ExitInterviewsListView';
import PracticeEvaluationsListView from './PracticeEvaluations/PracticeEvaluationsListView';

interface MainContentProps {
  activeSection: string;
  language: Language;
}

export default function MainContent({ activeSection, language }: MainContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return <DashboardContent />;
      case 'analisis-coste':
        return <CostAnalysisView language={language} />;
      case 'calendario-mantenimiento':
        return <MaintenanceCalendarView language={language} />;
      case 'comprobadores':
        return <ComingSoonContent title="Comprobadores" icon={CheckSquare} />;
      case 'solicitudes-contratacion':
        return <ContractRequestsListView language={language} />;
      case 'hojas-cambio':
        return <ChangeSheetsListView 
          language={language} 
          onViewDetails={() => {}} 
          onCreateNew={() => {}} 
        />;
      case 'acuerdo-empleado':
        return <EmployeeAgreementsListView 
          language={language} 
          onViewDetails={() => {}} 
          onCreateNew={() => {}} 
        />;
      case 'gestion-inmuebles':
        return <RealEstateDashboard 
          language={language} 
          onImportData={() => {}} 
          onViewTables={() => {}} 
        />;
      case 'valoracion-practicas':
        return <PracticeEvaluationsListView />;
      case 'entrevista-salida':
        return <ExitInterviewsListView language={language} />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
      {renderContent()}
    </div>
  );
}

function DashboardContent() {
  const modules = [
    {
      title: 'Análisis de Coste',
      description: 'Analiza costos y calcula puntajes económicos para licitaciones',
      icon: BarChart2,
      status: 'active',
      category: 'Operaciones'
    },
    {
      title: 'Calendario de Mantenimiento',
      description: 'Gestión del calendario de mantenimiento preventivo y correctivo',
      icon: Calendar,
      status: 'active',
      category: 'Gestión Técnica'
    },
    {
      title: 'Solicitudes de Contratación',
      description: 'Gestión de solicitudes de contratación de personal',
      icon: Users,
      status: 'active',
      category: 'Gestión de Talento'
    },
    {
      title: 'Hojas de Cambio',
      description: 'Gestión de cambios organizacionales y de personal',
      icon: FileText,
      status: 'active',
      category: 'Gestión de Talento'
    },
    {
      title: 'Acuerdo con Empleados',
      description: 'Gestión de acuerdos y compromisos con empleados',
      icon: UserCheck,
      status: 'active',
      category: 'Gestión de Talento'
    },
    {
      title: 'Gestión de Inmuebles',
      description: 'Administración y seguimiento de propiedades inmobiliarias',
      icon: Building2,
      status: 'active',
      category: 'Gestión de Talento'
    },
    {
      title: 'Valoración de Prácticas',
      description: 'Evaluación del desempeño de estudiantes en prácticas',
      icon: ClipboardCheck,
      status: 'active',
      category: 'Gestión de Talento'
    },
    {
      title: 'Entrevista de Salida',
      description: 'Gestión de entrevistas de salida de empleados',
      icon: MessageSquare,
      status: 'active',
      category: 'Gestión de Talento'
    },
    {
      title: 'Comprobadores',
      description: 'Gestión de dispositivos de comprobación y calibración',
      icon: CheckSquare,
      status: 'coming-soon',
      category: 'Gestión Técnica'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Activo</Badge>;
      case 'coming-soon':
        return <Badge variant="outline" className="border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400">Próximamente</Badge>;
      default:
        return null;
    }
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof modules>);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-300 mb-4">
          GEESTOR
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Sistema integral de gestión empresarial para el Grupo Empresarial Electromédico
        </p>
      </div>

      {Object.entries(groupedModules).map(([category, categoryModules]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-300 border-b border-blue-200 dark:border-blue-800 pb-2">
            {category}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryModules.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-blue-100 dark:border-blue-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <module.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    {getStatusBadge(module.status)}
                  </div>
                  <CardTitle className="text-lg text-blue-600 dark:text-blue-300">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ComingSoonContent({ title, icon: Icon }: { title: string; icon: React.ComponentType<any> }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Icon className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
          <CardTitle className="text-blue-600 dark:text-blue-300">{title}</CardTitle>
          <CardDescription>
            Esta funcionalidad estará disponible próximamente
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
