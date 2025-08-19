
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ChangeSheetRecord } from '../../services/changeSheetsService';
import DetailPDFView from '../Common/DetailPDFView';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { User, Building, Calendar, FileText, Users, MapPin } from 'lucide-react';

interface ChangeSheetDetailViewProps {
  language: Language;
  sheetId: string;
  onBack: () => void;
}

const ChangeSheetDetailView: React.FC<ChangeSheetDetailViewProps> = ({ 
  language, 
  sheetId,
  onBack 
}) => {
  const { t } = useTranslation(language);
  const [sheetData, setSheetData] = useState<ChangeSheetRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const docRef = doc(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio", sheetId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSheetData({
            id: docSnap.id,
            ...data,
            startDate: data.startDate?.toDate() || undefined,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as ChangeSheetRecord);
        }
      } catch (error) {
        console.error('Error al obtener datos de la hoja de cambio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheetData();
  }, [sheetId]);

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

  if (!sheetData) {
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
        { label: t('employeeName'), value: sheetData.employeeName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('employeeLastName'), value: sheetData.employeeLastName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: t('originCenter'), value: sheetData.originCenter, icon: <Building className="w-4 h-4 text-blue-500" /> },
        { label: t('currentPosition'), value: sheetData.currentPosition, icon: <FileText className="w-4 h-4 text-blue-500" /> }
      ]
    },
    {
      title: t('currentSupervisor'),
      fields: [
        { label: t('supervisorName'), value: sheetData.currentSupervisorName, icon: <Users className="w-4 h-4 text-green-500" /> },
        { label: t('supervisorLastName'), value: sheetData.currentSupervisorLastName, icon: <Users className="w-4 h-4 text-green-500" /> }
      ]
    },
    {
      title: t('newPositionInfo'),
      fields: [
        { label: t('newPosition'), value: sheetData.newPosition, icon: <FileText className="w-4 h-4 text-purple-500" /> },
        { label: t('newSupervisorName'), value: sheetData.newSupervisorName, icon: <Users className="w-4 h-4 text-purple-500" /> },
        { label: t('newSupervisorLastName'), value: sheetData.newSupervisorLastName, icon: <Users className="w-4 h-4 text-purple-500" /> },
        { label: t('startDate'), value: sheetData.startDate, type: 'date', icon: <Calendar className="w-4 h-4 text-purple-500" /> }
      ]
    },
    {
      title: t('changeDetails'),
      fields: [
        { label: t('changeType'), value: sheetData.changeType === 'permanent' ? t('permanent') : t('temporary'), icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: t('needs'), value: sheetData.needs, type: 'list', icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: t('currentCompany'), value: sheetData.currentCompany, icon: <Building className="w-4 h-4 text-orange-500" /> },
        { label: t('companyChange'), value: sheetData.companyChange === 'yes' ? t('yes') : t('no'), icon: <Building className="w-4 h-4 text-orange-500" /> },
        { label: t('observations'), value: sheetData.observations, icon: <FileText className="w-4 h-4 text-orange-500" /> },
        { label: t('status'), value: sheetData.status, icon: <FileText className="w-4 h-4 text-orange-500" /> }
      ]
    }
  ];

  const fileName = `Hoja_Cambio_${sheetData.employeeName}_${sheetData.employeeLastName}_${sheetData.id}`;

  return (
    <DetailPDFView
      language={language}
      title={t('changeSheetDetails')}
      recordId={sheetData.id}
      sections={sections}
      onBack={onBack}
      fileName={fileName}
    />
  );
};

export default ChangeSheetDetailView;
