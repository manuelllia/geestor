import React, { useState, useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { checkRealEstateDocument, createRealEstateDocument, insertPropertyData, SheetSelection } from '../../services/realEstateService';

interface RealEstateUploadViewProps {
  language: Language;
  onUploadComplete?: () => void;
  onCancel?: () => void;
}

const RealEstateUploadView: React.FC<RealEstateUploadViewProps> = ({ 
  language, 
  onUploadComplete,
  onCancel 
}) => {
  const { t } = useTranslation(language);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetSelection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFile = droppedFiles.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/csv' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls') ||
      file.name.endsWith('.csv')
    );

    if (validFile) {
      handleFileSelect(validFile);
    } else {
      setStatus('error');
      setStatusMessage('Por favor, selecciona solo archivos Excel (.xlsx, .xls) o CSV.');
    }
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus('idle');
    setStatusMessage('');

    try {
      if (selectedFile.name.endsWith('.csv')) {
        // Para CSV, no hay hojas múltiples
        setSheets([{ sheetName: 'CSV Data', selected: true }]);
      } else {
        // Para Excel, detectar hojas
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const sheetNames = workbook.SheetNames;

        if (sheetNames.length === 1) {
          setSheets([{ sheetName: sheetNames[0], selected: true }]);
        } else {
          setSheets(sheetNames.map(name => ({ sheetName: name, selected: false })));
        }
      }
    } catch (error) {
      console.error('Error al procesar archivo:', error);
      setStatus('error');
      setStatusMessage('Error al procesar el archivo. Verifica que sea un archivo válido.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleSheetToggle = (sheetName: string) => {
    setSheets(prev => prev.map(sheet => 
      sheet.sheetName === sheetName 
        ? { ...sheet, selected: !sheet.selected }
        : sheet
    ));
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Verificar si existe el documento de Gestión Inmuebles
      const realEstateExists = await checkRealEstateDocument();
      if (!realEstateExists) {
        await createRealEstateDocument();
      }

      const selectedSheets = sheets.filter(sheet => sheet.selected);
      const totalSheets = selectedSheets.length;

      for (let i = 0; i < selectedSheets.length; i++) {
        const sheet = selectedSheets[i];
        setStatusMessage(`Procesando hoja: ${sheet.sheetName}...`);

        let data: any[] = [];

        if (file.name.endsWith('.csv')) {
          // Procesar CSV
          const text = await file.text();
          const result = Papa.parse(text, { header: true, skipEmptyLines: true });
          data = result.data;
        } else {
          // Procesar Excel
          const arrayBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer);
          const worksheet = workbook.Sheets[sheet.sheetName];
          data = XLSX.utils.sheet_to_json(worksheet);
        }

        if (data.length > 0) {
          // Insertar datos usando el nombre de la hoja como subcolección
          await insertPropertyData(data, sheet.sheetName);
        }

        setProgress(((i + 1) / totalSheets) * 100);
      }

      setStatus('success');
      setStatusMessage(`Archivo procesado exitosamente. ${selectedSheets.length} hoja(s) importada(s).`);
      
      // Llamar callback si existe
      if (onUploadComplete) {
        setTimeout(onUploadComplete, 2000);
      }
    } catch (error) {
      console.error('Error al procesar archivo:', error);
      setStatus('error');
      setStatusMessage('Error al procesar el archivo. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setSheets([]);
    setProgress(0);
    setStatus('idle');
    setStatusMessage('');
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e) => {
      const selectedFile = (e.target as HTMLInputElement).files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
          Gestión de Inmuebles
        </h1>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Volver
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Importar Datos de Inmuebles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg mb-2">
                Arrastra tu archivo Excel o CSV aquí
              </p>
              <p className="text-gray-500 mb-4">
                o haz clic para seleccionar un archivo
              </p>
              <Button variant="outline" className="cursor-pointer">
                Seleccionar Archivo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={resetUpload}>
                  Cambiar Archivo
                </Button>
              </div>

              {sheets.length > 1 && (
                <div>
                  <h3 className="font-medium mb-3">Selecciona las hojas a procesar:</h3>
                  <div className="space-y-2">
                    {sheets.map((sheet) => (
                      <div key={sheet.sheetName} className="flex items-center space-x-2">
                        <Checkbox
                          id={sheet.sheetName}
                          checked={sheet.selected}
                          onCheckedChange={() => handleSheetToggle(sheet.sheetName)}
                        />
                        <label htmlFor={sheet.sheetName} className="text-sm cursor-pointer">
                          {sheet.sheetName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600">{statusMessage}</p>
                </div>
              )}

              {status === 'success' && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    {statusMessage}
                  </AlertDescription>
                </Alert>
              )}

              {status === 'error' && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {statusMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={processFile}
                disabled={isProcessing || sheets.filter(s => s.selected).length === 0}
                className="w-full"
              >
                {isProcessing ? 'Procesando...' : 'Procesar Archivo'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstateUploadView;
