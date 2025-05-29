
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Shield, Users, UserPlus, History, Settings } from 'lucide-react';
import { UserManagement } from '@/components/admin/UserManagement';
import { CreateUser } from '@/components/admin/CreateUser';
import { AccessLogs } from '@/components/admin/AccessLogs';
import { SystemSettings } from '@/components/admin/SystemSettings';

export default function Administracao() {
  const { isAdmin, loading } = useUserRoles();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
            <p className="text-gray-600">Você não tem permissão para acessar a área administrativa.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Administração do Sistema
        </h1>
        <p className="text-gray-600">Gerencie usuários, permissões e configurações do sistema</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Criar Usuário
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Logs de Acesso
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <CreateUser />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <AccessLogs />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
