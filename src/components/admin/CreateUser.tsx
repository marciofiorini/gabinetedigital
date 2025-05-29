
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Key, User, Shield } from 'lucide-react';

type UserRole = 'admin' | 'moderator' | 'user';

const availableRoles: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Acesso total ao sistema'
  },
  {
    value: 'moderator',
    label: 'Moderador',
    description: 'Pode moderar conteúdo'
  },
  {
    value: 'user',
    label: 'Usuário',
    description: 'Acesso básico ao sistema'
  }
];

export const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: ['user'] as UserRole[]
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        roles: [...formData.roles, role]
      });
    } else {
      setFormData({
        ...formData,
        roles: formData.roles.filter(r => r !== role)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive'
      });
      return;
    }

    if (formData.roles.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos um papel para o usuário.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);

      // Criar usuário usando Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          name: formData.name
        }
      });

      if (authError) throw authError;

      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      // Adicionar papéis
      const rolesToInsert = formData.roles.map(role => ({
        user_id: authData.user.id,
        role: role
      }));

      const { error: rolesError } = await supabase
        .from('user_roles')
        .insert(rolesToInsert);

      if (rolesError) throw rolesError;

      toast({
        title: 'Usuário criado com sucesso!',
        description: `${formData.name} foi adicionado ao sistema.`
      });

      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        roles: ['user']
      });

    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: 'Erro ao criar usuário',
        description: error.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      password: password,
      confirmPassword: password
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Criar Novo Usuário
          </CardTitle>
          <CardDescription>
            Adicione um novo usuário ao sistema com papéis específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome completo *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do usuário"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            {/* Senhas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Senha
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={generatePassword}>
                  Gerar senha aleatória
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Senha (mín. 6 caracteres)"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirmar senha"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Papéis */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Papéis do usuário *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableRoles.map((role) => (
                  <div key={role.value} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`create-${role.value}`}
                      checked={formData.roles.includes(role.value)}
                      onCheckedChange={(checked) => handleRoleChange(role.value, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`create-${role.value}`} 
                        className="font-medium cursor-pointer"
                      >
                        {role.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <AlertDescription>
                O usuário receberá um email de confirmação e poderá fazer login imediatamente com as credenciais fornecidas.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  roles: ['user']
                })}
              >
                Limpar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando usuário...' : 'Criar usuário'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
