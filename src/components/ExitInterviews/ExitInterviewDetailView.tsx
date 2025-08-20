
import React, { useState, useEffect } from 'react';
import { getExitInterviewById, ExitInterviewRecord } from '../../services/exitInterviewService';
import DetailPDFView from '../Common/DetailPDFView';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { User, Building, Calendar, FileText, Star, MessageSquare } from 'lucide-react';
import { useWorkCenters } from '../../hooks/useWorkCenters'; 

interface ExitInterviewDetailViewProps {
  language: Language;
  interviewId: string;
  onBack: () => void;
}

const ExitInterviewDetailView: React.FC<ExitInterviewDetailViewProps> = ({ 
  language, 
  interviewId,
  onBack 
}) => {
  const { t } = useTranslation(language);
  const [interviewData, setInterviewData] = useState<ExitInterviewRecord | null>(null);
  const [isLoadingInterview, setIsLoadingInterview] = useState(true);

  const { 
    isLoading: isLoadingWorkCenters, 
    error: workCentersError 
  } = useWorkCenters();

  const isLoading = isLoadingInterview || isLoadingWorkCenters;

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const data = await getExitInterviewById(interviewId);
        setInterviewData(data);
      } catch (error) {
        console.error('Error al obtener datos de la entrevista:', error);
      } finally {
        setIsLoadingInterview(false);
      }
    };

    fetchInterviewData();
  }, [interviewId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!interviewData || workCentersError) {
    return (
      <div className="text-center py-12">
        {workCentersError && <p className="text-red-600 mb-4">Error al cargar centros de trabajo: {workCentersError}</p>}
        {!interviewData && <p className="text-gray-600">Entrevista no encontrada</p>}
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          {t('back')}
        </button>
      </div>
    );
  }

  const sections = [
    {
      title: language === 'es' ? 'Información del Empleado' : 'Employee Information',
      fields: [
        { label: t('name'), value: interviewData.employeeName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: language === 'es' ? 'Apellidos' : 'Last Name', value: interviewData.employeeLastName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('position'), value: interviewData.position, icon: <FileText className="w-4 h-4 text-blue-500" /> },
        { label: t('workCenter'), value: interviewData.workCenter, icon: <Building className="w-4 h-4 text-blue-500" /> },
        { label: language === 'es' ? 'Antigüedad' : 'Seniority', value: interviewData.seniority, icon: <Calendar className="w-4 h-4 text-blue-500" /> }
      ]
    },
    {
      title: language === 'es' ? 'Información del Supervisor' : 'Supervisor Information',
      fields: [
        { label: t('name'), value: interviewData.supervisorName, icon: <User className="w-4 h-4 text-green-500" /> },
        { label: language === 'es' ? 'Apellidos' : 'Last Name', value: interviewData.supervisorLastName, icon: <User className="w-4 h-4 text-green-500" /> }
      ]
    },
    {
      title: language === 'es' ? 'Detalles de la Salida' : 'Exit Details',
      fields: [
        { label: language === 'es' ? 'Tipo de Baja' : 'Exit Type', value: interviewData.exitType, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: language === 'es' ? 'Fecha de Baja' : 'Exit Date', value: interviewData.exitDate, type: 'date' as const, icon: <Calendar className="w-4 h-4 text-orange-500" /> },
        { label: language === 'es' ? 'Razón Principal' : 'Main Reason', value: interviewData.mainExitReason, icon: <MessageSquare className="w-4 h-4 text-orange-500" /> },
        { label: language === 'es' ? 'Razones de Ingreso' : 'Joining Reasons', value: interviewData.joiningReasons, type: 'list' as const, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: language === 'es' ? 'Otros Factores' : 'Other Factors', value: interviewData.otherInfluencingFactors, type: 'list' as const, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: language === 'es' ? 'Comentarios' : 'Comments', value: interviewData.comments, icon: <MessageSquare className="w-4 h-4 text-orange-500" /> }
      ]
    },
    {
      title: language === 'es' ? 'Puntuaciones' : 'Scores',
      fields: [
        { label: language === 'es' ? 'Integración' : 'Integration', value: `${interviewData.scores.integration}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Comunicación Interna' : 'Internal Communication', value: `${interviewData.scores.internalCommunication}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Compensación' : 'Compensation', value: `${interviewData.scores.compensation}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Formación' : 'Training', value: `${interviewData.scores.training}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Horario de Trabajo' : 'Work Schedule', value: `${interviewData.scores.workSchedule}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Mentoring' : 'Mentoring', value: `${interviewData.scores.mentoring}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Trabajo Realizado' : 'Work Performed', value: `${interviewData.scores.workPerformed}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Ambiente de Trabajo' : 'Work Environment', value: `${interviewData.scores.workEnvironment}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Cultura Corporativa' : 'Corporate Culture', value: `${interviewData.scores.corporateCulture}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Relación con Supervisor' : 'Supervisor Relation', value: `${interviewData.scores.supervisorRelation}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: language === 'es' ? 'Evaluación Global' : 'Global Assessment', value: `${interviewData.scores.globalAssessment}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> }
      ]
    }
  ];

  const fileName = `Entrevista_Salida_${interviewData.employeeName}_${interviewData.employeeLastName}_${interviewData.id}`;

  return (
    <DetailPDFView
      language={language}
      title={language === 'es' ? 'Detalle de Entrevista de Salida' : 'Exit Interview Detail'}
      recordId={interviewData.id}
      sections={sections}
      onBack={onBack}
      fileName={fileName}
    />
  );
};

export default ExitInterviewDetailView;
