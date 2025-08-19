
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import DetailPDFView from '../Common/DetailPDFView';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { User, Building, Calendar, FileText, DollarSign, Award } from 'lucide-react';

interface EmployeeAgreementData {
  id: string;
  employeeName: string;
  employeeLastName: string;
  position: string;
  department: string;
  agreementType: string;
  startDate: Date | null;
  endDate: Date | null;
  salary: string;
  benefits: string[];
  conditions: string;
  observations: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EmployeeAgreementDetailViewProps {
  language: Language;
  agreementId: string;
  onBack: () => void;
}

const EmployeeAgreementDetailView: React.FC<EmployeeAgreementDetailViewProps> = ({ 
  language, 
  agreementId,
  onBack 
}) => {
  const { t } = useTranslation(language);
  const [agreementData, setAgreementData] = useState<EmployeeAgreementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgreementData = async () => {
      try {
        const docRef = doc(db, "Gestión de Talento", "acuerdos-empleados", "Acuerdos con empleados", agreementId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAgreementData({
            id: docSnap.id,
            ...data,
            startDate: data.startDate?.toDate() || null,
            endDate: data.endDate?.toDate() || null,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as EmployeeAgreementData);
        }
      } catch (error) {
        console.error('Error al obtener datos del acuerdo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgreementData();
  }, [agreementId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (!agreementData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t('recordNotFound')}</p>
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
        { label: t('employeeName'), value: agreementData.employeeName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('employeeLastName'), value: agreementData.employeeLastName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('position'), value: agreementData.position, icon: <FileText className="w-4 h-4 text-blue-500" /> },
        { label: t('department'), value: agreementData.department, icon: <Building className="w-4 h-4 text-blue-500" /> }
      ]
    },
    {
      title: t('agreementDetails'),
      fields: [
        { label: t('agreementType'), value: agreementData.agreementType, icon: <FileText className="w-4 h-4 text-green-500" /> },
        { label: t('startDate'), value: agreementData.startDate, type: 'date' as const, icon: <Calendar className="w-4 h-4 text-green-500" /> },
        { label: t('endDate'), value: agreementData.endDate, type: 'date' as const, icon: <Calendar className="w-4 h-4 text-green-500" /> },
        { label: t('salary'), value: agreementData.salary, type: 'currency' as const, icon: <DollarSign className="w-4 h-4 text-green-500" /> }
      ]
    },
    {
      title: t('benefitsAndConditions'),
      fields: [
        { label: t('benefits'), value: agreementData.benefits, type: 'list' as const, icon: <Award className="w-4 h-4 text-purple-500" /> },
        { label: t('conditions'), value: agreementData.conditions, icon: <FileText className="w-4 h-4 text-purple-500" /> },
        { label: t('observations'), value: agreementData.observations, icon: <FileText className="w-4 h-4 text-purple-500" /> }
      ]
    }
  ];

  const fileName = `Acuerdo_Empleado_${agreementData.employeeName}_${agreementData.employeeLastName}_${agreementData.id}`;

  return (
    <DetailPDFView
      language={language}
      title={t('employeeAgreementDetails')}
      recordId={agreementData.id}
      sections={sections}
      onBack={onBack}
      fileName={fileName}
    />
  );
};

export default EmployeeAgreementDetailView;
