
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Camera, Shield, Building, Edit, CheckCircle, UserPlus } from 'lucide-react';
import { User as UserType } from '../types/auth';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';

interface UserProfileModalProps {
  user: UserType;
  language: Language;
  onUserUpdate: (updatedUser: UserType) => void;
  onPermissionsUpdate?: () => void;
  children: React.ReactNode;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  user, 
  language, 
  onUserUpdate,
  onPermissionsUpdate, 
  children 
}) => {
  const { t } = useTranslation(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture
  });
  const [permissions, setPermissions] = useState(() => {
    const stored = localStorage.getItem('userPermissions');
    return stored ? JSON.parse(stored) : {
      departments: {
        operaciones: true,
        gestionTecnica: true,
        gestionTalento: true
      },
      actions: {
        create: true,
        edit: true,
        delete: true
      }
    };
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData
    };
    
    // Guardar en localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    localStorage.setItem('userPermissions', JSON.stringify(permissions));
    
    onUserUpdate(updatedUser);
    
    // Notificar al componente padre que los permisos han cambiado
    if (onPermissionsUpdate) {
      onPermissionsUpdate();
    }
    
    setIsOpen(false);
  };

  const handlePermissionChange = (category: string, key: string, value: boolean) => {
    setPermissions((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <User className="w-5 h-5" />
            {t('userProfile')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('personalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={formData.profilePicture} />
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t('changePhoto')}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-blue-800 dark:text-blue-200">
                    {t('name')}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="border-blue-300 focus:border-blue-500 dark:border-blue-600"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-blue-800 dark:text-blue-200">
                    {t('email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="border-blue-300 focus:border-blue-500 dark:border-blue-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permisos de Departamentos */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Building className="w-4 h-4" />
                {t('departmentPermissions')}
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                {t('departmentPermissionsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 dark:text-blue-300">{t('operaciones')}</span>
                <Switch
                  checked={permissions.departments.operaciones}
                  onCheckedChange={(value) => handlePermissionChange('departments', 'operaciones', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700 dark:text-blue-300">{t('gestionTecnica')}</span>
                <Switch
                  checked={permissions.departments.gestionTecnica}
                  onCheckedChange={(value) => handlePermissionChange('departments', 'gestionTecnica', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700 dark:text-blue-300">{t('gestionTalento')}</span>
                <Switch
                  checked={permissions.departments.gestionTalento}
                  onCheckedChange={(value) => handlePermissionChange('departments', 'gestionTalento', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Permisos de Acciones */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t('actionPermissions')}
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                {t('actionPermissionsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-green-600" />
                  <span className="text-blue-700 dark:text-blue-300">{t('create')}</span>
                </div>
                <Switch
                  checked={permissions.actions.create}
                  onCheckedChange={(value) => handlePermissionChange('actions', 'create', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">{t('edit')}</span>
                </div>
                <Switch
                  checked={permissions.actions.edit}
                  onCheckedChange={(value) => handlePermissionChange('actions', 'edit', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-600" />
                  <span className="text-blue-700 dark:text-blue-300">{t('delete')}</span>
                </div>
                <Switch
                  checked={permissions.actions.delete}
                  onCheckedChange={(value) => handlePermissionChange('actions', 'delete', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botón Guardar */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('saveChanges')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
