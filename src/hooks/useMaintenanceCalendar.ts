
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
  denominacionHomogenea?: string;
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
  sheetType?: 'inventory' | 'frec-tipo' | 'planning' | 'anexo' | 'other';
}

interface DenominacionHomogeneaData {
  denominacion: string;
  cantidad: number;
  frecuencia?: string;
  tipoMantenimiento?: string;
}

export const useMaintenanceCalendar = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [maintenanceCalendar, setMaintenanceCalendar] = useState<MaintenanceEvent[]>([]);
  const [denominacionesData, setDenominacionesData] = useState<DenominacionHomogeneaData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [selectedSheets, setSelectedSheets] = useState<SheetInfo[]>([]);
  const [processingStep, setProcessingStep] = useState<'upload' | 'select-sheets' | 'summary' | 'processing' | 'complete'>('upload');
  const [frecTipoData, setFrecTipoData] = useState<any[]>([]);

  const detectSheetType = (sheetName: string, columns: string[]): 'inventory' | 'frec-tipo' | 'planning' | 'anexo' | 'other' => {
    const name = sheetName.toLowerCase();
    const columnNames = columns.map(col => col.toLowerCase());
    
    // Detectar hoja de inventario (buscar columnas típicas de inventario)
    if (columnNames.some(col => col.includes('denominación homogénea') || col.includes('denominacion homogenea')) &&
        columnNames.some(col => col.includes('serie') || col.includes('modelo'))) {
      return 'inventory';
    }
    
    // Detectar FREC Y TIPO
    if (name.includes('frec') && name.includes('tipo')) {
      return 'frec-tipo';
    }
    
    // Detectar PLANNING
    if (name.includes('planning') || name.includes('planificacion')) {
      return 'planning';
    }
    
    // Detectar ANEXO
    if (name.includes('anexo')) {
      return 'anexo';
    }
    
    return 'other';
  };

  const analyzeFileSheets = async (file: File): Promise<SheetInfo[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    
    return workbook.SheetNames.map(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as string[] || [];
      const dataRows = jsonData.slice(1);
      const preview = dataRows.slice(0, 3);
      const sheetType = detectSheetType(sheetName, headers);
      
      return {
        name: sheetName,
        selected: sheetType !== 'other', // Auto-seleccionar hojas relevantes
        rowCount: dataRows.length,
        columns: headers,
        preview,
        sheetType
      };
    });
  };

  const processInventoryData = (jsonData: any[], headers: string[]) => {
    const denominacionIndex = headers.findIndex(h => 
      h.toLowerCase().includes('denominación homogénea') || 
      h.toLowerCase().includes('denominacion homogenea')
    );
    
    return jsonData.slice(1).map((row: any, index: number) => ({
      id: `inv_${index + 1}`,
      equipment: row[0] || '',
      model: row[1] || '',
      serialNumber: row[2] || '',
      location: row[3] || '',
      department: row[4] || '',
      acquisitionDate: row[5] || '',
      lastMaintenance: row[6] || '',
      nextMaintenance: row[7] || '',
      status: row[8] || 'Activo',
      denominacionHomogenea: denominacionIndex !== -1 ? row[denominacionIndex] : ''
    }));
  };

  const processFrecTipoData = (jsonData: any[], headers: string[]) => {
    const denominacionIndex = headers.findIndex(h => 
      h.toLowerCase().includes('denominación') || 
      h.toLowerCase().includes('denominacion')
    );
    const frecuenciaIndex = headers.findIndex(h => 
      h.toLowerCase().includes('frecuencia')
    );
    const tipoIndex = headers.findIndex(h => 
      h.toLowerCase().includes('tipo')
    );
    
    return jsonData.slice(1).map((row: any) => ({
      denominacion: denominacionIndex !== -1 ? row[denominacionIndex] : '',
      frecuencia: frecuenciaIndex !== -1 ? row[frecuenciaIndex] : '',
      tipo: tipoIndex !== -1 ? row[tipoIndex] : ''
    })).filter(item => item.denominacion); // Filtrar filas vacías
  };

  const countDenominacionesHomogeneas = (inventoryData: InventoryItem[], frecTipoData: any[]) => {
    const denominacionCount: { [key: string]: number } = {};
    
    // Contar denominaciones en el inventario
    inventoryData.forEach(item => {
      if (item.denominacionHomogenea && item.denominacionHomogenea.trim()) {
        const denominacion = item.denominacionHomogenea.trim();
        denominacionCount[denominacion] = (denominacionCount[denominacion] || 0) + 1;
      }
    });
    
    // Crear array con datos combinados
    const result: DenominacionHomogeneaData[] = Object.entries(denominacionCount).map(([denominacion, cantidad]) => {
      // Buscar información en FREC Y TIPO
      const frecTipoInfo = frecTipoData.find(item => 
        item.denominacion && item.denominacion.toLowerCase().trim() === denominacion.toLowerCase().trim()
      );
      
      return {
        denominacion,
        cantidad,
        frecuencia: frecTipoInfo?.frecuencia || 'No especificada',
        tipoMantenimiento: frecTipoInfo?.tipo || 'No especificado'
      };
    });
    
    return result.sort((a, b) => a.denominacion.localeCompare(b.denominacion));
  };

  const processInventoryFile = async (file: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setCurrentFile(file);

    try {
      const sheets = await analyzeFileSheets(file);
      setSelectedSheets(sheets);
      setProcessingStep('select-sheets');
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
      setSelectedSheets(sheets);
      setProcessingStep('select-sheets');
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
      
      if (isInventory) {
        // Procesar inventario
        const inventorySheet = selectedSheets.find(s => s.selected && s.sheetType === 'inventory');
        if (inventorySheet) {
          const worksheet = workbook.Sheets[inventorySheet.name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const processedInventory = processInventoryData(jsonData, inventorySheet.columns);
          setInventory(processedInventory);
        }
      } else {
        // Procesar archivo de mantenimiento
        let frecTipoProcessed: any[] = [];
        
        selectedSheets.filter(s => s.selected).forEach(sheet => {
          const worksheet = workbook.Sheets[sheet.name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (sheet.sheetType === 'frec-tipo') {
            frecTipoProcessed = processFrecTipoData(jsonData, sheet.columns);
          }
          // Aquí podríamos procesar las otras hojas (PLANNING, ANEXO) si es necesario
        });
        
        setFrecTipoData(frecTipoProcessed);
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
      // Generar el análisis de denominaciones homogéneas
      const denominacionesAnalysis = countDenominacionesHomogeneas(inventory, frecTipoData);
      setDenominacionesData(denominacionesAnalysis);
      
      console.log('Análisis de Denominaciones Homogéneas:', denominacionesAnalysis);
      
      // Aquí irá la lógica de IA para generar el calendario
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
    setDenominacionesData([]);
    setFrecTipoData([]);
  };

  return {
    inventory,
    maintenanceCalendar,
    denominacionesData,
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
