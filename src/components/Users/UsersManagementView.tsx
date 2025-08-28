
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
      toast.error(t('errorLoadingUsers'));
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
      toast.success(t('userPermissionsUpdatedSuccessfully'));
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(t('errorUpdatingUserPermissions'));
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

  const getBooleanText = (value: boolean): string => {
    return value ? t('yes') : t('no');
  };

  const getBooleanBadge = (value: boolean) => {
    return (
      <Badge variant={value ? 'default' : 'secondary'} className="text-xs">
        {getBooleanText(value)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
                {t('usersGestion')}
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
                {t('userGestSub')}
              </p>
            </div>
          </div>
          
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 flex-1 overflow-hidden">
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
              {t('usersGestion')}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
              {t('userGestSub')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-sm"
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 flex-shrink-0 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{t('recargar')}</span>
            </Button>
          </div>
        </div>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex-shrink-0" />
              <Input
                type="text"
                placeholder={t('buscadorUsers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800 flex-1 overflow-hidden">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <CardTitle className="text-sm sm:text-base lg:text-lg text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{t('listaUsers')}</span>
              </CardTitle>
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {filteredUsers.length} {t('usersCount')} {users.length} {t('users')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
              <div className="min-w-[1200px] w-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm min-w-[150px] px-2 sm:px-4">{t('name')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[180px] px-2 sm:px-4">{t('email')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] px-2 sm:px-4 text-center">{t('create')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] px-2 sm:px-4 text-center">{t('delete')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] px-2 sm:px-4 text-center">{t('modify')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] px-2 sm:px-4 text-center">{t('view')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] px-2 sm:px-4 text-center">{t('operations')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[140px] px-2 sm:px-4 text-center">{t('technicalManagementShort')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[150px] px-2 sm:px-4 text-center">{t('talentManagementShort')}</TableHead>
                      <TableHead className="w-[80px] text-xs sm:text-sm text-center">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-4">
                          <div className="truncate">
                            {highlightMatch(user.nombre, searchTerm)}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4">
                          <div className="truncate">
                            {highlightMatch(user.email, searchTerm)}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 text-center">
                          {getBooleanBadge(user.Per_Create)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 text-center">
                          {getBooleanBadge(user.Per_Delete)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 text-center">
                          {getBooleanBadge(user.Per_Modificate)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 text-center">
                          {getBooleanBadge(user.Per_View)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 text-center">
                          {getBooleanBadge(user.Per_Ope)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 text-center">
                          {getBooleanBadge(user.Per_GT)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 text-center">
                          {getBooleanBadge(user.Per_GDT)}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4">
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4 flex-shrink-0" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                                <DropdownMenuItem onClick={() => handleEditUser(user)} className="cursor-pointer text-xs sm:text-sm">
                                  <Eye className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span>{t('editPermissions')}</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="sm:hidden p-4 text-center">
              <p className="text-xs text-gray-500">
                {t('swipeToViewMore')}
              </p>
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
            language={language}
          />
        )}
      </div>
    </div>
  );
};

export default UsersManagementView;
