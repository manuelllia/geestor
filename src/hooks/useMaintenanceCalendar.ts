
import { useState } from 'react';
import * as XLSX from 'xlsx';

interface InventoryItem {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  location: string;
  department: string;
  acquisitionDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: string;
}

interface MaintenanceEvent {
  id: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: string;
  scheduledDate: string;
  duration: string;
  technician: string;
  priority: string;
  status: string;
  notes: string;
}

interface SheetInfo {
  name: string;
  selected: boolean;
  rowCount: number;
  columns: string[];
  preview: any[];
}

export const useMaintenanceCalendar = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [maintenanceCalendar, setMaintenanceCalendar] = useState<MaintenanceEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [selectedSheets, setSelectedSheets] = useState<SheetInfo[]>([]);
  const [processingStep, setProcessingStep] = useState<'upload' | 'select-sheets' | 'summary' | 'processing' | 'complete'>('upload');

  const analyzeFileSheets = async (file: File): Promise<SheetInfo[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    
    return workbook.SheetNames.map(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as string[] || [];
      const dataRows = jsonData.slice(1);
      const preview = dataRows.slice(0, 3);
      
      return {
        name: sheetName,
        selected: true,
        rowCount: dataRows.length,
        columns: headers,
        preview
      };
    });
  };

  const processInventoryFile = async (file: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setCurrentFile(file);

    try {
      // Analizar hojas del archivo
      const sheets = await analyzeFileSheets(file);
      
      if (sheets.length === 1) {
        // Si solo hay una hoja, procesar directamente
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const processedData = jsonData.slice(1).map((row: any, index: number) => ({
          id: `inv_${index + 1}`,
          equipment: row[0] || '',
          model: row[1] || '',
          serialNumber: row[2] || '',
          location: row[3] || '',
          department: row[4] || '',
          acquisitionDate: row[5] || '',
          lastMaintenance: row[6] || '',
          nextMaintenance: row[7] || '',
          status: row[8] || 'Activo'
        }));

        setInventory(processedData);
        setProcessingStep('complete');
      } else {
        // Si hay múltiples hojas, mostrar selector
        setSelectedSheets(sheets);
        setProcessingStep('select-sheets');
      }
    } catch (err) {
      setError('Error al procesar el archivo de inventario');
      console.error('Error processing inventory file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const processMaintenanceFile = async (file: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setCurrentFile(file);

    try {
      const sheets = await analyzeFileSheets(file);
      
      if (sheets.length === 1) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const processedData = jsonData.slice(1).map((row: any, index: number) => ({
          id: `maint_${index + 1}`,
          equipmentId: row[0] || '',
          equipmentName: row[1] || '',
          maintenanceType: row[2] || '',
          scheduledDate: row[3] || '',
          duration: row[4] || '',
          technician: row[5] || '',
          priority: row[6] || 'Media',
          status: row[7] || 'Programado',
          notes: row[8] || ''
        }));

        setMaintenanceCalendar(processedData);
        setProcessingStep('complete');
      } else {
        setSelectedSheets(sheets);
        setProcessingStep('select-sheets');
      }
    } catch (err) {
      setError('Error al procesar el archivo de calendario');
      console.error('Error processing maintenance file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const processFinalSheets = async (isInventory: boolean = true) => {
    if (!currentFile || selectedSheets.filter(s => s.selected).length === 0) return;

    setIsLoading(true);
    setProcessingStep('processing');

    try {
      const data = await currentFile.arrayBuffer();
      const workbook = XLSX.read(data);
      let allProcessedData: any[] = [];

      // Procesar hojas seleccionadas
      selectedSheets.filter(s => s.selected).forEach((sheet, sheetIndex) => {
        const worksheet = workbook.Sheets[sheet.name];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const sheetData = jsonData.slice(1).map((row: any, index: number) => {
          if (isInventory) {
            return {
              id: `inv_${sheetIndex}_${index + 1}`,
              equipment: row[0] || '',
              model: row[1] || '',
              serialNumber: row[2] || '',
              location: row[3] || '',
              department: row[4] || '',
              acquisitionDate: row[5] || '',
              lastMaintenance: row[6] || '',
              nextMaintenance: row[7] || '',
              status: row[8] || 'Activo'
            };
          } else {
            return {
              id: `maint_${sheetIndex}_${index + 1}`,
              equipmentId: row[0] || '',
              equipmentName: row[1] || '',
              maintenanceType: row[2] || '',
              scheduledDate: row[3] || '',
              duration: row[4] || '',
              technician: row[5] || '',
              priority: row[6] || 'Media',
              status: row[7] || 'Programado',
              notes: row[8] || ''
            };
          }
        });

        allProcessedData = [...allProcessedData, ...sheetData];
      });

      if (isInventory) {
        setInventory(allProcessedData);
      } else {
        setMaintenanceCalendar(allProcessedData);
      }

      setProcessingStep('complete');
    } catch (err) {
      setError('Error al procesar las hojas seleccionadas');
      console.error('Error processing selected sheets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAICalendar = async () => {
    setIsLoading(true);
    try {
      // Aquí irá la lógica de IA para generar el calendario
      // Por ahora simulamos un procesamiento
      await new Promise(resolve => setTimeout(resolve, 3000));
      setProcessingStep('complete');
    } catch (err) {
      setError('Error al generar el calendario con IA');
    } finally {
      setIsLoading(false);
    }
  };

  const resetProcess = () => {
    setProcessingStep('upload');
    setSelectedSheets([]);
    setCurrentFile(null);
    setError(null);
  };

  return {
    inventory,
    maintenanceCalendar,
    isLoading,
    error,
    processingStep,
    selectedSheets,
    processInventoryFile,
    processMaintenanceFile,
    processFinalSheets,
    generateAICalendar,
    resetProcess,
    setSelectedSheets,
    setProcessingStep
  };
};
