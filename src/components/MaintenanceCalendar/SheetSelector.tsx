
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileSpreadsheet, CheckCircle, ArrowRight, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';

interface SheetInfo {
  name: string;
  selected: boolean;
  rowCount: number;
  columns: string[];
  preview: any[];
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

  React.useEffect(() => {
    const analyzeFile = async () => {
      try {
        setIsLoading(true);
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        
        const sheetInfos: SheetInfo[] = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const headers = jsonData[0] as string[] || [];
          const dataRows = jsonData.slice(1);
          const preview = dataRows.slice(0, 3); // Primeras 3 filas como preview
          
          return {
            name: sheetName,
            selected: true, // Por defecto todas seleccionadas
            rowCount: dataRows.length,
            columns: headers,
            preview
          };
        });
        
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
              <Button variant="outline" size="sm" onClick={selectAll}>
                Seleccionar Todas
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                Deseleccionar Todas
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {sheets.map((sheet) => (
              <Card key={sheet.name} className={`transition-all ${sheet.selected ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={sheet.selected}
                      onCheckedChange={() => toggleSheet(sheet.name)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {sheet.name}
                        </h3>
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
            ))}
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
                onClick={handleContinue}
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
