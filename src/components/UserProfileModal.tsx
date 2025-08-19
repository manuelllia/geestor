
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Shield, User, LogOut, Save, RefreshCw } from 'lucide-react';
import { User as UserType } from '../types/auth';
import { Language } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';
import { useUserPermissions } from '../hooks/useUserPermissions';
import { toast } from 'sonner';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface UserProfileModalProps {
  user: UserType;
  language: Language;
  onUserUpdate: (updatedUser: UserType) => void;
  onPermissionsUpdate: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function UserProfileModal({
  user,
  language,
  onUserUpdate,
  onPermissionsUpdate,
  onLogout,
  children
}: UserProfileModalProps) {
  const { t } = useTranslation(language);
  const { permissions, isLoading: permissionsLoading, refreshPermissions } = useUserPermissions();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType>(user);

  // Detectar si el usuario es administrador
  const isAdmin = user.id === 'f5hxxnZBA9Xn7hxkdpzkcdFkfEz1';

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Aquí iría la lógica para actualizar el usuario en Firebase
      onUserUpdate(editedUser);
      setIsEditing(false);
      toast.success(t('profileUpdated'), {
        description: t('profileUpdatedDescription')
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('errorUpdatingProfile'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aquí iría la lógica para subir la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhotoUrl = e.target?.result as string;
        setEditedUser(prev => ({ ...prev, profilePicture: newPhotoUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Cerrar sesión en Firebase
      await signOut(auth);
      
      // Llamar al callback de logout
      onLogout();
      
      // Cerrar el modal
      setIsOpen(false);
      
      toast.success(t('loggedOutSuccessfully'), {
        description: t('sessionClosedSecurely')
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(t('errorLoggingOut'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getPermissionBadge = (hasPermission: boolean) => (
    <Badge variant={hasPermission ? "default" : "outline"} className="text-xs">
      {hasPermission ? t('allowed') : t('denied')}
    </Badge>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Shield className="h-5 w-5 text-red-500" />
                <span className="text-red-600 dark:text-red-400">ADMIN</span>
              </>
            ) : (
              <>
                <User className="h-5 w-5 text-blue-500" />
                {t('userProfile')}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={isEditing ? editedUser.profilePicture : user.profilePicture} />
                <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {isAdmin && (
              <Badge variant="destructive" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {t('administrator')}
              </Badge>
            )}
          </div>

          {/* User Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('personalInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                  />
                ) : (
                  <div className="text-sm font-medium">{user.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                  />
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('userId')}</Label>
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {user.id}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {t('permissions')}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshPermissions}
                  disabled={permissionsLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${permissionsLoading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
              <CardDescription>
                {isAdmin ? t('adminFullAccess') : t('currentPermissions')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isAdmin ? (
                <div className="text-center py-4">
                  <Shield className="h-8 w-8 mx-auto text-red-500 mb-2" />
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    {t('administratorAccess')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t('accessToAllDepartments')}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('operations')}</span>
                    {getPermissionBadge(permissions?.Per_Ope ?? false)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('technicalManagement')}</span>
                    {getPermissionBadge(permissions?.Per_GT ?? false)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('talentManagement')}</span>
                    {getPermissionBadge(permissions?.Per_GDT ?? false)}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  {t('cancel')}
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t('saving')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('save')}
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)} className="flex-1">
                  {t('editProfile')}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  className="flex-1"
                >
                  {isLoggingOut ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t('loggingOut')}
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('logout')}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
