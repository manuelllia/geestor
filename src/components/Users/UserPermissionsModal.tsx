
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { User, Settings, Shield, Eye, Edit, Trash2, Plus, Users } from 'lucide-react';
import { UserData } from '../../services/usersService';

interface UserPermissionsModalProps {
  user: UserData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: UserData) => void;
}

const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserData>(user);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSwitchChange = (field: keyof UserData, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = () => {
    onSave(formData);
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setFormData(user);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Settings className="w-5 h-5" />
              Editar Permisos de Usuario
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Información del usuario */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                  Información del Usuario
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {formData.nombre}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Correo electrónico
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {formData.email}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Permisos de acciones */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Permisos de Acciones
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-green-500" />
                    <Label htmlFor="per_create" className="text-sm font-medium">
                      Permisos de Creación
                    </Label>
                  </div>
                  <Switch
                    id="per_create"
                    checked={formData.Per_Create}
                    onCheckedChange={(checked) => handleSwitchChange('Per_Create', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <Label htmlFor="per_delete" className="text-sm font-medium">
                      Permisos de Borrado
                    </Label>
                  </div>
                  <Switch
                    id="per_delete"
                    checked={formData.Per_Delete}
                    onCheckedChange={(checked) => handleSwitchChange('Per_Delete', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="per_modificate" className="text-sm font-medium">
                      Permisos de Modificación
                    </Label>
                  </div>
                  <Switch
                    id="per_modificate"
                    checked={formData.Per_Modificate}
                    onCheckedChange={(checked) => handleSwitchChange('Per_Modificate', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <Label htmlFor="per_view" className="text-sm font-medium">
                      Permisos de Vista
                    </Label>
                  </div>
                  <Switch
                    id="per_view"
                    checked={formData.Per_View}
                    onCheckedChange={(checked) => handleSwitchChange('Per_View', checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Permisos de módulos */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Permisos de Módulos
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <Label htmlFor="per_ope" className="text-sm font-medium">
                      Permisos de Operaciones
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Acceso al módulo de análisis de costes y operaciones
                    </p>
                  </div>
                  <Switch
                    id="per_ope"
                    checked={formData.Per_Ope}
                    onCheckedChange={(checked) => handleSwitchChange('Per_Ope', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <Label htmlFor="per_gt" className="text-sm font-medium">
                      Permisos de Gestión Técnica
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Acceso al módulo de mantenimiento y gestión técnica
                    </p>
                  </div>
                  <Switch
                    id="per_gt"
                    checked={formData.Per_GT}
                    onCheckedChange={(checked) => handleSwitchChange('Per_GT', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <Label htmlFor="per_gdt" className="text-sm font-medium">
                      Permisos de Gestión de Talento
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Acceso al módulo de recursos humanos y gestión de talento
                    </p>
                  </div>
                  <Switch
                    id="per_gdt"
                    checked={formData.Per_GDT}
                    onCheckedChange={(checked) => handleSwitchChange('Per_GDT', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <Label htmlFor="per_user" className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      Permisos de Gestión de Usuarios
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Acceso al módulo de gestión y administración de usuarios
                    </p>
                  </div>
                  <Switch
                    id="per_user"
                    checked={formData.Per_User || false}
                    onCheckedChange={(checked) => handleSwitchChange('Per_User', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambios de permisos</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea actualizar los permisos del usuario <strong>{formData.nombre}</strong>? 
              Esta acción modificará el acceso del usuario a diferentes módulos del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave} className="bg-blue-600 hover:bg-blue-700">
              Confirmar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserPermissionsModal;
