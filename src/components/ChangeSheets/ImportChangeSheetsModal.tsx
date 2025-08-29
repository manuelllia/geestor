
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { saveChangeSheet, ChangeSheetData } from '../../services/changeSheetService';
import * as XLSX from 'xlsx';

interface ImportChangeSheetsModalProps {
  open: boolean;
  onClose: () => void;
  language: Language;
}

const ImportChangeSheetsModal: React.FC<ImportChangeSheetsModalProps> = ({ 
  open, 
  onClose, 
  language 
}) => {
  const { t } = useTranslation(language);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
    }
  };

  const processFileData = async (file: File): Promise<ChangeSheetData[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Asumir que la primera fila son headers
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1) as any[][];
    
    // Mapear las columnas (ajustar según el formato esperado)
    const requiredFields = {
      employeeName: 'nombre',
      employeeLastName: 'apellido',
      originCenter: 'centro_origen',
      currentPosition: 'puesto_actual',
      currentSupervisorName: 'supervisor_actual_nombre',
      currentSupervisorLastName: 'supervisor_actual_apellido',
      newPosition: 'nuevo_puesto',
      newSupervisorName: 'nuevo_supervisor_nombre',
      newSupervisorLastName: 'nuevo_supervisor_apellido',
      startDate: 'fecha_inicio',
      changeType: 'tipo_cambio',
      needs: 'necesidades',
      currentCompany: 'empresa_actual',
      companyChange: 'cambio_empresa',
      observations: 'observaciones'
    };
    
    const getColumnIndex = (fieldName: string) => {
      const variations = [
        fieldName.toLowerCase(),
        fieldName.toLowerCase().replace('_', ' '),
        fieldName.toLowerCase().replace('_', ''),
      ];
      
      return headers.findIndex(header => {
        const normalizedHeader = header.toLowerCase().trim();
        return variations.some(variation => normalizedHeader.includes(variation));
      });
    };
    
    const processedData: ChangeSheetData[] = dataRows
      .filter(row => row && row.length > 0 && row[0]) // Filtrar filas vacías
      .map((row, index) => {
        try {
          const data: ChangeSheetData = {
            employeeName: row[getColumnIndex('nombre')] || '',
            employeeLastName: row[getColumnIndex('apellido')] || '',
            originCenter: row[getColumnIndex('centro_origen')] || '',
            currentPosition: row[getColumnIndex('puesto_actual')] || '',
            currentSupervisorName: row[getColumnIndex('supervisor_actual_nombre')] || '',
            currentSupervisorLastName: row[getColumnIndex('supervisor_actual_apellido')] || '',
            newPosition: row[getColumnIndex('nuevo_puesto')] || '',
            newSupervisorName: row[getColumnIndex('nuevo_supervisor_nombre')] || '',
            newSupervisorLastName: row[getColumnIndex('nuevo_supervisor_apellido')] || '',
            startDate: row[getColumnIndex('fecha_inicio')] ? new Date(row[getColumnIndex('fecha_inicio')]) : undefined,
            changeType: row[getColumnIndex('tipo_cambio')] || '',
            needs: row[getColumnIndex('necesidades')] ? String(row[getColumnIndex('necesidades')]).split(',').map(n => n.trim()) : [],
            currentCompany: row[getColumnIndex('empresa_actual')] || '',
            companyChange: row[getColumnIndex('cambio_empresa')] || '',
            observations: row[getColumnIndex('observaciones')] || ''
          };
          
          return data;
        } catch (error) {
          console.error(`Error procesando fila ${index + 2}:`, error);
          throw new Error(`Error en fila ${index + 2}: ${error}`);
        }
      });
    
    return processedData;
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    const errors: string[] = [];
    let successCount = 0;
    
    try {
      const changeSheetData = await processFileData(file);
      
      for (let i = 0; i < changeSheetData.length; i++) {
        try {
          await saveChangeSheet(changeSheetData[i]);
          successCount++;
          console.log(`Hoja de cambio ${i + 1} importada exitosamente`);
        } catch (error) {
          const errorMessage = `Fila ${i + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`;
          errors.push(errorMessage);
          console.error(`Error importando fila ${i + 2}:`, error);
        }
      }
      
      setResults({ success: successCount, errors });
    } catch (error) {
      console.error('Error procesando archivo:', error);
      setResults({ 
        success: 0, 
        errors: [`Error procesando archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`] 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResults(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-800 dark:text-blue-200">
            {t('import')} - {t('hojasCambio')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!results && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Seleccionar archivo para importar
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sube un archivo Excel (.xlsx) o CSV con las hojas de cambio
                      </p>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <File className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Haz clic para seleccionar archivo
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Excel (.xlsx) o CSV
                        </span>
                      </label>
                    </div>
                    
                    {file && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <File className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            {file.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      Formato esperado del archivo:
                    </p>
                    <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 text-xs">
                      <li>• Primera fila debe contener los nombres de las columnas</li>
                      <li>• Columnas esperadas: nombre, apellido, centro_origen, puesto_actual, etc.</li>
                      <li>• Fechas en formato DD/MM/YYYY o YYYY-MM-DD</li>
                      <li>• Cada fila será insertada como una nueva hoja de cambio</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {results && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Importación completada
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {results.success} hojas de cambio importadas exitosamente
                    </p>
                  </div>
                  
                  {results.errors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-left">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                        Errores encontrados ({results.errors.length}):
                      </h4>
                      <div className="max-h-32 overflow-y-auto">
                        {results.errors.map((error, index) => (
                          <p key={index} className="text-xs text-red-700 dark:text-red-300 mb-1">
                            {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              {results ? 'Cerrar' : 'Cancelar'}
            </Button>
            {!results && (
              <Button
                onClick={handleImport}
                disabled={!file || isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Importando...</span>
                  </div>
                ) : (
                  'Importar Hojas de Cambio'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportChangeSheetsModal;
