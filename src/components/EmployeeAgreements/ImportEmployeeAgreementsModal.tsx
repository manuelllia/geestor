
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import {
  saveEmployeeAgreement,
  EmployeeAgreementRecord
} from '../../services/employeeAgreementsService';

interface ImportEmployeeAgreementsModalProps {
  open: boolean;
  onClose: () => void;
  language: Language;
}

const ImportEmployeeAgreementsModal: React.FC<ImportEmployeeAgreementsModalProps> = ({
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

      const agreements = data.map((row: any) => ({
        employeeName: row['employeeName'] || '',
        employeeLastName: row['employeeLastName'] || '',
        workCenter: row['workCenter'] || '',
        city: row['city'] || '',
        province: row['province'] || '',
        autonomousCommunity: row['autonomousCommunity'] || '',
        responsibleName: row['responsibleName'] || '',
        responsibleLastName: row['responsibleLastName'] || '',
        agreementConcepts: row['agreementConcepts'] || '',
        economicAgreement1: row['economicAgreement1'] || '',
        concept1: row['concept1'] || '',
        economicAgreement2: row['economicAgreement2'] || '',
        concept2: row['concept2'] || '',
        economicAgreement3: row['economicAgreement3'] || '',
        concept3: row['concept3'] || '',
        activationDate: row['activationDate'] || new Date().toISOString(),
        endDate: row['endDate'] || undefined,
        observationsAndCommitment: row['observationsAndCommitment'] || '',
        // Campos requeridos para compatibilidad
        jobPosition: row['jobPosition'] || row['agreementConcepts'] || '',
        department: row['department'] || row['workCenter'] || '',
        agreementType: row['agreementType'] || row['agreementConcepts'] || '',
        startDate: row['startDate'] || row['activationDate'] || new Date().toISOString(),
        salary: row['salary'] || row['economicAgreement1'] || '0',
        status: (row['status'] as 'Activo' | 'Finalizado' | 'Suspendido') || 'Activo',
        observations: row['observations'] || row['observationsAndCommitment'] || '',
      }));

      let successCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < agreements.length; i++) {
        try {
          await saveEmployeeAgreement(agreements[i]);
          successCount++;
        } catch (error) {
          errors.push(`Fila ${i + 1}: ${error}`);
        }
      }

      setUploadResult({ success: successCount, errors });

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
            <span>Importar Acuerdos con Empleados</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!uploadResult && (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Sube un archivo CSV o Excel con los acuerdos con empleados. El archivo debe contener las siguientes columnas:
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Columnas requeridas:
                </div>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• employeeName</li>
                  <li>• employeeLastName</li>
                  <li>• workCenter</li>
                  <li>• responsibleName</li>
                  <li>• responsibleLastName</li>
                  <li>• agreementConcepts</li>
                  <li>• activationDate</li>
                  <li>• endDate</li>
                  <li>• observationsAndCommitment</li>
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
                    ✓ {uploadResult.success} acuerdos con empleados importados exitosamente
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

export default ImportEmployeeAgreementsModal;
