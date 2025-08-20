import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
// Importamos ContractRequestData directamente si está disponible, si no, la definimos aquí para el mapeo
import { importContractRequests, ContractRequestData } from '../../services/contractRequestsService';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Si ContractRequestData no está exportada desde services/contractRequestsService,
// puedes definirla aquí (o en un archivo de tipos común) para el mapeo.
// Asumo que ContractRequestData es la misma estructura que el formData en el formulario de creación.
// Si ya está definida en el servicio y es igual a lo que el formulario espera, esta definición no es necesaria.
// Si la importas desde el servicio, asegúrate de que sea la misma estructura esperada.
/*
export interface ContractRequestData {
  id?: string; // Para edición
  applicantName: string;
  applicantLastName: string;
  contractType: string;
  salary?: string; // Es un input de tipo number, pero el estado lo guarda como string
  observations?: string;
  incorporationDate: Date;
  company: string;
  position: string;
  professionalCategory: string;
  city?: string;
  province?: string;
  autonomousCommunity?: string;
  workCenter: string;
  directResponsible?: string;
  directSupervisorLastName?: string;
  companyFloor: string; // "Si" o "No"
  language?: string;
  languageLevel?: string;
  language2?: string;
  languageLevel2?: string;
  electromedicalExperience?: string;
  installationExperience?: string;
  hiringReason?: string;
  commitmentsObservations?: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Cerrada'; // O los estados que manejes
  requestDate: Date;
}
*/

interface ImportContractRequestsModalProps {
  open: boolean;
  onClose: () => void;
  language: Language;
}

const ImportContractRequestsModal: React.FC<ImportContractRequestsModalProps> = ({
  open,
  onClose,
  language
}) => {
  const { t } = useTranslation(language);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: number; errors: string[] } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let data: any[] = [];

      if (fileExtension === 'csv') {
        const text = await file.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        data = result.data;
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else {
        throw new Error('Formato de archivo no soportado. Use CSV o Excel (.xlsx, .xls)');
      }

      // Mapeo de columnas del archivo a los campos de ContractRequestData
      const requests: ContractRequestData[] = data.map((row: any) => ({
        applicantName: row['Nombre del Candidato'] || row['Nombre'] || row['applicantName'] || '',
        applicantLastName: row['Apellido del Candidato'] || row['Apellidos'] || row['applicantLastName'] || '',
        contractType: row['Tipo de Contrato'] || row['contractType'] || '',
        salary: String(row['Salario'] || row['salary'] || ''), // Asegurarse de que sea string
        observations: row['Observaciones'] || row['observations'] || '',
        incorporationDate: parseDate(row['Fecha de Incorporación'] || row['incorporationDate']) || new Date(), // Es requerido en el formulario
        company: row['Empresa'] || row['company'] || '',
        position: row['Puesto'] || row['position'] || '',
        professionalCategory: row['Categoría Profesional'] || row['professionalCategory'] || '',
        city: row['Ciudad'] || row['city'] || '',
        province: row['Provincia'] || row['province'] || '',
        autonomousCommunity: row['Comunidad Autónoma'] || row['autonomousCommunity'] || '',
        workCenter: row['Centro de Trabajo'] || row['workCenter'] || '',
        directResponsible: row['Nombre Responsable Directo'] || row['directResponsible'] || '',
        directSupervisorLastName: row['Apellido Responsable Directo'] || row['directSupervisorLastName'] || '',
        companyFloor: row['Piso de Empresa'] || row['companyFloor'] || '', // Debe ser "Si" o "No"
        language: row['Idioma 1'] || row['language'] || '',
        languageLevel: row['Nivel Idioma 1'] || row['languageLevel'] || '',
        language2: row['Idioma 2'] || row['language2'] || '',
        languageLevel2: row['Nivel Idioma 2'] || row['languageLevel2'] || '',
        electromedicalExperience: row['Experiencia Electromedicina'] || row['electromedicalExperience'] || '',
        installationExperience: row['Experiencia Instalaciones'] || row['installationExperience'] || '',
        hiringReason: row['Motivo de Contratación'] || row['hiringReason'] || '',
        commitmentsObservations: row['Observaciones de Compromisos'] || row['commitmentsObservations'] || '',
        status: row['Estado'] || row['status'] || 'Pendiente', // Default 'Pendiente'
        requestDate: parseDate(row['Fecha de Solicitud'] || row['requestDate']) || new Date() // Default a la fecha actual si no se proporciona
      }));

      console.log('Datos procesados para importar:', requests);

      const result = await importContractRequests(requests);
      setUploadResult(result);

    } catch (error: any) { // Usar 'any' para capturar posibles errores de tipo Error o string
      console.error('Error procesando archivo:', error);
      setUploadResult({
        success: 0,
        errors: [`Error procesando archivo: ${error.message || error}`]
      });
    } finally {
      setIsUploading(false);
    }
  };

  const parseDate = (dateString: string | number): Date | undefined => {
    if (!dateString) return undefined;

    // Si es un número, podría ser un número de serie de fecha de Excel
    if (typeof dateString === 'number') {
      // Excel guarda las fechas como días desde 1/1/1900.
      // 25569 es la fecha de inicio de Unix epoch (1/1/1970) en formato Excel.
      // Se resta para ajustar la diferencia de base de Excel (empieza en 1900, Unix en 1970)
      // y se multiplica por 24 * 60 * 60 * 1000 para convertir días a milisegundos.
      const excelDate = dateString - (25569); // Ajuste para el offset de Excel (1/1/1900 vs 1/1/1970)
      const date = new Date(excelDate * 24 * 60 * 60 * 1000);
      if (!isNaN(date.getTime())) {
          return date;
      }
    }
    
    // Si es una cadena, intenta varios formatos
    const formats = [
      (str: string) => new Date(str), // Intenta formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ) o YYYY-MM-DD
      (str: string) => { // DD/MM/YYYY
        const parts = str.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return null;
      },
      (str: string) => { // MM/DD/YYYY
        const parts = str.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        }
        return null;
      },
      (str: string) => { // DD-MM-YYYY
        const parts = str.split('-');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return null;
      }
    ];

    for (const format of formats) {
      try {
        const date = format(String(dateString)); // Asegurarse de que dateString sea un string para los parsers de string
        if (date && !isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        continue;
      }
    }

    return undefined; // Retorna undefined si no se puede parsear
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleClose = () => {
    setUploadResult(null);
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Importar Solicitudes de Contratación</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!uploadResult && (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Sube un archivo CSV o Excel con las solicitudes de contratación. El archivo debe contener las siguientes columnas (se sugieren los nombres, pero también se reconocen los nombres programáticos):
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Columnas aceptadas (obligatorias marcadas con *):
                </div>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Nombre del Candidato* (o applicantName)</li>
                  <li>• Apellido del Candidato* (o applicantLastName)</li>
                  <li>• Tipo de Contrato* (o contractType)</li>
                  <li>• Salario (o salary)</li>
                  <li>• Observaciones (o observations)</li>
                  <li>• Fecha de Incorporación* (o incorporationDate)</li>
                  <li>• Empresa* (o company)</li>
                  <li>• Puesto* (o position)</li>
                  <li>• Categoría Profesional* (o professionalCategory)</li>
                  <li>• Ciudad (o city)</li>
                  <li>• Provincia (o province)</li>
                  <li>• Comunidad Autónoma (o autonomousCommunity)</li>
                  <li>• Centro de Trabajo* (o workCenter)</li>
                  <li>• Nombre Responsable Directo (o directResponsible)</li>
                  <li>• Apellido Responsable Directo (o directSupervisorLastName)</li>
                  <li>• Piso de Empresa* (o companyFloor) - Valores: "Si" o "No"</li>
                  <li>• Idioma 1 (o language)</li>
                  <li>• Nivel Idioma 1 (o languageLevel)</li>
                  <li>• Idioma 2 (o language2)</li>
                  <li>• Nivel Idioma 2 (o languageLevel2)</li>
                  <li>• Experiencia Electromedicina (o electromedicalExperience)</li>
                  <li>• Experiencia Instalaciones (o installationExperience)</li>
                  <li>• Motivo de Contratación (o hiringReason)</li>
                  <li>• Observaciones de Compromisos (o commitmentsObservations)</li>
                  <li>• Estado (o status) - Default: "Pendiente"</li>
                  <li>• Fecha de Solicitud (o requestDate) - Default: fecha actual</li>
                </ul>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Procesando...' : 'Seleccionar Archivo'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </>
          )}

          {uploadResult && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {uploadResult.success > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  Resultado de la Importación
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm">
                  <div className="text-green-600 dark:text-green-400">
                    ✓ {uploadResult.success} solicitudes importadas exitosamente
                  </div>
                  {uploadResult.errors.length > 0 && (
                    <div className="mt-2">
                      <div className="text-red-600 dark:text-red-400 mb-1">
                        ✗ {uploadResult.errors.length} errores:
                      </div>
                      <div className="max-h-32 overflow-y-auto text-xs text-red-500 dark:text-red-400 space-y-1">
                        {uploadResult.errors.map((error, index) => (
                          <div key={index}>• {error}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            {uploadResult ? 'Cerrar' : 'Cancelar'}
          </Button>
          {uploadResult && uploadResult.success > 0 && (
            <Button onClick={handleClose}>
              Continuar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContractRequestsModal;