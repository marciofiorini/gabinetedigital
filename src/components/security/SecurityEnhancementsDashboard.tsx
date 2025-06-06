
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { RealTimeSecurityMonitor } from './RealTimeSecurityMonitor';
import { SecurityTestSuite } from './SecurityTestSuite';
import { AdvancedInputValidator } from './AdvancedInputValidator';
import { useState } from 'react';

export const SecurityEnhancementsDashboard = () => {
  const [testPassword, setTestPassword] = useState('');
  const [testEmail, setTestEmail] = useState('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Security Enhancements Dashboard
          </CardTitle>
          <CardDescription>
            Recursos avançados de segurança e monitoramento implementados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monitor" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monitor">Monitor em Tempo Real</TabsTrigger>
              <TabsTrigger value="validation">Validação Avançada</TabsTrigger>
              <TabsTrigger value="testing">Testes de Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="monitor">
              <RealTimeSecurityMonitor />
            </TabsContent>

            <TabsContent value="validation">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Validação Avançada de Inputs</CardTitle>
                    <CardDescription>
                      Teste os novos validadores de segurança implementados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <AdvancedInputValidator
                        type="password"
                        value={testPassword}
                        onChange={setTestPassword}
                        label="Teste de Senha Segura"
                      />
                      <AdvancedInputValidator
                        type="email"
                        value={testEmail}
                        onChange={setTestEmail}
                        label="Teste de Email"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="testing">
              <SecurityTestSuite />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
