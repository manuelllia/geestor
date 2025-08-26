
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import DetailPDFView from '../Common/DetailPDFView';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { User, Building, Calendar, FileText, DollarSign, MapPin, Globe, Award } from 'lucide-react';

interface ContractRequestData {
  id: string;
  requesterName: string;
  requesterLastName: string;
  contractType: string;
  salary: string;
  observations: string;
  incorporationDate?: Date;
  company: string;
  jobPosition: string;
  professionalCategory: string;
  city: string;
  province: string;
  autonomousCommunity: string;
  workCenter: string;
  companyFlat: 'Si' | 'No';
  language1?: string;
  level1?: string;
  language2?: string;
  level2?: string;
  experienceElectromedicine?: string;
  experienceInstallations?: string;
  hiringReason: string;
  notesAndCommitments: string;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  requestDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ContractRequestDetailViewProps {
  language: Language;
  requestId: string;
  onBack: () => void;
}

const ContractRequestDetailView: React.FC<ContractRequestDetailViewProps> = ({ 
  language, 
  requestId,
  onBack 
}) => {
  const { t } = useTranslation(language);
  const [requestData, setRequestData] = useState<ContractRequestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const docRef = doc(db, "Gestión de Talento", "Solicitudes Contratación", "solicitudes", requestId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRequestData({
            id: docSnap.id,
            ...data,
            incorporationDate: data.incorporationDate?.toDate() || undefined,
            requestDate: data.requestDate?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as ContractRequestData);
        }
      } catch (error) {
        console.error('Error al obtener datos de la solicitud:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestData();
  }, [requestId]);

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

  if (!requestData) {
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
      title: 'Información del Solicitante',
      fields: [
        { label: 'Nombre', value: requestData.requesterName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: 'Apellidos', value: requestData.requesterLastName, icon: <User className="w-4 h-4 text-blue-500" /> },
        { label: 'Empresa', value: requestData.company, icon: <Building className="w-4 h-4 text-blue-500" /> },
        { label: 'Centro de Trabajo', value: requestData.workCenter, icon: <Building className="w-4 h-4 text-blue-500" /> }
      ]
    },
    {
      title: 'Detalles del Puesto',
      fields: [
        { label: 'Puesto de Trabajo', value: requestData.jobPosition, icon: <FileText className="w-4 h-4 text-green-500" /> },
        { label: 'Categoría Profesional', value: requestData.professionalCategory, icon: <Award className="w-4 h-4 text-green-500" /> },
        { label: 'Tipo de Contrato', value: requestData.contractType, icon: <FileText className="w-4 h-4 text-green-500" /> },
        { label: 'Salario', value: requestData.salary, type: 'currency' as const, icon: <DollarSign className="w-4 h-4 text-green-500" /> }
      ]
    },
    {
      title: 'Ubicación',
      fields: [
        { label: 'Población', value: requestData.city, icon: <MapPin className="w-4 h-4 text-purple-500" /> },
        { label: 'Provincia', value: requestData.province, icon: <MapPin className="w-4 h-4 text-purple-500" /> },
        { label: 'Comunidad Autónoma', value: requestData.autonomousCommunity, icon: <MapPin className="w-4 h-4 text-purple-500" /> },
        { label: 'Piso de Empresa', value: requestData.companyFlat, icon: <Building className="w-4 h-4 text-purple-500" /> }
      ]
    },
    {
      title: 'Idiomas',
      fields: [
        { label: 'Idioma 1', value: requestData.language1 || 'No especificado', icon: <Globe className="w-4 h-4 text-orange-500" /> },
        { label: 'Nivel 1', value: requestData.level1 || 'No especificado', icon: <Award className="w-4 h-4 text-orange-500" /> },
        { label: 'Idioma 2', value: requestData.language2 || 'No especificado', icon: <Globe className="w-4 h-4 text-orange-500" /> },
        { label: 'Nivel 2', value: requestData.level2 || 'No especificado', icon: <Award className="w-4 h-4 text-orange-500" /> }
      ]
    },
    {
      title: 'Fechas y Estado',
      fields: [
        { label: 'Fecha de Solicitud', value: requestData.requestDate, type: 'date' as const, icon: <Calendar className="w-4 h-4 text-red-500" /> },
        { label: 'Fecha de Incorporación', value: requestData.incorporationDate, type: 'date' as const, icon: <Calendar className="w-4 h-4 text-red-500" /> },
        { label: 'Estado', value: requestData.status, icon: <FileText className="w-4 h-4 text-red-500" /> }
      ]
    },
    {
      title: 'Experiencia y Observaciones',
      fields: [
        { label: 'Experiencia en Electromedicina', value: requestData.experienceElectromedicine || 'No especificado', icon: <FileText className="w-4 h-4 text-indigo-500" /> },
        { label: 'Experiencia en Instalaciones', value: requestData.experienceInstallations || 'No especificado', icon: <FileText className="w-4 h-4 text-indigo-500" /> },
        { label: 'Motivo de Contratación', value: requestData.hiringReason, icon: <FileText className="w-4 h-4 text-indigo-500" /> },
        { label: 'Observaciones y Compromisos', value: requestData.notesAndCommitments, icon: <FileText className="w-4 h-4 text-indigo-500" /> },
        { label: 'Observaciones Generales', value: requestData.observations, icon: <FileText className="w-4 h-4 text-indigo-500" /> }
      ]
    }
  ];

  const fileName = `Solicitud_Contratacion_${requestData.requesterName}_${requestData.requesterLastName}_${requestData.id}`;

  return (
    <DetailPDFView
      language={language}
      title="Detalles de la Solicitud de Contratación"
      recordId={requestData.id}
      sections={sections}
      onBack={onBack}
      fileName={fileName}
    />
  );
};

export default ContractRequestDetailView;
