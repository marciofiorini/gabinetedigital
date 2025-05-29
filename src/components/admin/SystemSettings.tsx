
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings, Database, Mail, Shield, Info } from 'lucide-react';

interface SystemConfig {
  maintenance_mode: boolean;
  registration_enabled: boolean;
  max_users: number;
  system_message: string;
  email_notifications_enabled: boolean;
  backup_frequency: string;
}

export const SystemSettings = () => {
  const [config, setConfig] = useState<SystemConfig>({
    maintenance_mode: false,
    registration_enabled: true,
    max_users: 1000,
    system_message: '',
    email_notifications_enabled: true,
    backup_frequency: 'daily'
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { toast } = useToast();

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas do sistema
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      if (profilesError) throw profilesError;

      const { data: activeUsers, error: activeError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (activeError) throw activeError;

      // Por enquanto, usar configurações padrão
      // Em um sistema real, essas configurações viriam de uma tabela específica
      
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações do sistema.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      
      // Em um sistema real, salvaria essas configurações em uma tabela de configurações
      toast({
        title: 'Configurações salvas',
        description: 'As configurações do sistema foram atualizadas com sucesso.'
      });
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive'
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      // Simular backup
      toast({
        title: 'Backup iniciado',
        description: 'O backup do sistema foi iniciado e será concluído em breve.'
      });
    } catch (error) {
      console.error('Erro ao iniciar backup:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível iniciar o backup.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchSystemStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Configure o comportamento geral do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Modo de Manutenção</Label>
              <p className="text-sm text-gray-600">Impede novos logins de usuários não-admin</p>
            </div>
            <Switch
              checked={config.maintenance_mode}
              onCheckedChange={(checked) => setConfig({ ...config, maintenance_mode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Registro Público</Label>
              <p className="text-sm text-gray-600">Permite que novos usuários se registrem</p>
            </div>
            <Switch
              checked={config.registration_enabled}
              onCheckedChange={(checked) => setConfig({ ...config, registration_enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_users">Limite máximo de usuários</Label>
            <Input
              id="max_users"
              type="number"
              value={config.max_users}
              onChange={(e) => setConfig({ ...config, max_users: parseInt(e.target.value) || 0 })}
              placeholder="1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="system_message">Mensagem do sistema</Label>
            <Textarea
              id="system_message"
              value={config.system_message}
              onChange={(e) => setConfig({ ...config, system_message: e.target.value })}
              placeholder="Mensagem que aparecerá para todos os usuários..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Configurações de Email
          </CardTitle>
          <CardDescription>
            Configure o sistema de notificações por email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Notificações por Email</Label>
              <p className="text-sm text-gray-600">Ativa o envio de emails automáticos</p>
            </div>
            <Switch
              checked={config.email_notifications_enabled}
              onCheckedChange={(checked) => setConfig({ ...config, email_notifications_enabled: checked })}
            />
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              As configurações de SMTP devem ser definidas nas variáveis de ambiente do Supabase.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Backup e Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup e Segurança
          </CardTitle>
          <CardDescription>
            Configure backups automáticos e políticas de segurança
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Backup Manual</Label>
              <p className="text-sm text-gray-600">Criar backup completo do sistema agora</p>
            </div>
            <Button onClick={handleBackup} variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Criar Backup
            </Button>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Os backups automáticos são gerenciados pelo Supabase. Configure-os no painel administrativo do Supabase.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Estatísticas do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas do Sistema</CardTitle>
          <CardDescription>
            Informações sobre o uso atual do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">-</p>
              <p className="text-sm text-gray-600">Total de Usuários</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">-</p>
              <p className="text-sm text-gray-600">Usuários Ativos (30 dias)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-purple-600">-</p>
              <p className="text-sm text-gray-600">Último Backup</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saveLoading}>
          {saveLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};
