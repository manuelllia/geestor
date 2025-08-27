import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Clock, Wrench, Plus, Edit, Trash2, CheckCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { useMaintenanceSuggestions } from '../../hooks/useMaintenanceSuggestions';
import SuggestionsReviewModal from './SuggestionsReviewModal';

interface MaintenanceTask {
  id: string;
  tipoMantenimiento: string;
  frecuencia: string;
  tiempo: string;
}

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
  maintenanceTasks?: MaintenanceTask[];
}

interface EditableDenominationsFormProps {
  language: Language;
  initialData: DenominacionHomogeneaData[];
  onDataUpdate: (updatedData: DenominacionHomogeneaData[]) => void;
}

const EditableDenominationsForm: React.FC<EditableDenominationsFormProps> = ({ language, initialData, onDataUpdate }) => {
  const { t } = useTranslation(language);
  const [data, setData] = useState<DenominacionHomogeneaData[]>(initialData);
  const [isAdding, setIsAdding] = useState(false);
  const [newDenominacion, setNewDenominacion] = useState<Omit<DenominacionHomogeneaData, 'codigo' | 'maintenanceTasks'>>({
    denominacion: '',
    cantidad: 1,
    frecuencia: 'Mensual',
    tipoMantenimiento: 'Preventivo',
    tiempo: '2'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDenominacion, setEditedDenominacion] = useState<Omit<DenominacionHomogeneaData, 'codigo' | 'maintenanceTasks'>>({
    denominacion: '',
    cantidad: 1,
    frecuencia: 'Mensual',
    tipoMantenimiento: 'Preventivo',
    tiempo: '2'
  });
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedDenominacion, setSelectedDenominacion] = useState<DenominacionHomogeneaData | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const { suggestions, isLoading: isLoadingSuggestions, error: suggestionsError, fetchSuggestions } = useMaintenanceSuggestions();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleInputChange = (index: number, field: keyof DenominacionHomogeneaData, value: any) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const handleNewInputChange = (field: keyof Omit<DenominacionHomogeneaData, 'codigo' | 'maintenanceTasks'>, value: any) => {
    setNewDenominacion({ ...newDenominacion, [field]: value });
  };

  const handleAddDenominacion = () => {
    setIsAdding(true);
  };

  const handleSaveNewDenominacion = () => {
    const newCode = Math.random().toString(36).substring(7);
    const newTask = { ...newDenominacion, codigo: newCode };
    setData([...data, newTask]);
    setNewDenominacion({
      denominacion: '',
      cantidad: 1,
      frecuencia: 'Mensual',
      tipoMantenimiento: 'Preventivo',
      tiempo: '2'
    });
    setIsAdding(false);
  };

  const handleCancelNewDenominacion = () => {
    setIsAdding(false);
    setNewDenominacion({
      denominacion: '',
      cantidad: 1,
      frecuencia: 'Mensual',
      tipoMantenimiento: 'Preventivo',
      tiempo: '2'
    });
  };

  const handleEditDenominacion = (id: string) => {
    const denominacionToEdit = data.find(item => item.codigo === id);
    if (denominacionToEdit) {
      setEditingId(id);
      setEditedDenominacion({
        denominacion: denominacionToEdit.denominacion,
        cantidad: denominacionToEdit.cantidad,
        frecuencia: denominacionToEdit.frecuencia,
        tipoMantenimiento: denominacionToEdit.tipoMantenimiento,
        tiempo: denominacionToEdit.tiempo || '2'
      });
    }
  };

  const handleEditedInputChange = (field: keyof Omit<DenominacionHomogeneaData, 'codigo' | 'maintenanceTasks'>, value: any) => {
    setEditedDenominacion({ ...editedDenominacion, [field]: value });
  };

  const handleSaveEditedDenominacion = () => {
    const newData = data.map(item => {
      if (item.codigo === editingId) {
        return { ...item, ...editedDenominacion };
      }
      return item;
    });
    setData(newData);
    setEditingId(null);
  };

  const handleCancelEditDenominacion = () => {
    setEditingId(null);
  };

  const handleDeleteDenominacion = (id: string) => {
    const newData = data.filter(item => item.codigo !== id);
    setData(newData);
  };

  const handleOpenMaintenanceModal = (denominacion: DenominacionHomogeneaData) => {
    setSelectedDenominacion(denominacion);
    setIsMaintenanceModalOpen(true);
  };

  const handleCloseMaintenanceModal = () => {
    setSelectedDenominacion(null);
    setIsMaintenanceModalOpen(false);
  };

  const handleAddMaintenanceTask = (newTask: MaintenanceTask) => {
    if (!selectedDenominacion) return;
  
    const updatedDenominacion = {
      ...selectedDenominacion,
      maintenanceTasks: [...(selectedDenominacion.maintenanceTasks || []), newTask],
    };
  
    const updatedData = data.map(item =>
      item.codigo === selectedDenominacion.codigo ? updatedDenominacion : item
    );
  
    setData(updatedData);
    setSelectedDenominacion(updatedDenominacion);
  };

  const handleDeleteMaintenanceTask = (taskId: string) => {
    if (!selectedDenominacion) return;

    const updatedTasks = selectedDenominacion.maintenanceTasks?.filter(task => task.id !== taskId) || [];
    const updatedDenominacion = {
      ...selectedDenominacion,
      maintenanceTasks: updatedTasks,
    };

    const updatedData = data.map(item =>
      item.codigo === selectedDenominacion.codigo ? updatedDenominacion : item
    );

    setData(updatedData);
    setSelectedDenominacion(updatedDenominacion);
  };

  useEffect(() => {
    onDataUpdate(data);
  }, [data, onDataUpdate]);

  const handleOpenSuggestions = async (denominacion: DenominacionHomogeneaData) => {
    setSelectedDenominacion(denominacion);
    await fetchSuggestions(denominacion.denominacion);
    setIsSuggestionsOpen(true);
  };

  const handleCloseSuggestions = () => {
    setIsSuggestionsOpen(false);
  };

  const handleApplySuggestions = (selectedSuggestions: any[]) => {
    if (!selectedDenominacion) return;
  
    // Mapea las sugerencias seleccionadas al formato de MaintenanceTask
    const newTasks = selectedSuggestions.map(suggestion => ({
      id: Math.random().toString(36).substring(7), // Genera un ID único
      tipoMantenimiento: suggestion.tipoMantenimiento,
      frecuencia: suggestion.frecuencia,
      tiempo: suggestion.tiempoEstimado,
    }));
  
    // Combina las nuevas tareas con las existentes
    const updatedTasks = [...(selectedDenominacion.maintenanceTasks || []), ...newTasks];
  
    // Actualiza la denominación con las nuevas tareas
    const updatedDenominacion = {
      ...selectedDenominacion,
      maintenanceTasks: updatedTasks,
    };
  
    // Actualiza el estado local con la denominación actualizada
    const updatedData = data.map(item =>
      item.codigo === selectedDenominacion.codigo ? updatedDenominacion : item
    );
  
    setData(updatedData);
    setSelectedDenominacion(updatedDenominacion);
    setIsSuggestionsOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Denominaciones Homogéneas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Denominación</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Frecuencia</th>
                <th className="px-4 py-2">Tipo Mantenimiento</th>
                <th className="px-4 py-2">Tiempo (Horas)</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.codigo}>
                  <td className="border px-4 py-2">
                    {editingId === item.codigo ? (
                      <Input
                        type="text"
                        value={editedDenominacion.denominacion}
                        onChange={(e) => handleEditedInputChange('denominacion', e.target.value)}
                      />
                    ) : (
                      item.denominacion
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === item.codigo ? (
                      <Input
                        type="number"
                        value={editedDenominacion.cantidad}
                        onChange={(e) => handleEditedInputChange('cantidad', parseInt(e.target.value))}
                      />
                    ) : (
                      item.cantidad
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === item.codigo ? (
                      <Select value={editedDenominacion.frecuencia} onValueChange={(value) => handleEditedInputChange('frecuencia', value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diario">Diario</SelectItem>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                          <SelectItem value="Quincenal">Quincenal</SelectItem>
                          <SelectItem value="Mensual">Mensual</SelectItem>
                          <SelectItem value="Bimensual">Bimensual</SelectItem>
                          <SelectItem value="Trimestral">Trimestral</SelectItem>
                          <SelectItem value="Semestral">Semestral</SelectItem>
                          <SelectItem value="Anual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      item.frecuencia
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === item.codigo ? (
                      <Select value={editedDenominacion.tipoMantenimiento} onValueChange={(value) => handleEditedInputChange('tipoMantenimiento', value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Preventivo">Preventivo</SelectItem>
                          <SelectItem value="Correctivo">Correctivo</SelectItem>
                          <SelectItem value="Predictivo">Predictivo</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      item.tipoMantenimiento
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === item.codigo ? (
                      <Input
                        type="number"
                        value={editedDenominacion.tiempo}
                        onChange={(e) => handleEditedInputChange('tiempo', e.target.value)}
                      />
                    ) : (
                      item.tiempo
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === item.codigo ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleSaveEditedDenominacion}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEditDenominacion}>
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditDenominacion(item.codigo)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteDenominacion(item.codigo)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Borrar
                        </Button>
                        <Button size="sm" onClick={() => handleOpenMaintenanceModal(item)}>
                          <Wrench className="h-4 w-4 mr-2" />
                          Mantenimientos
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleOpenSuggestions(item)}>
                          <Sparkles className="h-4 w-4 mr-2" />
                          IA Sugerencias
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isAdding ? (
          <div className="mt-4 p-4 border rounded-md">
            <h4 className="text-lg font-semibold mb-2">Añadir Nueva Denominación</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="denominacion">Denominación</Label>
                <Input
                  type="text"
                  id="denominacion"
                  value={newDenominacion.denominacion}
                  onChange={(e) => handleNewInputChange('denominacion', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  type="number"
                  id="cantidad"
                  value={newDenominacion.cantidad}
                  onChange={(e) => handleNewInputChange('cantidad', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="frecuencia">Frecuencia</Label>
                <Select value={newDenominacion.frecuencia} onValueChange={(value) => handleNewInputChange('frecuencia', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diario">Diario</SelectItem>
                    <SelectItem value="Semanal">Semanal</SelectItem>
                    <SelectItem value="Quincenal">Quincenal</SelectItem>
                    <SelectItem value="Mensual">Mensual</SelectItem>
                    <SelectItem value="Bimensual">Bimensual</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Semestral">Semestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipoMantenimiento">Tipo Mantenimiento</Label>
                <Select value={newDenominacion.tipoMantenimiento} onValueChange={(value) => handleNewInputChange('tipoMantenimiento', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventivo">Preventivo</SelectItem>
                    <SelectItem value="Correctivo">Correctivo</SelectItem>
                    <SelectItem value="Predictivo">Predictivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tiempo">Tiempo (Horas)</Label>
                <Input
                  type="number"
                  id="tiempo"
                  value={newDenominacion.tiempo}
                  onChange={(e) => handleNewInputChange('tiempo', e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={handleSaveNewDenominacion}>
                Guardar
              </Button>
              <Button variant="ghost" onClick={handleCancelNewDenominacion}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" className="mt-4" onClick={handleAddDenominacion}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir Denominación
          </Button>
        )}
      </CardContent>

      <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mantenimientos para {selectedDenominacion?.denominacion}</DialogTitle>
          </DialogHeader>
          {selectedDenominacion && (
            <MaintenanceTasksList
              language={language}
              tasks={selectedDenominacion.maintenanceTasks || []}
              onAddTask={handleAddMaintenanceTask}
              onDeleteTask={handleDeleteMaintenanceTask}
            />
          )}
          <Button variant="outline" className="mt-4" onClick={handleCloseMaintenanceModal}>
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuggestionsOpen} onOpenChange={setIsSuggestionsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('suggestionsReviewTitle')}
            </DialogTitle>
          </DialogHeader>
          {isLoadingSuggestions ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : suggestionsError ? (
            <div className="text-red-500">Error: {suggestionsError}</div>
          ) : (
            <SuggestionsReviewModal
              language={language}
              suggestions={suggestions}
              denominaciones={data}
              onApply={handleApplySuggestions}
              onClose={handleCloseSuggestions}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

interface MaintenanceTasksListProps {
  language: Language;
  tasks: MaintenanceTask[];
  onAddTask: (task: MaintenanceTask) => void;
  onDeleteTask: (taskId: string) => void;
}

const MaintenanceTasksList: React.FC<MaintenanceTasksListProps> = ({ language, tasks, onAddTask, onDeleteTask }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Omit<MaintenanceTask, 'id'>>({
    tipoMantenimiento: 'Preventivo',
    frecuencia: 'Mensual',
    tiempo: '2'
  });

  const handleNewTaskInputChange = (field: keyof Omit<MaintenanceTask, 'id'>, value: any) => {
    setNewTask({ ...newTask, [field]: value });
  };

  const handleAddTask = () => {
    setIsAddingTask(true);
  };

  const handleSaveNewTask = () => {
    const newTaskWithId: MaintenanceTask = { ...newTask, id: Math.random().toString(36).substring(7) };
    onAddTask(newTaskWithId);
    setNewTask({
      tipoMantenimiento: 'Preventivo',
      frecuencia: 'Mensual',
      tiempo: '2'
    });
    setIsAddingTask(false);
  };

  const handleCancelNewTask = () => {
    setIsAddingTask(false);
    setNewTask({
      tipoMantenimiento: 'Preventivo',
      frecuencia: 'Mensual',
      tiempo: '2'
    });
  };

  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">Tareas de Mantenimiento</h4>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">Tipo Mantenimiento</th>
              <th className="px-4 py-2">Frecuencia</th>
              <th className="px-4 py-2">Tiempo (Horas)</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="border px-4 py-2">{task.tipoMantenimiento}</td>
                <td className="border px-4 py-2">{task.frecuencia}</td>
                <td className="border px-4 py-2">{task.tiempo}</td>
                <td className="border px-4 py-2">
                  <Button size="sm" variant="destructive" onClick={() => onDeleteTask(task.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Borrar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddingTask ? (
        <div className="mt-4 p-4 border rounded-md">
          <h4 className="text-lg font-semibold mb-2">Añadir Nueva Tarea</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipoMantenimiento">Tipo Mantenimiento</Label>
              <Select value={newTask.tipoMantenimiento} onValueChange={(value) => handleNewTaskInputChange('tipoMantenimiento', value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventivo">Preventivo</SelectItem>
                  <SelectItem value="Correctivo">Correctivo</SelectItem>
                  <SelectItem value="Predictivo">Predictivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="frecuencia">Frecuencia</Label>
              <Select value={newTask.frecuencia} onValueChange={(value) => handleNewTaskInputChange('frecuencia', value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diario">Diario</SelectItem>
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Quincenal">Quincenal</SelectItem>
                  <SelectItem value="Mensual">Mensual</SelectItem>
                  <SelectItem value="Bimensual">Bimensual</SelectItem>
                  <SelectItem value="Trimestral">Trimestral</SelectItem>
                  <SelectItem value="Semestral">Semestral</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tiempo">Tiempo (Horas)</Label>
              <Input
                type="number"
                id="tiempo"
                value={newTask.tiempo}
                onChange={(e) => handleNewTaskInputChange('tiempo', e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={handleSaveNewTask}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={handleCancelNewTask}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" className="mt-4" onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          Añadir Tarea
        </Button>
      )}
    </div>
  );
};

export default EditableDenominationsForm;
