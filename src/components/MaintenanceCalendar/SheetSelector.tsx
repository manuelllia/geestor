import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileSpreadsheet, CheckCircle, ArrowRight, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';

interface SheetInfo {
  name: string;
  selected: boolean;
  rowCount: number;
  columns: string[];
  preview: any[];
  sheetType?: 'inventory' | 'frec-tipo' | 'planning' | 'anexo' | 'other';
}

interface SheetSelectorProps {
  file: File;
  onSheetsSelected: (selectedSheets: SheetInfo[]) => void;
  onBack: () => void;
}

const SheetSelector: React.FC<SheetSelectorProps> = ({ file, onSheetsSelected, onBack }) => {
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    
    // Detectar FREC Y TIPO - mejorado
    if ((name.includes('frec') && name.includes('tipo')) || 
        name === 'frec y tipo' ||
        name === 'frecuencia y tipo' ||
        name.includes('frecuencia') ||
        (columnNames.some(col => col.includes('frecuencia')) && columnNames.some(col => col.includes('tipo')))) {
      return 'frec-tipo';
    }
    
    // Detectar PLANNING - mejorado  
    if (name.includes('planning') || 
        name.includes('planificacion') ||
        name === 'planning' ||
        name.includes('plan') ||
        columnNames.some(col => col.includes('fecha') && col.includes('mantenimiento'))) {
      return 'planning';
    }
    
    // Detectar ANEXO - mejorado
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

  const getSheetTypeLabel = (sheetType: string) => {
    switch (sheetType) {
      case 'inventory':
        return { label: 'Inventario', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' };
      case 'frec-tipo':
        return { label: 'Frecuencia y Tipo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' };
      case 'planning':
        return { label: 'Planificación', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' };
      case 'anexo':
        return { label: 'Anexo', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' };
      default:
        return { label: 'Otra', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' };
    }
  };

  React.useEffect(() => {
    const analyzeFile = async () => {
      try {
        setIsLoading(true);
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        
        const sheetInfos: SheetInfo[] = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const headers = (jsonData[0] as string[]) || [];
          const dataRows = jsonData.slice(1).filter(row => Array.isArray(row) && row.length > 0);
          const preview = dataRows.slice(0, 3);
          const sheetType = detectSheetType(sheetName, headers);
          
          console.log(`Detectando hoja: ${sheetName}`, {
            columns: headers.slice(0, 5),
            detectedType: sheetType,
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
        
        console.log('Hojas detectadas:', sheetInfos.map(s => ({ name: s.name, type: s.sheetType, selected: s.selected })));
        setSheets(sheetInfos);
      } catch (err) {
        setError('Error al analizar el archivo Excel');
        console.error('Error analyzing file:', err);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeFile();
  }, [file]);

  const toggleSheet = (sheetName: string) => {
    setSheets(prev => prev.map(sheet => 
      sheet.name === sheetName 
        ? { ...sheet, selected: !sheet.selected }
        : sheet
    ));
  };

  const selectAll = () => {
    setSheets(prev => prev.map(sheet => ({ ...sheet, selected: true })));
  };

  const deselectAll = () => {
    setSheets(prev => prev.map(sheet => ({ ...sheet, selected: false })));
  };

  const handleContinue = () => {
    const selectedSheets = sheets.filter(sheet => sheet.selected);
    if (selectedSheets.length > 0) {
      onSheetsSelected(selectedSheets);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-300">Analizando hojas del archivo...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <AlertDescription className="text-red-700 dark:text-red-300">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  const selectedCount = sheets.filter(sheet => sheet.selected).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Seleccionar Hojas a Importar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="font-medium truncate max-w-64">{file.name}</span>
              <span>({sheets.length} hojas detectadas)</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSheets(prev => prev.map(sheet => ({ ...sheet, selected: true })))}>
                Seleccionar Todas
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSheets(prev => prev.map(sheet => ({ ...sheet, selected: false })))}>
                Deseleccionar Todas
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {sheets.map((sheet) => {
              const typeInfo = getSheetTypeLabel(sheet.sheetType || 'other');
              return (
                <Card key={sheet.name} className={`transition-all ${sheet.selected ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={sheet.selected}
                        onCheckedChange={() => setSheets(prev => prev.map(s => s.name === sheet.name ? { ...s, selected: !s.selected } : s))}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {sheet.name}
                          </h3>
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                            {sheet.rowCount} filas
                          </span>
                        </div>
                        
                        {sheet.columns.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Columnas: {sheet.columns.join(', ')}
                            </p>
                            
                            {sheet.preview.length > 0 && (
                              <div className="text-xs">
                                <p className="text-gray-500 dark:text-gray-400 mb-1">Vista previa:</p>
                                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-gray-600 dark:text-gray-300 max-h-20 overflow-hidden">
                                  {sheet.preview.slice(0, 2).map((row: any[], idx) => (
                                    <div key={idx} className="truncate">
                                      {Array.isArray(row) ? row.join(' | ') : JSON.stringify(row)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCount} de {sheets.length} hojas seleccionadas
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack}>
                Volver
              </Button>
              <Button 
                onClick={() => {
                  const selectedSheets = sheets.filter(sheet => sheet.selected);
                  if (selectedSheets.length > 0) {
                    onSheetsSelected(selectedSheets);
                  }
                }}
                disabled={selectedCount === 0}
                className="flex items-center gap-2"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SheetSelector;
