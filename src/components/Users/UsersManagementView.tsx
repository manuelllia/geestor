
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResponsiveTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/responsive-table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Users, Loader2, RefreshCw, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getUsersList, updateUserPermissions, UserData } from '../../services/usersService';
import UserPermissionsModal from './UserPermissionsModal';
import { toast } from 'sonner';
import { useResponsive } from '../../hooks/useResponsive';

interface UsersManagementViewProps {
  language: Language;
}

const UsersManagementView: React.FC<UsersManagementViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const { isMobile } = useResponsive();
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

  const getBooleanBadge = (value: boolean) => {
    return (
      <Badge variant={value ? 'default' : 'secondary'} className="text-xs">
        {value ? 'Sí' : 'No'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="responsive-container">
        <div className="responsive-padding space-y-4">
          <div>
            <h1 className="responsive-title font-bold text-primary">
              Gestión de Usuarios
            </h1>
            <p className="responsive-text text-muted-foreground mt-1">
              Administra los usuarios y sus permisos en el sistema
            </p>
          </div>
          
          <Card>
            <CardContent className="flex items-center justify-center h-64 responsive-padding">
              <Loader2 className="icon-responsive animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-container">
      <div className="responsive-padding space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="responsive-title font-bold text-primary">
              Gestión de Usuarios
            </h1>
            <p className="responsive-text text-muted-foreground mt-1">
              Administra los usuarios y sus permisos en el sistema
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="button-responsive"
              disabled={refreshing}
            >
              <RefreshCw className={`icon-responsive mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Buscador */}
        <Card>
          <CardContent className="responsive-padding">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground icon-responsive" />
              <Input
                type="text"
                placeholder="Buscar usuarios por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
          <CardHeader className="responsive-padding">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <CardTitle className="responsive-subtitle text-primary flex items-center responsive-gap">
                <Users className="icon-responsive" />
                Lista de Usuarios
              </CardTitle>
              <Badge variant="secondary" className="responsive-text">
                {filteredUsers.length} de {users.length} usuarios
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveTable minWidth="1200px">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px] font-medium">Nombre</TableHead>
                    <TableHead className="w-[200px] font-medium">Correo</TableHead>
                    <TableHead className="w-[100px] text-center font-medium">Crear</TableHead>
                    <TableHead className="w-[100px] text-center font-medium">Borrar</TableHead>
                    <TableHead className="w-[100px] text-center font-medium">Modificar</TableHead>
                    <TableHead className="w-[100px] text-center font-medium">Ver</TableHead>
                    <TableHead className="w-[120px] text-center font-medium">Operaciones</TableHead>
                    <TableHead className="w-[140px] text-center font-medium">Gestión Técnica</TableHead>
                    <TableHead className="w-[150px] text-center font-medium">Gestión Talento</TableHead>
                    <TableHead className="w-[100px] text-center font-medium">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium">
                        {highlightMatch(user.nombre, searchTerm)}
                      </TableCell>
                      <TableCell>
                        {highlightMatch(user.email, searchTerm)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getBooleanBadge(user.Per_Create)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getBooleanBadge(user.Per_Delete)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getBooleanBadge(user.Per_Modificate)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getBooleanBadge(user.Per_View)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getBooleanBadge(user.Per_Ope)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getBooleanBadge(user.Per_GT)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getBooleanBadge(user.Per_GDT)}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
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
            </ResponsiveTable>
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
