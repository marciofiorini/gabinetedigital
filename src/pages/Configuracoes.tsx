
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
import { UserManagement } from '@/components/admin/UserManagement';
import { CreateUser } from '@/components/admin/CreateUser';
import { EnhancedAccessLogs } from '@/components/admin/EnhancedAccessLogs';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { PasswordPolicy } from '@/components/admin/PasswordPolicy';
import { TwoFactorAuth } from '@/components/admin/TwoFactorAuth';
import { SessionManagement } from '@/components/admin/SessionManagement';
import { User, Bell, Shield, Database, Globe, Lock, Users, UserPlus, FileText, Settings, Key, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Configuracoes() {
  const { user, profile } = useAuth();
  const { settings, updateSettings, loading: settingsLoading } = useUserSettings();
  const { updateProfile, updatePassword, loading: profileLoading } = useUpdateProfile();
  const { roles, isAdmin, isModerator, loading: rolesLoading } = useUserRoles();
  
  const [name, setName] = useState(profile?.name || '');
  const [email] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleSaveProfile = async () => {
    if (name.trim()) {
      await updateProfile(name.trim());
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'moderator': return 'Moderador';
      default: return 'Usuário';
    }
  };

  // Mostrar a aba de admin se o usuário for admin
  const showAdminTab = isAdmin() || roles.includes('admin');

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className={`grid w-full ${showAdminTab ? 'grid-cols-6' : 'grid-cols-5'}`}>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
          <TabsTrigger value="dados">Dados</TabsTrigger>
          {showAdminTab && <TabsTrigger value="admin">Administração</TabsTrigger>}
        </TabsList>

        <TabsContent value="perfil" className="space-y-6">
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
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <Badge key={role} className={getRoleColor(role)}>
                      {getRoleLabel(role)}
                    </Badge>
                  ))
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">
                    Nenhum papel atribuído
                  </Badge>
                )}
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
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          {/* Autenticação de Dois Fatores */}
          <TwoFactorAuth />

          {/* Alteração de Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Alteração de Senha
              </CardTitle>
              <CardDescription>
                Atualize sua senha para manter sua conta segura
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

          {/* Gerenciamento de Sessões */}
          <SessionManagement />
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="preferencias" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="dados" className="space-y-6">
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
        </TabsContent>

        {showAdminTab && (
          <TabsContent value="admin" className="space-y-6">
            {/* Painel Administrativo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Painel Administrativo
                </CardTitle>
                <CardDescription>
                  Ferramentas completas de administração e segurança do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="usuarios" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="usuarios" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Usuários
                    </TabsTrigger>
                    <TabsTrigger value="criar" className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Criar
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Logs
                    </TabsTrigger>
                    <TabsTrigger value="senhas" className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Senhas
                    </TabsTrigger>
                    <TabsTrigger value="sessoes" className="flex items-center gap-2">
                      <Wifi className="w-4 h-4" />
                      Sessões
                    </TabsTrigger>
                    <TabsTrigger value="sistema" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Sistema
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="usuarios" className="mt-6">
                    <UserManagement />
                  </TabsContent>

                  <TabsContent value="criar" className="mt-6">
                    <CreateUser />
                  </TabsContent>

                  <TabsContent value="logs" className="mt-6">
                    <EnhancedAccessLogs />
                  </TabsContent>

                  <TabsContent value="senhas" className="mt-6">
                    <PasswordPolicy />
                  </TabsContent>

                  <TabsContent value="sessoes" className="mt-6">
                    <SessionManagement />
                  </TabsContent>

                  <TabsContent value="sistema" className="mt-6">
                    <SystemSettings />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
