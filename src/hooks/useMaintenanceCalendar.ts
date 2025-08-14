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
  codigoDenominacion?: string;
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
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
}

export const useMaintenanceCalendar = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [maintenanceCalendar, setMaintenanceCalendar] = useState<MaintenanceEvent[]>([]);
  const [denominacionesData, setDenominacionesData] = useState<DenominacionHomogeneaData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [selectedSheets, setSelectedSheets] = useState<SheetInfo[]>([]);
  const [processingStep, setProcessingStep] = useState<'upload' | 'select-sheets' | 'generate-calendar' | 'processing' | 'complete'>('upload');
  const [frecTipoData, setFrecTipoData] = useState<any[]>([]);

  const detectSheetType = (sheetName: string, columns: string[]): 'inventory' | 'frec-tipo' | 'planning' | 'anexo' | 'other' => {
    const name = sheetName.toLowerCase().trim();
    const columnNames = columns.map(col => col.toLowerCase().trim());
    
    // Detectar hoja de inventario
    if (columnNames.some(col => 
        col.includes('denominación homogénea') || 
        col.includes('denominacion homogenea') ||
        col.includes('denominacion_homogenea')
      ) && 
      (columnNames.some(col => col.includes('serie') || col.includes('modelo') || col.includes('ubicación') || col.includes('ubicacion')))) {
      return 'inventory';
    }
    
    // Detectar FREC Y TIPO
    if ((name.includes('frec') && name.includes('tipo')) || 
        name === 'frec y tipo' ||
        name === 'frecuencia y tipo' ||
        name.includes('frecuencia') ||
        (columnNames.some(col => col.includes('frecuencia')) && columnNames.some(col => col.includes('tipo')))) {
      return 'frec-tipo';
    }
    
    // Detectar PLANNING
    if (name.includes('planning') || 
        name.includes('planificacion') ||
        name === 'planning' ||
        name.includes('plan') ||
        columnNames.some(col => col.includes('fecha') && col.includes('mantenimiento'))) {
      return 'planning';
    }
    
    // Detectar ANEXO
    if (name.includes('anexo') || 
        name === 'anexo' ||
        name.includes('annex') ||
        columnNames.some(col => col.includes('anexo'))) {
      return 'anexo';
    }
    
    // Detectar hojas de ubicaciones para excluirlas
    if (name.includes('ubicacion') || 
        name.includes('ubicación') || 
        name.includes('location') ||
        columnNames.every(col => col.includes('ubicacion') || col.includes('ubicación') || col.includes('location'))) {
      return 'other';
    }
    
    return 'other';
  };

  const analyzeFileSheets = async (file: File): Promise<SheetInfo[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    
    return workbook.SheetNames.map(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = (jsonData[0] as string[]) || [];
      const dataRows = jsonData.slice(1).filter(row => Array.isArray(row) && row.length > 0);
      const preview = dataRows.slice(0, 3);
      const sheetType = detectSheetType(sheetName, headers);
      
      console.log(`Analizando hoja: ${sheetName}`, {
        headers: headers.slice(0, 5),
        sheetType,
        rowCount: dataRows.length
      });
      
      return {
        name: sheetName,
        selected: sheetType !== 'other',
        rowCount: dataRows.length,
        columns: headers,
        preview,
        sheetType
      };
    });
  };

  const processInventoryData = (jsonData: any[], headers: string[]) => {
    console.log('🔍 Procesando datos de inventario...');
    console.log('Headers disponibles:', headers);
    
    // Buscar índices de las columnas importantes - MEJORADO
    const codigoIndex = headers.findIndex(h => {
      const lower = h.toLowerCase().trim();
      return (lower.includes('código') || lower.includes('codigo')) && 
             (lower.includes('denominación') || lower.includes('denominacion')) ||
             lower === 'código denominación homogénea' ||
             lower === 'codigo denominacion homogenea' ||
             lower.includes('codigo_denominacion') ||
             lower.includes('cód') ||
             lower.includes('cod') ||
             lower === 'código' ||
             lower === 'codigo';
    });
    
    // Buscar la columna de denominación homogénea (nombre)
    let denominacionIndex = headers.findIndex(h => {
      const lower = h.toLowerCase().trim();
      return lower.includes('denominación homogénea') || 
             lower.includes('denominacion homogenea') ||
             lower.includes('denominacion_homogenea') ||
             lower === 'denominación homogénea' ||
             lower === 'denominacion homogenea';
    });
    
    // Si no encontramos la columna de denominación homogénea directamente,
    // buscar la columna que está justo a la derecha del código
    if (denominacionIndex === -1 && codigoIndex !== -1) {
      denominacionIndex = codigoIndex + 1;
      console.log('🔍 Denominación homogénea detectada en columna adyacente al código:', headers[denominacionIndex]);
    }
    
    console.log('📋 Índices mejorados encontrados:', {
      codigoIndex,
      denominacionIndex,
      codigoHeader: codigoIndex !== -1 ? headers[codigoIndex] : 'No encontrada',
      denominacionHeader: denominacionIndex !== -1 ? headers[denominacionIndex] : 'No encontrada'
    });
    
    const inventoryItems = jsonData.slice(1).map((row: any, index: number) => {
      const codigo = codigoIndex !== -1 ? String(row[codigoIndex] || '').trim() : '';
      const denominacion = denominacionIndex !== -1 ? String(row[denominacionIndex] || '').trim() : '';
      
      // Log de los primeros elementos para debugging
      if (index < 5) {
        console.log(`📝 Fila ${index + 1}:`, {
          codigo,
          denominacion,
          codigoRaw: row[codigoIndex],
          denominacionRaw: row[denominacionIndex]
        });
      }
      
      return {
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
        codigoDenominacion: codigo,
        denominacionHomogenea: denominacion
      };
    });
    
    console.log('✅ Inventario procesado:', inventoryItems.length, 'elementos');
    console.log('📊 Muestra de denominaciones:', inventoryItems.slice(0, 5).map(item => ({
      codigo: item.codigoDenominacion,
      denominacion: item.denominacionHomogenea
    })));
    
    return inventoryItems;
  };

  const processFrecTipoData = (jsonData: any[], headers: string[]) => {
    console.log('🔧 Procesando FREC Y TIPO...');
    console.log('Headers disponibles:', headers);
    
    // Buscar índices de las columnas importantes - MEJORADO para detectar mejor las columnas
    const codigoIndex = headers.findIndex(h => {
      const lower = h.toLowerCase().trim();
      return (lower.includes('código') || lower.includes('codigo')) ||
             lower === 'código' ||
             lower === 'codigo' ||
             lower === 'cód' ||
             lower === 'cod';
    });
    
    const denominacionIndex = headers.findIndex(h => {
      const lower = h.toLowerCase().trim();
      return lower.includes('denominacion') || 
             lower.includes('denominación') ||
             lower === 'denominacion' ||
             lower === 'denominación' ||
             lower.includes('nombre') ||
             lower.includes('descripcion') ||
             lower.includes('descripción');
    });
    
    const tipoIndex = headers.findIndex(h => {
      const lower = h.toLowerCase().trim();
      return lower.includes('tipo de mantenimiento habitual') ||
             lower.includes('tipo_mantenimiento_habitual') ||
             lower.includes('tipo mantenimiento') ||
             lower.includes('tipo_mantenimiento') ||
             (lower.includes('tipo') && lower.includes('mantenimiento')) ||
             lower === 'tipo';
    });
    
    const cadenciaIndex = headers.findIndex(h => {
      const lower = h.toLowerCase().trim();
      return lower.includes('cadencia') ||
             lower.includes('frecuencia') ||
             lower === 'cadencia' ||
             lower === 'frecuencia' ||
             lower.includes('periodo') ||
             lower.includes('periodicidad');
    });
    
    console.log('🎯 Índices FREC Y TIPO mejorados:', {
      codigoIndex,
      denominacionIndex,
      tipoIndex,
      cadenciaIndex,
      codigoHeader: codigoIndex !== -1 ? headers[codigoIndex] : 'No encontrada',
      denominacionHeader: denominacionIndex !== -1 ? headers[denominacionIndex] : 'No encontrada',
      tipoHeader: tipoIndex !== -1 ? headers[tipoIndex] : 'No encontrada',
      cadenciaHeader: cadenciaIndex !== -1 ? headers[cadenciaIndex] : 'No encontrada'
    });
    
    const frecTipoItems = jsonData.slice(1).map((row: any, index) => {
      const codigo = codigoIndex !== -1 ? String(row[codigoIndex] || '').trim() : '';
      const denominacion = denominacionIndex !== -1 ? String(row[denominacionIndex] || '').trim() : '';
      const tipo = tipoIndex !== -1 ? String(row[tipoIndex] || '').trim() : '';
      const cadencia = cadenciaIndex !== -1 ? String(row[cadenciaIndex] || '').trim() : '';
      
      const item = {
        codigo,
        denominacion,
        tipo,
        cadencia
      };
      
      if (index < 5) {
        console.log(`📝 FREC Y TIPO Fila ${index + 1}:`, item);
      }
      
      return item;
    }).filter(item => (item.codigo || item.denominacion) && item.denominacion.length > 0);
    
    console.log('✅ FREC Y TIPO procesado:', frecTipoItems.length, 'elementos válidos');
    return frecTipoItems;
  };

  const processPlanningData = (jsonData: any[], headers: string[]) => {
    console.log('📅 Procesando PLANNING:', { headers, dataCount: jsonData.length });
    return jsonData.slice(1).filter(row => Array.isArray(row) && row.length > 0);
  };

  const processAnexoData = (jsonData: any[], headers: string[]) => {
    console.log('📎 Procesando ANEXO:', { headers, dataCount: jsonData.length });
    return jsonData.slice(1).filter(row => Array.isArray(row) && row.length > 0);
  };

  const enhanceDenominacionesWithAI = async (inventoryData: InventoryItem[]): Promise<DenominacionHomogeneaData[]> => {
    console.log('🤖 Mejorando detección de denominaciones homogéneas con IA...');
    
    try {
      const equipmentList = inventoryData.map(item => ({
        equipment: item.equipment,
        model: item.model,
        denominacion: item.denominacionHomogenea,
        codigo: item.codigoDenominacion
      })).filter(item => item.equipment);

      const prompt = `
Eres un experto en gestión de equipos médicos y mantenimiento hospitalario. Analiza la siguiente lista de equipos y ayúdame a agruparlos por denominaciones homogéneas para crear un plan de mantenimiento eficiente.

EQUIPOS A ANALIZAR:
${JSON.stringify(equipmentList, null, 2)}

TAREA:
1. Identifica y agrupa equipos similares que requieran el mismo tipo de mantenimiento
2. Crea denominaciones homogéneas claras y descriptivas 
3. Asigna códigos únicos para cada denominación (formato: GEE-001, GEE-002, etc.)
4. Sugiere frecuencias de mantenimiento típicas para cada grupo
5. Propón tipos de mantenimiento (preventivo, correctivo, calibración, etc.)

RESPUESTA REQUERIDA:
Proporciona un JSON con la siguiente estructura:
{
  "denominacionesHomogeneas": [
    {
      "codigo": "GEE-001",
      "denominacion": "VENTILADOR MECÁNICO",
      "equiposIncluidos": ["equipo1", "equipo2"],
      "cantidad": numero_total,
      "frecuenciaSugerida": "mensual|trimestral|semestral|anual",
      "tipoMantenimiento": "descripción del tipo de mantenimiento"
    }
  ]
}

Responde ÚNICAMENTE con el JSON, sin explicaciones adicionales.
`;

      const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
      const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
            responseMimeType: "application/json"
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Error de Gemini API: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      let cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const aiResult = JSON.parse(cleanedResponse);
      
      if (aiResult.denominacionesHomogeneas) {
        return aiResult.denominacionesHomogeneas.map((item: any) => ({
          codigo: item.codigo,
          denominacion: item.denominacion,
          cantidad: item.cantidad,
          frecuencia: item.frecuenciaSugerida,
          tipoMantenimiento: item.tipoMantenimiento
        }));
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error mejorando denominaciones con IA:', error);
      return [];
    }
  };

  const countDenominacionesHomogeneas = async (inventoryData: InventoryItem[], frecTipoData: any[]) => {
    console.log('🔍 Analizando denominaciones homogéneas MEJORADO...');
    console.log('📊 Datos del inventario:', inventoryData.length, 'elementos');
    console.log('📊 Datos FREC Y TIPO:', frecTipoData.length, 'elementos');
    
    // Agrupar por código Y denominación del inventario - MEJORADO
    const denominacionGroups: { [key: string]: { codigo: string, denominacion: string, cantidad: number } } = {};
    
    inventoryData.forEach(item => {
      if (item.denominacionHomogenea && item.denominacionHomogenea.trim()) {
        const denominacion = item.denominacionHomogenea.trim().toUpperCase();
        const codigo = item.codigoDenominacion?.trim() || 'SIN-CODIGO';
        
        // Usar denominación como clave principal, código como secundario
        const key = denominacion;
        
        if (!denominacionGroups[key]) {
          denominacionGroups[key] = {
            codigo,
            denominacion,
            cantidad: 0
          };
        }
        denominacionGroups[key].cantidad += 1;
        
        // Actualizar el código si encontramos uno mejor (no vacío)
        if (!denominacionGroups[key].codigo || denominacionGroups[key].codigo === 'SIN-CODIGO') {
          if (codigo && codigo !== 'SIN-CODIGO') {
            denominacionGroups[key].codigo = codigo;
          }
        }
      }
    });
    
    console.log('📋 Grupos de denominaciones encontrados:', Object.keys(denominacionGroups).length);
    console.log('📋 Grupos detallados:', Object.values(denominacionGroups).slice(0, 5));
    
    // Si no hay denominaciones homogéneas detectadas automáticamente, usar IA
    if (Object.keys(denominacionGroups).length === 0) {
      console.log('🤖 No se detectaron denominaciones homogéneas, usando IA para análisis...');
      const aiDenominaciones = await enhanceDenominacionesWithAI(inventoryData);
      return aiDenominaciones;
    }
    
    // Crear array con datos combinados, incluyendo TODAS las coincidencias de FREC Y TIPO
    const result: DenominacionHomogeneaData[] = [];
    
    Object.values(denominacionGroups).forEach(group => {
      // Buscar TODAS las coincidencias en FREC Y TIPO para esta denominación - MEJORADO
      const matches = frecTipoData.filter(frecItem => {
        const frecDenominacion = frecItem.denominacion.toLowerCase().trim();
        const frecCodigo = frecItem.codigo ? frecItem.codigo.toLowerCase().trim() : '';
        const inventoryDenominacion = group.denominacion.toLowerCase().trim();
        const inventoryCodigo = group.codigo.toLowerCase().trim();
        
        // Matching por código exacto (prioridad alta)
        if (frecCodigo && inventoryCodigo && frecCodigo === inventoryCodigo) {
          return true;
        }
        
        // Matching por denominación exacta
        if (frecDenominacion === inventoryDenominacion) {
          return true;
        }
        
        // Matching por inclusión
        if (frecDenominacion.includes(inventoryDenominacion) || 
            inventoryDenominacion.includes(frecDenominacion)) {
          return true;
        }
        
        // Matching por palabras clave (mejorado)
        const frecWords = frecDenominacion.split(/\s+/).filter(word => word.length > 3);
        const inventoryWords = inventoryDenominacion.split(/\s+/).filter(word => word.length > 3);
        
        const hasCommonWords = frecWords.some(word => 
          inventoryWords.some(invWord => 
            word.includes(invWord) || invWord.includes(word)
          )
        );
        
        return hasCommonWords;
      });
      
      console.log(`🔍 Para "${group.denominacion}" (${group.codigo}) encontradas ${matches.length} coincidencias en FREC Y TIPO`);
      
      if (matches.length > 0) {
        // Crear una entrada por cada tipo de mantenimiento encontrado
        matches.forEach((match, index) => {
          result.push({
            codigo: group.codigo,
            denominacion: group.denominacion,
            cantidad: group.cantidad,
            frecuencia: match.cadencia || 'No especificada',
            tipoMantenimiento: match.tipo || 'No especificado'
          });
          
          if (index < 2) {
            console.log(`✅ Match ${index + 1}:`, {
              codigo: group.codigo,
              denominacion: group.denominacion,
              frecuencia: match.cadencia,
              tipo: match.tipo,
              matchedWith: match.denominacion || match.codigo
            });
          }
        });
      } else {
        // Si no se encuentra en FREC Y TIPO, crear entrada con datos por defecto
        result.push({
          codigo: group.codigo,
          denominacion: group.denominacion,
          cantidad: group.cantidad,
          frecuencia: 'No especificada',
          tipoMantenimiento: 'No especificado'
        });
        
        console.log(`⚠️ Sin matches para "${group.denominacion}" (${group.codigo})`);
      }
    });
    
    console.log('✅ Análisis completo MEJORADO:', result.length, 'entradas generadas');
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
          console.log('Procesando hoja de inventario:', inventorySheet.name);
          const worksheet = workbook.Sheets[inventorySheet.name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const processedInventory = processInventoryData(jsonData, inventorySheet.columns);
          setInventory(processedInventory);
          console.log('Inventario procesado:', processedInventory.length, 'elementos');
        }
      } else {
        // Procesar archivo de mantenimiento
        let frecTipoProcessed: any[] = [];
        let planningProcessed: any[] = [];
        let anexoProcessed: any[] = [];
        
        selectedSheets.filter(s => s.selected).forEach(sheet => {
          console.log('Procesando hoja:', sheet.name, 'tipo:', sheet.sheetType);
          const worksheet = workbook.Sheets[sheet.name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          switch (sheet.sheetType) {
            case 'frec-tipo':
              frecTipoProcessed = processFrecTipoData(jsonData, sheet.columns);
              break;
            case 'planning':
              planningProcessed = processPlanningData(jsonData, sheet.columns);
              break;
            case 'anexo':
              anexoProcessed = processAnexoData(jsonData, sheet.columns);
              break;
          }
        });
        
        setFrecTipoData(frecTipoProcessed);
        console.log('Datos de mantenimiento procesados:', {
          frecTipo: frecTipoProcessed.length,
          planning: planningProcessed.length,
          anexo: anexoProcessed.length
        });
      }

      setProcessingStep('generate-calendar');
    } catch (err) {
      setError('Error al procesar las hojas seleccionadas');
      console.error('Error processing selected sheets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAICalendar = async () => {
    setIsLoading(true);
    setProcessingStep('processing');
    try {
      // Generar el análisis de denominaciones homogéneas (ahora con matching mejorado)
      console.log('🤖 Analizando denominaciones homogéneas con matching mejorado...');
      const denominacionesAnalysis = await countDenominacionesHomogeneas(inventory, frecTipoData);
      setDenominacionesData(denominacionesAnalysis);
      
      console.log('✅ Análisis de Denominaciones Homogéneas completado:', denominacionesAnalysis);
      
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
    frecTipoData,
    processInventoryFile,
    processMaintenanceFile,
    processFinalSheets,
    generateAICalendar,
    resetProcess,
    setSelectedSheets,
    setProcessingStep
  };
};
