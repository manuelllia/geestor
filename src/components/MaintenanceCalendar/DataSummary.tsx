
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bot, Sparkles, FileSpreadsheet } from 'lucide-react';

interface SheetData {
  name: string;
  rowCount: number;
  columns: string[];
  preview: any[];
}

interface DataSummaryProps {
  sheets: SheetData[];
  onBack: () => void;
  onGenerateCalendar: () => void;
}

const DataSummary: React.FC<DataSummaryProps> = ({ sheets, onBack, onGenerateCalendar }) => {
  const totalRows = sheets.reduce((sum, sheet) => sum + sheet.rowCount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Resumen de Datos Importados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {sheets.length}
              </div>
              <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                Hojas Seleccionadas
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalRows}
              </div>
              <div className="text-sm text-green-600/70 dark:text-green-400/70">
                Total de Registros
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(sheets.flatMap(s => s.columns)).size}
              </div>
              <div className="text-sm text-purple-600/70 dark:text-purple-400/70">
                Columnas Únicas
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sheets.map((sheet, index) => (
              <Card key={sheet.name} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{sheet.name}</CardTitle>
                    <Badge variant="secondary">{sheet.rowCount} registros</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Columnas detectadas:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {sheet.columns.map((column, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {column}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {sheet.preview.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Vista previa de datos:
                        </h4>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {sheet.columns.slice(0, 6).map((column, idx) => (
                                  <TableHead key={idx} className="text-xs">
                                    {column}
                                  </TableHead>
                                ))}
                                {sheet.columns.length > 6 && (
                                  <TableHead className="text-xs">...</TableHead>
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sheet.preview.slice(0, 3).map((row: any[], rowIdx) => (
                                <TableRow key={rowIdx}>
                                  {row.slice(0, 6).map((cell, cellIdx) => (
                                    <TableCell key={cellIdx} className="text-xs max-w-32 truncate">
                                      {cell || '-'}
                                    </TableCell>
                                  ))}
                                  {row.length > 6 && (
                                    <TableCell className="text-xs">...</TableCell>
                                  )}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botón de IA para generar calendario */}
      <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">¿Listo para generar tu calendario?</h3>
          <p className="text-white/90 mb-6">
            Nuestra IA analizará los datos importados y creará un calendario de mantenimiento inteligente
          </p>
          <Button 
            onClick={onGenerateCalendar}
            size="lg"
            className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-3"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generar Calendario de Mantenimiento con IA
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a Selección de Hojas
        </Button>
      </div>
    </div>
  );
};

export default DataSummary;
