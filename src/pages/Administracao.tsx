
import { useState } from 'react';
import { LayoutMain } from '@/components/LayoutMain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRoles } from '@/hooks/useUserRoles';
import { UserManagement } from '@/components/admin/UserManagement';
import { EnhancedSecurityDashboard } from '@/components/security/EnhancedSecurityDashboard';
import { SecurityMonitoringDashboard } from '@/components/security/SecurityMonitoringDashboard';
import { EnhancedAccessLogs } from '@/components/admin/EnhancedAccessLogs';
import { Shield, Users, Activity, Settings, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Administracao = () => {
  const { isAdmin, loading } = useUserRoles();

  if (loading) {
    return (
      <LayoutMain>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando permissões...</p>
          </div>
        </div>
      </LayoutMain>
    );
  }

  if (!isAdmin()) {
    return (
      <LayoutMain>
        <div className="max-w-4xl mx-auto p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Acesso Negado:</strong> Você precisa ter permissões de administrador para acessar esta página.
            </AlertDescription>
          </Alert>
        </div>
      </LayoutMain>
    );
  }

  return (
    <LayoutMain>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Administração do Sistema</h1>
            <p className="text-gray-600">Gerenciamento de usuários, segurança e configurações do sistema</p>
          </div>
        </div>

        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Monitoramento
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Logs de Acesso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security">
            <EnhancedSecurityDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="monitoring">
            <SecurityMonitoringDashboard />
          </TabsContent>

          <TabsContent value="logs">
            <EnhancedAccessLogs />
          </TabsContent>
        </Tabs>
      </div>
    </LayoutMain>
  );
};

export default Administracao;
