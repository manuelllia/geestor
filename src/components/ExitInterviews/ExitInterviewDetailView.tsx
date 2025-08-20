
import React, { useState, useEffect } from 'react';
import { getExitInterviewById, ExitInterviewRecord } from '../../services/exitInterviewService';
import DetailPDFView from '../Common/DetailPDFView';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { User, Building, Calendar, FileText, Star, MessageSquare } from 'lucide-react';

// Importa el hook y el tipo WorkCenter
import { useWorkCenters, WorkCenter } from '../../hooks/useWorkCenters'; 

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

  // Usa el hook para cargar los centros de trabajo
  const { 
    workCenters, 
    isLoading: isLoadingWorkCenters, 
    error: workCentersError 
  } = useWorkCenters();

  // Combina los estados de carga
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

  // Función auxiliar para obtener el nombre del centro de trabajo por su ID
  const getWorkCenterName = (workCenterId: string | undefined): string => {
    if (!workCenterId) return t('notAvailable');
    const center = workCenters.find(wc => wc.id === workCenterId);
    return center ? center.displayText : t('unknownWorkCenter');
  };

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
        {workCentersError && <p className="text-red-600 mb-4">{t('workCentersLoadingFailed')}</p>}
        {!interviewData && <p className="text-gray-600">{t('interviewNotFound')}</p>}
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          {t('back')}
        </button>
      </div>
    );
  }

  const sections = [
    {
      title: t('employeeInfoTitle'),
      fields: [
        { label: t('employeeInfoName'), value: interviewData.employeeName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('employeeInfoLastName'), value: interviewData.employeeLastName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('employeeInfoPosition'), value: interviewData.position, icon: <FileText className="w-4 h-4 text-blue-500" /> },
        { label: t('employeeInfoWorkCenter'), value: getWorkCenterName(interviewData.workCenter), icon: <Building className="w-4 h-4 text-blue-500" /> },
        { label: t('employeeInfoSeniority'), value: interviewData.seniority, icon: <Calendar className="w-4 h-4 text-blue-500" /> }
      ]
    },
    {
      title: t('supervisorInfoTitle'),
      fields: [
        { label: t('supervisorInfoName'), value: interviewData.supervisorName, icon: <User className="w-4 h-4 text-green-500" /> },
        { label: t('supervisorInfoLastName'), value: interviewData.supervisorLastName, icon: <User className="w-4 h-4 text-green-500" /> }
      ]
    },
    {
      title: t('exitDetailsTitle'),
      fields: [
        { label: t('exitDetailsExitType'), value: interviewData.exitType, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: t('exitDetailsExitDate'), value: interviewData.exitDate, type: 'date' as const, icon: <Calendar className="w-4 h-4 text-orange-500" /> },
        { label: t('exitDetailsMainReason'), value: interviewData.mainExitReason, icon: <MessageSquare className="w-4 h-4 text-orange-500" /> },
        { label: t('exitDetailsJoiningReasons'), value: interviewData.joiningReasons, type: 'list' as const, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: t('exitDetailsOtherFactors'), value: interviewData.otherInfluencingFactors, type: 'list' as const, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: t('exitDetailsComments'), value: interviewData.comments, icon: <MessageSquare className="w-4 h-4 text-orange-500" /> }
      ]
    },
    {
      title: t('scoresTitle'),
      fields: [
        { label: t('scoresIntegration'), value: `${interviewData.scores.integration}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresInternalCommunication'), value: `${interviewData.scores.internalCommunication}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresCompensation'), value: `${interviewData.scores.compensation}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresTraining'), value: `${interviewData.scores.training}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresWorkSchedule'), value: `${interviewData.scores.workSchedule}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresMentoring'), value: `${interviewData.scores.mentoring}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresWorkPerformed'), value: `${interviewData.scores.workPerformed}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresWorkEnvironment'), value: `${interviewData.scores.workEnvironment}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresCorporateCulture'), value: `${interviewData.scores.corporateCulture}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresSupervisorRelation'), value: `${interviewData.scores.supervisorRelation}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> },
        { label: t('scoresGlobalAssessment'), value: `${interviewData.scores.globalAssessment}/10`, icon: <Star className="w-4 h-4 text-purple-500" /> }
      ]
    }
  ];

  const fileName = `Entrevista_Salida_${interviewData.employeeName}_${interviewData.employeeLastName}_${interviewData.id}`;

  return (
    <DetailPDFView
      language={language}
      title={t('interviewDetailTitle')}
      recordId={interviewData.id}
      sections={sections}
      onBack={onBack}
      fileName={fileName}
    />
  );
};

export default ExitInterviewDetailView;
