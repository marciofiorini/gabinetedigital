
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Shield, User, Settings } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface UserRoleEditorProps {
  user: User;
  onUpdate: () => void;
  onCancel: () => void;
}

type UserRole = 'admin' | 'moderator' | 'user';

const availableRoles: { value: UserRole; label: string; description: string; icon: any }[] = [
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Acesso total ao sistema, pode gerenciar usuários e configurações',
    icon: Shield
  },
  {
    value: 'moderator',
    label: 'Moderador',
    description: 'Pode moderar conteúdo e gerenciar alguns aspectos do sistema',
    icon: Settings
  },
  {
    value: 'user',
    label: 'Usuário',
    description: 'Acesso básico às funcionalidades do sistema',
    icon: User
  }
];

export const UserRoleEditor = ({ user, onUpdate, onCancel }: UserRoleEditorProps) => {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(user.roles as UserRole[]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, role]);
    } else {
      if (role === 'admin' && user.id === currentUser?.id) {
        toast.error('Você não pode remover seu próprio papel de administrador.');
        return;
      }
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Remover todos os papéis atuais do usuário
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Adicionar os novos papéis selecionados
      if (selectedRoles.length > 0) {
        const rolesToInsert = selectedRoles.map(role => ({
          user_id: user.id,
          role: role,
          granted_by: currentUser?.id
        }));

        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(rolesToInsert);

        if (insertError) throw insertError;
      }

      toast.success(`Os papéis de ${user.name} foram atualizados com sucesso.`);
      onUpdate();
    } catch (error: any) {
      console.error('Erro ao atualizar papéis:', error);
      toast.error(error.message || 'Não foi possível atualizar os papéis.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'moderator': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <div className="flex items-center gap-2">
              <strong>Papéis atuais:</strong>
              {user.roles.length > 0 ? user.roles.map((role) => (
                <Badge key={role} className={getRoleColor(role)}>
                  {availableRoles.find(r => r.value === role)?.label || role}
                </Badge>
              )) : (
                <Badge variant="secondary">Nenhum papel</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gerenciar Papéis</CardTitle>
          <CardDescription>
            Selecione os papéis que este usuário deve ter no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableRoles.map((role) => {
              const Icon = role.icon;
              const isChecked = selectedRoles.includes(role.value);
              const isDisabled = role.value === 'admin' && user.id === currentUser?.id && isChecked;

              return (
                <div key={role.value} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={role.value}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleRoleChange(role.value, checked as boolean)}
                    disabled={isDisabled}
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={role.value} 
                      className="flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Icon className="w-4 h-4" />
                      {role.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    {isDisabled && (
                      <p className="text-xs text-orange-600 mt-1">
                        Você não pode remover seu próprio papel de administrador
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};
