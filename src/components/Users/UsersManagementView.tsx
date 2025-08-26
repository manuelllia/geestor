
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Users, Loader2, RefreshCw, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

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

  // Función para filtrar usuarios basada en la búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => 
      user.nombre.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }, [users, searchTerm]);

  // Función para resaltar el texto coincidente
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) {
      return text;
    }
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
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
      <div className="w-full max-w-full overflow-hidden">
        <div className="space-y-6 p-2 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
                Gestión de Usuarios
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
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
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
              Gestión de Usuarios
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
              Administra los usuarios y sus permisos en el sistema
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Buscador */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar usuarios por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800 w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <CardTitle className="text-sm sm:text-base lg:text-lg text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                Lista de Usuarios
              </CardTitle>
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {filteredUsers.length} de {users.length} usuarios
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6">
            {/* Contenedor con scroll horizontal solo para la tabla */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm min-w-[120px]">Nombre</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[150px]">Correo</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden sm:table-cell">Permisos Creación</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden sm:table-cell">Permisos Borrado</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] hidden sm:table-cell">Permisos Modificación</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden sm:table-cell">Permisos Vista</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] hidden md:table-cell">Permisos Operaciones</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[140px] hidden md:table-cell">Permisos Gestión Técnica</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[150px] hidden md:table-cell">Permisos Gestión de Talento</TableHead>
                      <TableHead className="w-[50px] text-xs sm:text-sm">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="truncate max-w-[120px]">
                            {highlightMatch(user.nombre, searchTerm)}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="truncate max-w-[150px]">
                            {highlightMatch(user.email, searchTerm)}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {getBooleanBadge(user.Per_Create)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {getBooleanBadge(user.Per_Delete)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {getBooleanBadge(user.Per_Modificate)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {getBooleanBadge(user.Per_View)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                          {getBooleanBadge(user.Per_Ope)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                          {getBooleanBadge(user.Per_GT)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                          {getBooleanBadge(user.Per_GDT)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                              <DropdownMenuItem onClick={() => handleEditUser(user)} className="cursor-pointer text-xs sm:text-sm">
                                <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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
    </div>
  );
};

export default UsersManagementView;
