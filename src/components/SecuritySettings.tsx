
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Smartphone, Eye, AlertTriangle } from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

export const SecuritySettings = () => {
  const { getRecentLogins, getFailedLoginAttempts } = useSecurityMonitoring();
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: true,
    loginNotifications: true,
    deviceTracking: true
  });

  const recentLogins = getRecentLogins();
  const failedAttempts = getFailedLoginAttempts();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Configurações de Segurança
          </CardTitle>
          <CardDescription>
            Gerencie a segurança da sua conta e monitore atividades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Autenticação de Dois Fatores</Label>
              <p className="text-sm text-gray-600">Adiciona uma camada extra de segurança à sua conta</p>
            </div>
            <Switch
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) => 
                setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Timeout de Sessão</Label>
              <p className="text-sm text-gray-600">Encerra automaticamente a sessão após inatividade</p>
            </div>
            <Switch
              checked={securitySettings.sessionTimeout}
              onCheckedChange={(checked) => 
                setSecuritySettings({ ...securitySettings, sessionTimeout: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Notificações de Login</Label>
              <p className="text-sm text-gray-600">Receba alertas sobre novos logins na sua conta</p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) => 
                setSecuritySettings({ ...securitySettings, loginNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Rastreamento de Dispositivos</Label>
              <p className="text-sm text-gray-600">Monitora dispositivos que acessam sua conta</p>
            </div>
            <Switch
              checked={securitySettings.deviceTracking}
              onCheckedChange={(checked) => 
                setSecuritySettings({ ...securitySettings, deviceTracking: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Atividade Recente
          </CardTitle>
          <CardDescription>
            Monitore os acessos recentes à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Logins Recentes</h4>
              {recentLogins.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum login recente registrado</p>
              ) : (
                <div className="space-y-2">
                  {recentLogins.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">Login realizado</p>
                        <p className="text-xs text-gray-500">{login.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{login.device}</p>
                        <p className="text-xs text-gray-500">{login.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {failedAttempts.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{failedAttempts.length} tentativa(s) de login falharam</strong> nas últimas 24 horas.
                  Verifique se não foi você e considere alterar sua senha.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ações de Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Alterar Senha
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Gerenciar Dispositivos
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Log de Auditoria
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
