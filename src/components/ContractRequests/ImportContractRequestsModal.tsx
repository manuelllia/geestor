import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { importContractRequests, ContractRequestRecord } from '../../services/contractRequestsService';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

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

      // Mapear los datos del Excel/CSV a la estructura de ContractRequestRecord
      const requests: Partial<ContractRequestRecord>[] = data.map((row: any) => ({
        requesterName: row['Candidato Seleccionado'] || '',
        requesterLastName: '', // No está en el Excel, se deja vacío
        contractType: row['Tipo de Contrato'] || '',
        salary: row['Salario']?.toString() || '',
        observations: row['Observaciones'] || '',
        incorporationDate: parseDate(row['Fecha de Incorporación']),
        company: resolveCompany(row['Empresa'], row['NUEVA EMPRESA']),
        jobPosition: resolveJobPosition(row['Puesto de Trabajo'], row['Especificar Puesto de Trabajo']),
        professionalCategory: resolveProfessionalCategory(row['Categoría Profesional'], row['Especificar Categoría Profesional']),
        city: row['Población'] || '',
        province: row['Provincia'] || '',
        autonomousCommunity: row['Comunidad Autónoma'] || '',
        workCenter: resolveWorkCenter(row['Centro de Trabajo'], row['Especificar Centro']),
        companyFlat: row['Piso de Empresa'] === 'Si' ? 'Si' : 'No',
        language1: row['Idioma'] || '',
        level1: row['Nivel'] || '',
        language2: row['Idioma 2'] || '',
        level2: row['Nivel 2'] || '',
        experienceElectromedicine: row['Experiencia Previa en Electromedicina'] || '',
        experienceInstallations: row['Experiencia Previa en Instalaciones'] || '',
        hiringReason: row['Motivo de la Contratación'] || '',
        notesAndCommitments: row['Observaciones y/o Compromisos'] || '',
        status: 'Pendiente' as const,
      }));

      console.log('Datos procesados para importar:', requests);

      const result = await importContractRequests(requests);
      setUploadResult(result);

    } catch (error) {
      console.error('Error procesando archivo:', error);
      setUploadResult({
        success: 0,
        errors: [`Error procesando archivo: ${error}`]
      });
    } finally {
      setIsUploading(false);
    }
  };

  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    
    const formats = [
      () => new Date(dateString),
      () => {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return null;
      },
      () => {
        const parts = dateString.split('-');
        if (parts.length === 3) {
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        return null;
      }
    ];

    for (const format of formats) {
      try {
        const date = format();
        if (date && !isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        continue;
      }
    }

    return undefined;
  };

  const resolveCompany = (empresa: string, nuevaEmpresa: string): string => {
    const companyOptions = ['IBERMAN SA', 'ASIME SA', 'MANTELEC SA', 'INSANEX SL', 'SSM', 'RD HEALING', 'AINATEC INDEL FACILITIES'];
    
    if (empresa && companyOptions.includes(empresa)) {
      return empresa;
    }
    
    return nuevaEmpresa || empresa || '';
  };

  const resolveJobPosition = (puesto: string, especificar: string): string => {
    const jobPositionOptions = [
      'TÉCNICO/A DE ELECTROMEDICINA', 'RC', 'INGENIERO/A ELECTRONICO', 'INGENIERO/A MECANICO',
      'INGENIERO/A DESARROLLO HW Y SW', 'ELECTRICISTA', 'FRIGORISTA', 'TÉCNICO/A DE INSTALACIONES',
      'ALBAÑIL'
    ];
    
    if (puesto && jobPositionOptions.includes(puesto)) {
      return puesto;
    }
    
    return especificar || puesto || '';
  };

  const resolveProfessionalCategory = (categoria: string, especificar: string): string => {
    const professionalCategoryOptions = ['TÉCNICO/A', 'INGENIERO/A', 'OFICIAL 1º', 'OFICIAL 2º', 'OFICIAL 3º'];
    
    if (categoria && professionalCategoryOptions.includes(categoria)) {
      return categoria;
    }
    
    return especificar || categoria || '';
  };

  const resolveWorkCenter = (centro: string, especificar: string): string => {
    return especificar || centro || '';
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
                Sube un archivo CSV o Excel con las solicitudes de contratación. El archivo debe contener las siguientes columnas:
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Columnas esperadas del Excel:
                </div>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Candidato Seleccionado</li>
                  <li>• Tipo de Contrato</li>
                  <li>• Salario</li>
                  <li>• Observaciones</li>
                  <li>• Fecha de Incorporación</li>
                  <li>• Empresa / NUEVA EMPRESA</li>
                  <li>• Puesto de Trabajo / Especificar Puesto</li>
                  <li>• Categoría Profesional / Especificar</li>
                  <li>• Población, Provincia, Comunidad Autónoma</li>
                  <li>• Centro de Trabajo / Especificar Centro</li>
                  <li>• Idiomas y Experiencia</li>
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
