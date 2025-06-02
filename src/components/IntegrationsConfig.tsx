
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IntegrationManager } from '@/components/IntegrationManager';
import { WebhookTester } from '@/components/WebhookTester';
import { NotificationSettings } from '@/components/NotificationSettings';

export const IntegrationsConfig: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrações e Configurações</h1>
        <p className="text-gray-600 mt-2">
          Configure integrações externas, webhooks e notificações
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <IntegrationManager />
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="grid gap-6">
            <WebhookTester
              title="Teste de Webhook - Zapier"
              description="Teste a integração com Zapier enviando dados de exemplo"
              defaultPayload={{
                type: "lead",
                action: "created",
                data: {
                  nome: "João Silva",
                  email: "joao@exemplo.com",
                  telefone: "(11) 99999-9999",
                  status: "novo"
                }
              }}
            />
            
            <WebhookTester
              title="Teste de Webhook - Email Marketing"
              description="Teste a integração com plataformas de email marketing"
              defaultPayload={{
                type: "contato",
                action: "created",
                data: {
                  nome: "Maria Santos",
                  email: "maria@exemplo.com",
                  zona: "centro"
                }
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
