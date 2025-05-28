
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { User, Bell, Shield, Database, Eye, Lock, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Configuracoes() {
  const { user, profile } = useAuth();
  const { settings, updateSettings, loading: settingsLoading } = useUserSettings();
  const { updateProfile, updatePassword, loading: profileLoading } = useUpdateProfile();
  const { roles, isAdmin, isModerator } = useUserRoles();
  
  const [name, setName] = useState(profile?.name || '');
  const [email] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleSaveProfile = async () => {
    if (name.trim()) {
      await updateProfile(name.trim());
      // A page will automatically update via AuthContext
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      return;
    }
    
    if (newPassword.length < 6) {
      return;
    }

    const success = await updatePassword(newPassword);
    if (success) {
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
      </div>

      <div className="grid gap-6">
        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium">Papéis:</span>
              {roles.map((role) => (
                <Badge key={role} className={getRoleColor(role)}>
                  {role === 'admin' ? 'Administrador' : 
                   role === 'moderator' ? 'Moderador' : 'Usuário'}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>
            <Button 
              onClick={handleSaveProfile} 
              disabled={profileLoading || !name.trim()}
            >
              {profileLoading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Gerencie a segurança da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alterar senha</p>
                <p className="text-sm text-gray-600">Atualize sua senha regularmente</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordSection(!showPasswordSection)}
              >
                {showPasswordSection ? 'Cancelar' : 'Alterar'}
              </Button>
            </div>
            
            {showPasswordSection && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova senha (mínimo 6 caracteres)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpdatePassword}
                    disabled={
                      profileLoading || 
                      !newPassword || 
                      newPassword !== confirmPassword ||
                      newPassword.length < 6
                    }
                  >
                    {profileLoading ? 'Atualizando...' : 'Atualizar senha'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure suas preferências de notificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por email</p>
                <p className="text-sm text-gray-600">Receber emails sobre demandas e agenda</p>
              </div>
              <Switch
                checked={settings?.email_notifications ?? true}
                onCheckedChange={(checked) => 
                  updateSettings({ email_notifications: checked })
                }
                disabled={settingsLoading}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações push</p>
                <p className="text-sm text-gray-600">Alertas em tempo real no navegador</p>
              </div>
              <Switch
                checked={settings?.push_notifications ?? true}
                onCheckedChange={(checked) => 
                  updateSettings({ push_notifications: checked })
                }
                disabled={settingsLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Preferências
            </CardTitle>
            <CardDescription>
              Configure idioma, tema e fuso horário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select 
                  value={settings?.theme ?? 'light'}
                  onValueChange={(value) => updateSettings({ theme: value })}
                  disabled={settingsLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select 
                  value={settings?.language ?? 'pt-BR'}
                  onValueChange={(value) => updateSettings({ language: value })}
                  disabled={settingsLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Dados
            </CardTitle>
            <CardDescription>
              Gerencie seus dados e privacidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Exportar dados</p>
                <p className="text-sm text-gray-600">Baixe uma cópia dos seus dados</p>
              </div>
              <Button variant="outline">Exportar</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Excluir conta</p>
                <p className="text-sm text-gray-600">Remova permanentemente sua conta</p>
              </div>
              <Button variant="destructive">Excluir</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
