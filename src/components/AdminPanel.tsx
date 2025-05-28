
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Bell, Plus, Trash2, UserCheck } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  roles: string[];
}

export const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useUserRoles();
  const { toast } = useToast();

  // Notification form state
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    user_id: 'all'
  });

  const fetchUsers = async () => {
    if (!user || !isAdmin()) return;

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

      // Combinar dados
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(role => role.user_id === profile.id).map(role => role.role) || []
      })) || [];

      setUsers(usersWithRoles);
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

  const handleRoleChange = async (userId: string, newRole: string, action: 'add' | 'remove') => {
    try {
      if (action === 'add') {
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: newRole,
            granted_by: user?.id
          });

        if (error) throw error;

        toast({
          title: 'Papel atribuído',
          description: `Papel ${newRole} atribuído com sucesso.`
        });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', newRole);

        if (error) throw error;

        toast({
          title: 'Papel removido',
          description: `Papel ${newRole} removido com sucesso.`
        });
      }

      fetchUsers();
    } catch (error: any) {
      console.error('Erro ao alterar papel:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível alterar o papel.',
        variant: 'destructive'
      });
    }
  };

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin()) return;

    try {
      if (notificationForm.user_id === 'all') {
        // Enviar para todos os usuários
        const notifications = users.map(u => ({
          user_id: u.id,
          title: notificationForm.title,
          message: notificationForm.message,
          type: notificationForm.type
        }));

        const { error } = await supabase
          .from('notifications')
          .insert(notifications);

        if (error) throw error;

        toast({
          title: 'Notificações enviadas',
          description: `Notificação enviada para ${users.length} usuários.`
        });
      } else {
        // Enviar para usuário específico
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: notificationForm.user_id,
            title: notificationForm.title,
            message: notificationForm.message,
            type: notificationForm.type
          });

        if (error) throw error;

        toast({
          title: 'Notificação enviada',
          description: 'Notificação enviada com sucesso.'
        });
      }

      setNotificationForm({
        title: '',
        message: '',
        type: 'info',
        user_id: 'all'
      });
      setIsNotificationDialogOpen(false);
    } catch (error: any) {
      console.error('Erro ao enviar notificação:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar a notificação.',
        variant: 'destructive'
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
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
    if (user && isAdmin()) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Você não tem permissão para acessar o painel administrativo.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Painel Administrativo
          </h2>
          <p className="text-gray-600">Gerencie usuários e configurações do sistema</p>
        </div>
        <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Bell className="w-4 h-4 mr-2" />
              Enviar Notificação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Notificação</DialogTitle>
              <DialogDescription>
                Envie uma notificação para usuários específicos ou todos os usuários.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={sendNotification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                  placeholder="Título da notificação"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                  placeholder="Conteúdo da notificação"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={notificationForm.type}
                    onValueChange={(value: 'info' | 'success' | 'warning' | 'error') => 
                      setNotificationForm({ ...notificationForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informação</SelectItem>
                      <SelectItem value="success">Sucesso</SelectItem>
                      <SelectItem value="warning">Aviso</SelectItem>
                      <SelectItem value="error">Erro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_id">Destinatário</Label>
                  <Select
                    value={notificationForm.user_id}
                    onValueChange={(value) => setNotificationForm({ ...notificationForm, user_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os usuários</SelectItem>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Enviar Notificação
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            {users.length} usuário(s) registrado(s) no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando usuários...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="w-4 h-4 text-gray-500" />
                        <h3 className="font-semibold">{u.name}</h3>
                        <span className="text-sm text-gray-500">({u.email})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">Papéis:</span>
                        {u.roles.map((role) => (
                          <Badge key={role} className={getRoleColor(role)}>
                            {getRoleLabel(role)}
                            {role !== 'user' && (
                              <button
                                className="ml-1 hover:text-red-600"
                                onClick={() => handleRoleChange(u.id, role, 'remove')}
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Cadastrado em: {new Date(u.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!u.roles.includes('admin') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRoleChange(u.id, 'admin', 'add')}
                          disabled={u.id === user?.id}
                        >
                          Tornar Admin
                        </Button>
                      )}
                      {!u.roles.includes('moderator') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRoleChange(u.id, 'moderator', 'add')}
                          disabled={u.id === user?.id}
                        >
                          Tornar Moderador
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
