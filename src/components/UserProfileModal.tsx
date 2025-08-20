
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Camera, Shield, Building, Edit, CheckCircle, UserPlus, LogOut, Loader2, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';
import { User as AppUser } from '../types/auth';

// Firebase imports
import { getAuth, onAuthStateChanged, signOut, User as FirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Interfaz para los permisos tal como los obtendremos de Firestore
export interface UserFirestorePermissions {
  Per_Ope?: boolean;
  Per_view?: boolean;
  Per_Modificate?: boolean;
  Per_GT?: boolean;
  Per_GDT?: boolean;
  Per_Delete?: boolean;
  Per_Create?: boolean;
}

// Función para obtener los permisos de Firestore para un UID dado
export const getUserPermissionsFromFirestore = async (uid: string): Promise<UserFirestorePermissions | null> => {
  try {
    const permissionsDocRef = doc(db, "Usuarios", "Informacion", uid, uid);
    const docSnap = await getDoc(permissionsDocRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserFirestorePermissions;
    } else {
      console.warn(`Documento de permisos no encontrado en Firestore para UID: ${uid}`);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener permisos de Firestore:", error);
    throw new Error("No se pudieron cargar los permisos del usuario desde Firestore.");
  }
};

interface UserProfileModalProps {
  user: AppUser;
  language: Language;
  onUserUpdate: (updatedUser: AppUser) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  user, 
  language, 
  onUserUpdate,
  onLogout,
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

  // Estados para los permisos obtenidos de Firestore
  const [userPermissions, setUserPermissions] = useState<UserFirestorePermissions | null>(null);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);

  // Efecto para cargar los permisos cuando el modal se abre y el user.uid está disponible
  useEffect(() => {
    if (isOpen && user?.uid) {
      const fetchPermissions = async () => {
        setLoadingPermissions(true);
        setPermissionsError(null);
        try {
          const fetchedPermissions = await getUserPermissionsFromFirestore(user.uid);
          setUserPermissions(fetchedPermissions);
        } catch (err: any) {
          console.error("Error fetching user permissions:", err);
          setPermissionsError(err.message || "Error al cargar los permisos del usuario.");
        } finally {
          setLoadingPermissions(false);
        }
      };
      fetchPermissions();
    } else if (!isOpen) {
      setUserPermissions(null);
      setPermissionsError(null);
    }
  }, [isOpen, user?.uid]);

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
    
    onUserUpdate(updatedUser);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
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
                  <AvatarImage src={formData.profilePicture || undefined} />
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    {formData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'US'}
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
                    value={formData.email || ''} 
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="border-blue-300 focus:border-blue-500 dark:border-blue-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección de Permisos */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t('permissions')}
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                {t('permissionsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingPermissions ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-500" />
                  <span>Cargando permisos...</span>
                </div>
              ) : permissionsError ? (
                <div className="text-center py-4 text-red-500">
                  <AlertCircle className="mx-auto w-8 h-8 mb-2" />
                  <p>{permissionsError}</p>
                </div>
              ) : userPermissions ? (
                <>
                  {/* Permisos de Departamentos */}
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mt-4">{t('departmentPermissions')}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 dark:text-blue-300">{t('operations')}</span>
                    <Switch
                      checked={userPermissions.Per_Ope ?? false}
                      disabled={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 dark:text-blue-300">{t('technicalManagement')}</span>
                    <Switch
                      checked={userPermissions.Per_GT ?? false} 
                      disabled={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 dark:text-blue-300">{t('talentManagement')}</span>
                    <Switch
                      checked={userPermissions.Per_GDT ?? false} 
                      disabled={true}
                    />
                  </div>

                  {/* Permisos de Acciones */}
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mt-4">{t('actionPermissions')}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-green-600" />
                      <span className="text-blue-700 dark:text-blue-300">{t('create')}</span>
                    </div>
                    <Switch
                      checked={userPermissions.Per_Create ?? false} 
                      disabled={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-300">{t('modify')}</span>
                    </div>
                    <Switch
                      checked={userPermissions.Per_Modificate ?? false} 
                      disabled={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-red-600" /> 
                      <span className="text-blue-700 dark:text-blue-300">{t('delete')}</span>
                    </div>
                    <Switch
                      checked={userPermissions.Per_Delete ?? false} 
                      disabled={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-600" /> 
                      <span className="text-blue-700 dark:text-blue-300">{t('view')}</span>
                    </div>
                    <Switch
                      checked={userPermissions.Per_view ?? false} 
                      disabled={true}
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">No se pudieron cargar los permisos o no hay datos para mostrar.</p>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-between gap-4">
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </Button>
            
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
