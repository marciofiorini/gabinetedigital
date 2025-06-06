
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AccessLogs } from "@/components/admin/AccessLogs";
import { SecurityDashboard } from "@/components/admin/SecurityDashboard";
import { TwoFactorAuth } from "@/components/admin/TwoFactorAuth";
import { EnhancedAccessLogs } from "@/components/admin/EnhancedAccessLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, Shield, FileText, Lock, Activity } from "lucide-react";

const Administracao = () => {
  const [activeTab, setActiveTab] = useState("security");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Administração e Segurança</h1>
          <p className="text-gray-600 mt-2">
            Gestão completa de usuários, segurança e compliance do sistema
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="2fa" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              2FA
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="enhanced-logs" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Auditoria
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="2fa">
            <TwoFactorAuth />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="logs">
            <AccessLogs />
          </TabsContent>

          <TabsContent value="enhanced-logs">
            <EnhancedAccessLogs />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Administracao;
