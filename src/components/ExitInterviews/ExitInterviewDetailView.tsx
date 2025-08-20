
import React, { useState, useEffect } from 'react';
import { getExitInterviewById, ExitInterviewRecord } from '../../services/exitInterviewService';
import DetailPDFView from '../Common/DetailPDFView';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { User, Building, Calendar, FileText, Star, MessageSquare } from 'lucide-react';

// Importa el hook para manejar el estado de carga y error de los centros de trabajo
// No necesitamos el tipo WorkCenter aquí si solo vamos a usar los estados de carga
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
  const [isLoadingInterview, setIsLoadingInterview] = useState(true); // Renombrado para claridad

  // 1. Usa el hook para cargar los centros de trabajo.
  // Aunque no busquemos el nombre, usamos sus estados de carga y error.
  const { 
    // workCenters, // No se necesita directamente si interviewData.workCenter ya es el nombre
    isLoading: isLoadingWorkCenters, 
    error: workCentersError 
  } = useWorkCenters();

  // Combina los estados de carga de la entrevista y de los centros de trabajo
  const isLoading = isLoadingInterview || isLoadingWorkCenters;

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const data = await getExitInterviewById(interviewId);
        setInterviewData(data);
      } catch (error) {
        console.error('Error al obtener datos de la entrevista:', error);
      } finally {
        setIsLoadingInterview(false); // Usa el nuevo estado
      }
    };

    fetchInterviewData();
  }, [interviewId]);

  // Si interviewData.workCenter ya es el nombre legible,
  // la función getWorkCenterName ya NO es necesaria aquí.
  // La línea con getWorkCenterName ha sido simplificada abajo.


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

  // Maneja errores si la entrevista no se encuentra o si hay un error al cargar centros de trabajo
  if (!interviewData || workCentersError) {
    return (
      <div className="text-center py-12">
        {workCentersError && <p className="text-red-600 mb-4">{t('error')}: {workCentersError}</p>}
        {!interviewData && <p className="text-gray-600">{t('recordNotFound')}</p>}
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          {t('back')}
        </button>
      </div>
    );
  }

  const sections = [
    {
      title: t('employeeInformation'),
      fields: [
        { label: t('name'), value: interviewData.employeeName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('employeeLastName'), value: interviewData.employeeLastName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('position'), value: interviewData.position, icon: <FileText className="w-4 h-4 text-blue-500" /> },
        // Aquí usamos directamente interviewData.workCenter, ya que asumimos que es el nombre legible
        { label: t('workCenter'), value: interviewData.workCenter, icon: <Building className="w-4 h-4 text-blue-500" /> },
        { label: 'Antigüedad', value: interviewData.seniority, icon: <Calendar className="w-4 h-4 text-blue-500" /> }
      ]
    },
    {
      title: 'Información del Supervisor',
      fields: [
        { label: t('name'), value: interviewData.supervisorName, icon: <User className="w-4 h-4 text-green-500" /> },
        { label: t('employeeLastName'), value: interviewData.supervisorLastName, icon: <User className="w-4 h-4 text-green-500" /> }
      ]
    },
    {
      title: 'Detalles de la Salida',
      fields: [
        { label: 'Tipo de Baja', value: interviewData.exitType, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: 'Fecha de Baja', value: interviewData.exitDate, type: 'date' as const, icon: <Calendar className="w-4 h-4 text-orange-500" /> },
        { label: 'Razón Principal', value: interviewData.mainExitReason, icon: <MessageSquare className="w-4 h-4 text-orange-500" /> },
        { label: 'Razones de Ingreso', value: interviewData.joiningReasons, type: 'list' as const, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: 'Otros Factores', value: interviewData.otherInfluencingFactors, type: 'list' as const, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: 'Comentarios', value: interviewData.comments, icon: <MessageSquare className="w-4 h-4 text-orange-500" /> }
      ]
    },
    {
      title: 'Puntuaciones',
      fields: [
        { label: 'Integración', value: `${interviewData.scores.integration}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Comunicación Interna', value: `${interviewData.scores.internalCommunication}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Compensación', value: `${interviewData.scores.compensation}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Formación', value: `${interviewData.scores.training}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Horario de Trabajo', value: `${interviewData.scores.workSchedule}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Mentoring', value: `${interviewData.scores.mentoring}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Trabajo Realizado', value: `${interviewData.scores.workPerformed}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Ambiente de Trabajo', value: `${interviewData.scores.workEnvironment}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Cultura Corporativa', value: `${interviewData.scores.corporateCulture}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Relación con Supervisor', value: `${interviewData.scores.supervisorRelation}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: 'Evaluación Global', value: `${interviewData.scores.globalAssessment}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> }
      ]
    }
  ];

  const fileName = `Entrevista_Salida_${interviewData.employeeName}_${interviewData.employeeLastName}_${interviewData.id}`;

  return (
    <DetailPDFView
      language={language}
      title={t('exitInterviews')}
      recordId={interviewData.id}
      sections={sections}
      onBack={onBack}
      fileName={fileName}
    />
  );
};

export default ExitInterviewDetailView;
