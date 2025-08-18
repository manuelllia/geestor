import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { getAvailableSheets, getSheetData, PropertyData } from '../../services/realEstateService';
import { toast } from 'sonner';

interface RealEstateTableManagerProps {
  onBack: () => void;
}

interface FieldDefinition {
  key: string;
  label: string;
  type: string;
  options?: string[];
}

const RealEstateTableManager: React.FC<RealEstateTableManagerProps> = ({ onBack }) => {
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [tableData, setTableData] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PropertyData | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadAvailableSheets();
  }, []);

  useEffect(() => {
    if (selectedSheet) {
      loadTableData();
    }
  }, [selectedSheet]);

  const loadAvailableSheets = async () => {
    try {
      const sheets = await getAvailableSheets();
      setAvailableSheets(sheets);
      if (sheets.length > 0) {
        setSelectedSheet(sheets[0]);
      }
    } catch (error) {
      console.error('Error loading sheets:', error);
      toast.error('Error al cargar las hojas disponibles');
    }
  };

  const loadTableData = async () => {
    if (!selectedSheet) return;
    
    setLoading(true);
    try {
      const data = await getSheetData(selectedSheet);
      setTableData(data);
    } catch (error) {
      console.error('Error loading table data:', error);
      toast.error('Error al cargar los datos de la tabla');
    } finally {
      setLoading(false);
    }
  };

  const getTableColumns = (): string[] => {
    if (tableData.length === 0) return [];
    
    const firstRecord = tableData[0];
    return Object.keys(firstRecord).filter(key => 
      key !== 'id' && 
      key !== 'createdAt' && 
      key !== 'updatedAt' && 
      key !== 'originalSheet'
    );
  };

  const getFieldsForSheet = (sheetName: string): FieldDefinition[] => {
    switch (sheetName) {
      case 'PISOS ACTIVOS':
        return [
          { key: 'DIRECCION', label: 'Dirección', type: 'text' },
          { key: 'CIUDAD', label: 'Ciudad', type: 'text' },
          { key: 'PROVINCIA', label: 'Provincia', type: 'text' },
          { key: 'HABIT', label: 'Habitaciones', type: 'text' },
          { key: 'COSTE ANUAL', label: 'Coste Anual', type: 'number' },
          { key: 'ESTADO', label: 'Estado', type: 'select', options: ['Activo', 'Mantenimiento', 'Reservado'] }
        ];
      case 'BAJA PISOS':
        return [
          { key: 'DIRECCION', label: 'Dirección', type: 'text' },
          { key: 'CIUDAD', label: 'Ciudad', type: 'text' },
          { key: 'PROVINCIA', label: 'Provincia', type: 'text' },
          { key: 'FECHA_BAJA', label: 'Fecha de Baja', type: 'date' },
          { key: 'MOTIVO', label: 'Motivo', type: 'select', options: ['Venta', 'Rescisión contrato', 'Problemas técnicos', 'Otros'] }
        ];
      default:
        return [
          { key: 'DESCRIPCION', label: 'Descripción', type: 'text' },
          { key: 'VALOR', label: 'Valor', type: 'text' }
        ];
    }
  };

  const handleCreate = () => {
    const fields = getFieldsForSheet(selectedSheet);
    const initialData: { [key: string]: string } = {};
    fields.forEach(field => {
      initialData[field.key] = '';
    });
    setFormData(initialData);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (record: PropertyData) => {
    setEditingRecord(record);
    const fields = getFieldsForSheet(selectedSheet);
    const editData: { [key: string]: string } = {};
    fields.forEach(field => {
      editData[field.key] = String(record[field.key] || '');
    });
    setFormData(editData);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (recordId: string) => {
    try {
      // Aquí implementarías la lógica de eliminación
      console.log('Eliminando registro:', recordId);
      setTableData(prev => prev.filter(item => item.id !== recordId));
      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Error al eliminar el registro');
    }
  };

  const handleSaveRecord = async () => {
    try {
      // Aquí implementarías la lógica de guardado
      if (editingRecord) {
        // Actualizar registro existente
        setTableData(prev => prev.map(item => 
          item.id === editingRecord.id 
            ? { ...item, ...formData, updatedAt: new Date() }
            : item
        ));
        toast.success('Registro actualizado correctamente');
      } else {
        // Crear nuevo registro
        const newRecord = {
          id: `new_${Date.now()}`,
          ...formData,
          originalSheet: selectedSheet,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setTableData(prev => [...prev, newRecord]);
        toast.success('Registro creado correctamente');
      }
      
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setEditingRecord(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Error al guardar el registro');
    }
  };

  const renderFormField = (field: FieldDefinition) => {
    switch (field.type) {
      case 'select':
        return (
          <Select value={formData[field.key]} onValueChange={(value) => setFormData(prev => ({ ...prev, [field.key]: value }))}>
            <SelectTrigger>
              <SelectValue placeholder={`Seleccionar ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={formData[field.key]}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
            placeholder={field.label}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={formData[field.key]}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={formData[field.key]}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
            placeholder={field.label}
          />
        );
    }
  };

  const columns = getTableColumns();
  const fields = getFieldsForSheet(selectedSheet);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              Gestión de Tablas
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Administra los registros de inmuebles
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!selectedSheet}
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Registro
        </Button>
      </div>

      {/* Sheet Selector */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Seleccionar Tabla
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSheet} onValueChange={setSelectedSheet}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una tabla" />
            </SelectTrigger>
            <SelectContent>
              {availableSheets.map(sheet => (
                <SelectItem key={sheet} value={sheet}>{sheet}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Data Table */}
      {selectedSheet && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-800 dark:text-blue-200">
                {selectedSheet}
              </CardTitle>
              <Badge variant="secondary">
                {tableData.length} registros
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map(column => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                      <TableHead className="w-[120px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((record) => (
                      <TableRow key={record.id}>
                        {columns.map(column => (
                          <TableCell key={column}>
                            {record[column] ? String(record[column]) : '-'}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(record)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. El registro será eliminado permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(record.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Registro - {selectedSheet}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map(field => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                {renderFormField(field)}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRecord}>
              Crear Registro
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Registro - {selectedSheet}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map(field => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                {renderFormField(field)}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRecord}>
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RealEstateTableManager;
