
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, Edit, Trash2, Shield, Eye } from 'lucide-react';
import { UserRoleEditor } from './UserRoleEditor';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  roles: string[];
  last_sign_in_at?: string;
  email_confirmed_at?: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar perfis dos usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, created_at');

      if (profilesError) throw profilesError;

      // Buscar papéis dos usuários
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Buscar dados de autenticação (apenas para admins)
      const { data: authData } = await supabase.auth.admin.listUsers();

      // Combinar dados
      const usersWithRoles = profiles?.map(profile => {
        const authUser = authData?.users?.find(au => au.id === profile.id);
        return {
          ...profile,
          roles: userRoles?.filter(role => role.user_id === profile.id).map(role => role.role) || [],
          last_sign_in_at: authUser?.last_sign_in_at,
          email_confirmed_at: authUser?.email_confirmed_at
        };
      }) || [];

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        u.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast({
        title: 'Erro',
        description: 'Você não pode excluir sua própria conta.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: 'Usuário excluído',
        description: 'O usuário foi excluído com sucesso.'
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível excluir o usuário.',
        variant: 'destructive'
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'moderator': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'moderator': return 'Moderador';
      default: return 'Usuário';
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            {users.length} usuário(s) registrado(s) no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchUsers} variant="outline">
              Atualizar
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando usuários...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((u) => (
                <div key={u.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="w-4 h-4 text-gray-500" />
                        <h3 className="font-semibold">{u.name}</h3>
                        <span className="text-sm text-gray-500">({u.email})</span>
                        {!u.email_confirmed_at && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Email não confirmado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">Papéis:</span>
                        {u.roles.length > 0 ? u.roles.map((role) => (
                          <Badge key={role} className={getRoleColor(role)}>
                            {getRoleLabel(role)}
                          </Badge>
                        )) : (
                          <Badge variant="secondary">Nenhum papel</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Cadastrado em: {new Date(u.created_at).toLocaleDateString('pt-BR')}</p>
                        {u.last_sign_in_at && (
                          <p>Último login: {new Date(u.last_sign_in_at).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(u);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      {u.id !== user?.id && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Excluir
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar Exclusão</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja excluir o usuário <strong>{u.name}</strong>? 
                                Esta ação não pode ser desfeita.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Cancelar</Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteUser(u.id)}
                              >
                                Excluir Usuário
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Gerencie os papéis e permissões do usuário
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserRoleEditor
              user={selectedUser}
              onUpdate={() => {
                fetchUsers();
                setIsEditDialogOpen(false);
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
