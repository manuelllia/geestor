
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Language } from '../../utils/translations';
import { importEmployeeAgreements, EmployeeAgreementRecord } from '../../services/employeeAgreementsService';
import * as XLSX from 'xlsx';

interface ImportEmployeeAgreementsModalProps {
  open: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
  language?: Language;
}

const ImportEmployeeAgreementsModal: React.FC<ImportEmployeeAgreementsModalProps> = ({
  open,
  onClose,
  onImportSuccess,
  language
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setUploadProgress(50);

      const employeeAgreements: Partial<EmployeeAgreementRecord>[] = jsonData.map((row: any) => ({
        employeeName: row['Nombre Empleado'] || row['Employee Name'] || '',
        employeeLastName: row['Apellidos Empleado'] || row['Employee Last Name'] || '',
        agreementType: row['Tipo Acuerdo'] || row['Agreement Type'] || '',
        priority: row['Prioridad'] || row['Priority'] || 'Media',
        status: row['Estado'] || row['Status'] || 'Pendiente',
        agreementDate: row['Fecha Acuerdo'] ? new Date(row['Fecha Acuerdo']) : null,
        description: row['Descripcion'] || row['Description'] || '',
        terms: row['Terminos'] || row['Terms'] || '',
        department: row['Departamento'] || row['Department'] || '',
        position: row['Puesto'] || row['Position'] || '',
        supervisor: row['Supervisor'] || row['Supervisor'] || '',
        effectiveDate: row['Fecha Efectiva'] ? new Date(row['Fecha Efectiva']) : undefined,
        expirationDate: row['Fecha Expiracion'] ? new Date(row['Fecha Expiracion']) : undefined,
        observations: row['Observaciones'] || row['Observations'] || '',
      }));

      setUploadProgress(75);

      const results = await importEmployeeAgreements(employeeAgreements);
      setImportResults(results);
      setUploadProgress(100);

      if (results.success > 0) {
        toast({
          title: "Importación completada",
          description: `Se importaron ${results.success} acuerdos correctamente.`,
        });
        
        if (onImportSuccess) {
          onImportSuccess();
        }
      }

      if (results.errors.length > 0) {
        toast({
          title: "Errores en la importación",
          description: `${results.errors.length} errores encontrados. Revisa los detalles.`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error importing file:', error);
      toast({
        title: "Error de importación",
        description: "No se pudo procesar el archivo. Verifica el formato.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClose = () => {
    setImportResults(null);
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Acuerdos con Empleados
          </DialogTitle>
          <DialogDescription>
            Sube un archivo Excel (.xlsx) o CSV con los acuerdos con empleados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isUploading && !importResults && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Arrastra y suelta tu archivo aquí, o haz clic para seleccionarlo
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Seleccionar Archivo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {isUploading && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Procesando archivo...</p>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {importResults && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Importación completada</span>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>{importResults.success}</strong> acuerdos importados correctamente
                </p>
              </div>

              {importResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Errores encontrados:</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {importResults.errors.map((error, index) => (
                      <p key={index} className="text-xs text-red-700 mb-1">
                        • {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {importResults ? 'Cerrar' : 'Cancelar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportEmployeeAgreementsModal;
