import React, { useState, useEffect } from 'react';
import { getExitInterviewById, ExitInterviewRecord } from '../../services/exitInterviewService';
import DetailPDFView from '../Common/DetailPDFView';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { User, Building, Calendar, FileText, Star, MessageSquare } from 'lucide-react';

// Importa solo el hook, ya no necesitamos el tipo WorkCenter directamente aquí
// porque no buscaremos por ID, solo usaremos los estados de carga/error.
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
  // Mantenemos la llamada a useWorkCenters principalmente para sincronizar
  // el estado de carga y manejar posibles errores al obtener *todos* los centros,
  // incluso si el valor específico ya está en interviewData.workCenter.
  const { 
    // workCenters, // Ya no necesitamos acceder a la lista directamente aquí
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

  // Si interviewData.workCenter ya es la cadena legible (ej. "01038 - AGS SUR DE SEVILLA"),
  // NO necesitamos la función 'getWorkCenterName'.
  // El valor se usará directamente.


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Maneja errores si la entrevista no se encuentra o si hay un error al cargar centros de trabajo
  if (!interviewData || workCentersError) {
    return (
      <div className="text-center py-12">
        {workCentersError && <p className="text-red-600 mb-4">{t('errors.work_centers_loading_failed', { error: workCentersError })}</p>}
        {!interviewData && <p className="text-gray-600">{t('interview.not_found')}</p>}
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          {t('common.back')}
        </button>
      </div>
    );
  }

  const sections = [
    {
      title: t('employee_info.title'),
      fields: [
        { label: t('employee_info.name'), value: interviewData.employeeName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('employee_info.last_name'), value: interviewData.employeeLastName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('employee_info.position'), value: interviewData.position, icon: <FileText className="w-4 h-4 text-blue-500" /> },
        // Aquí usamos directamente interviewData.workCenter, ya que ahora asumimos que ya contiene el nombre completo
        { label: t('employee_info.work_center'), value: interviewData.workCenter, icon: <Building className="w-4 h-4 text-blue-500" /> },
        { label: t('employee_info.seniority'), value: interviewData.seniority, icon: <Calendar className="w-4 h-4 text-blue-500" /> }
      ]
    },
    {
      title: t('supervisor_info.title'),
      fields: [
        { label: t('supervisor_info.name'), value: interviewData.supervisorName, icon: <User className="w-4 h-4 text-green-500" /> },
        { label: t('supervisor_info.last_name'), value: interviewData.supervisorLastName, icon: <User className="w-4 h-4 text-green-500" /> }
      ]
    },
    {
      title: t('exit_details.title'),
      fields: [
        { label: t('exit_details.exit_type'), value: interviewData.exitType, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: t('exit_details.exit_date'), value: interviewData.exitDate, type: 'date' as const, icon: <Calendar className="w-4 h-4 text-orange-500" /> },
        { label: t('exit_details.main_reason'), value: interviewData.mainExitReason, icon: <MessageSquare className="w-4 h-4 text-orange-500" /> },
        { label: t('exit_details.joining_reasons'), value: interviewData.joiningReasons, type: 'list' as const, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: t('exit_details.other_factors'), value: interviewData.otherInfluencingFactors, type: 'list' as const, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: t('exit_details.comments'), value: interviewData.comments, icon: <MessageSquare className="w-4 h-4 text-orange-500" /> }
      ]
    },
    {
      title: t('scores.title'),
      fields: [
        { label: t('scores.integration'), value: `${interviewData.scores.integration}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.internal_communication'), value: `${interviewData.scores.internalCommunication}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.compensation'), value: `${interviewData.scores.compensation}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.training'), value: `${interviewData.scores.training}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.work_schedule'), value: `${interviewData.scores.workSchedule}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.mentoring'), value: `${interviewData.scores.mentoring}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.work_performed'), value: `${interviewData.scores.workPerformed}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.work_environment'), value: `${interviewData.scores.workEnvironment}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.corporate_culture'), value: `${interviewData.scores.corporateCulture}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.supervisor_relation'), value: `${interviewData.scores.supervisorRelation}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scores.global_assessment'), value: `${interviewData.scores.globalAssessment}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> }
      ]
    }
  ];

  const fileName = `Entrevista_Salida_${interviewData.employeeName}_${interviewData.employeeLastName}_${interviewData.id}`;

  return (
    <DetailPDFView
      language={language}
      title={t('interview_detail.title')}
      recordId={interviewData.id}
      sections={sections}
      onBack={onBack}
      fileName={fileName}
    />
  );
};

export default ExitInterviewDetailView;