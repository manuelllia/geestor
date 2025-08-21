
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Users, Loader2, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getUsersList, updateUserPermissions, UserData } from '../../services/usersService';
import UserPermissionsModal from './UserPermissionsModal';
import { toast } from 'sonner';

interface UsersManagementViewProps {
  language: Language;
}

const UsersManagementView: React.FC<UsersManagementViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getUsersList();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (updatedUser: UserData) => {
    try {
      await updateUserPermissions(updatedUser.uid, updatedUser);
      setUsers(prev => prev.map(user => 
        user.uid === updatedUser.uid ? updatedUser : user
      ));
      setIsModalOpen(false);
      setSelectedUser(null);
      toast.success('Permisos de usuario actualizados correctamente');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar los permisos del usuario');
    }
  };

  const getBooleanText = (value: boolean): string => {
    return value ? 'Sí' : 'No';
  };

  const getBooleanBadge = (value: boolean) => {
    return (
      <Badge variant={value ? 'default' : 'secondary'}>
        {getBooleanText(value)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Administra los usuarios y sus permisos en el sistema
            </p>
          </div>
        </div>
        
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los usuarios y sus permisos en el sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Lista de Usuarios
            </CardTitle>
            <Badge variant="secondary">
              {users.length} usuarios
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead className="hidden sm:table-cell">Permisos Creación</TableHead>
                  <TableHead className="hidden sm:table-cell">Permisos Borrado</TableHead>
                  <TableHead className="hidden sm:table-cell">Permisos Modificación</TableHead>
                  <TableHead className="hidden sm:table-cell">Permisos Vista</TableHead>
                  <TableHead className="hidden md:table-cell">Permisos Operaciones</TableHead>
                  <TableHead className="hidden md:table-cell">Permisos Gestión Técnica</TableHead>
                  <TableHead className="hidden md:table-cell">Permisos Gestión de Talento</TableHead>
                  <TableHead className="w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.nombre}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getBooleanBadge(user.Per_Create)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getBooleanBadge(user.Per_Delete)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getBooleanBadge(user.Per_Modificate)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getBooleanBadge(user.Per_View)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getBooleanBadge(user.Per_Ope)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getBooleanBadge(user.Per_GT)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getBooleanBadge(user.Per_GDT)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                          <DropdownMenuItem onClick={() => handleEditUser(user)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Editar permisos
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserPermissionsModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UsersManagementView;
