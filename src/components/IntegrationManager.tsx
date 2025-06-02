
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Instagram, 
  Send, 
  Settings, 
  Zap,
  Check,
  AlertCircle
} from 'lucide-react';
import { useToastEnhanced } from '@/hooks/useToastEnhanced';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  isConnected: boolean;
  isEnabled: boolean;
  hasApiKey: boolean;
}

export const IntegrationManager: React.FC = () => {
  const { showSuccess, showError, showInfo } = useToastEnhanced();
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Envie mensagens e notificações via WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      isConnected: false,
      isEnabled: false,
      hasApiKey: false
    },
    {
      id: 'email',
      name: 'Email Marketing',
      description: 'Envie emails e newsletters automaticamente',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      isConnected: false,
      isEnabled: false,
      hasApiKey: false
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Integração com Instagram para campanhas',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      isConnected: false,
      isEnabled: false,
      hasApiKey: false
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Conecte com mais de 5000 aplicativos',
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      isConnected: false,
      isEnabled: false,
      hasApiKey: false
    }
  ]);

  const [webhookUrls, setWebhookUrls] = useState<Record<string, string>>({});
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const toggleIntegration = (id: string, enabled: boolean) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id ? { ...integration, isEnabled: enabled } : integration
      )
    );
    
    if (enabled) {
      showSuccess('Integração Ativada', `${integrations.find(i => i.id === id)?.name} foi ativada`);
    } else {
      showInfo('Integração Desativada', `${integrations.find(i => i.id === id)?.name} foi desativada`);
    }
  };

  const connectIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    // Simular conexão
    setIntegrations(prev =>
      prev.map(i =>
        i.id === id ? { ...i, isConnected: true, hasApiKey: true } : i
      )
    );

    showSuccess('Integração Conectada', `${integration.name} foi conectada com sucesso!`);
  };

  const testIntegration = async (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    showInfo('Teste Iniciado', `Testando integração ${integration.name}...`);

    // Simular teste de integração
    setTimeout(() => {
      if (Math.random() > 0.3) {
        showSuccess('Teste Bem-sucedido', `${integration.name} está funcionando corretamente!`);
      } else {
        showError('Teste Falhou', `Erro ao testar ${integration.name}. Verifique as configurações.`);
      }
    }, 2000);
  };

  const sendTestMessage = async (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (id === 'whatsapp') {
      showInfo('Mensagem Enviada', 'Mensagem de teste enviada via WhatsApp!');
    } else if (id === 'email') {
      showInfo('Email Enviado', 'Email de teste enviado!');
    } else {
      showInfo('Teste Realizado', `Teste realizado para ${integration.name}!`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gerenciar Integrações</h2>
        <p className="text-gray-600">Configure e gerencie suas integrações externas</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="configure">Configurar</TabsTrigger>
          <TabsTrigger value="test">Testar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration) => {
              const IconComponent = integration.icon;
              return (
                <Card key={integration.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${integration.color} opacity-10 rounded-bl-full`}></div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${integration.color} flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription className="text-sm">{integration.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {integration.isConnected ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Conectado
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Desconectado
                          </Badge>
                        )}
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`switch-${integration.id}`} className="text-xs">Ativo</Label>
                          <Switch
                            id={`switch-${integration.id}`}
                            checked={integration.isEnabled}
                            onCheckedChange={(enabled) => toggleIntegration(integration.id, enabled)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {!integration.isConnected ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => connectIntegration(integration.id)}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Conectar
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => testIntegration(integration.id)}
                          >
                            Testar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sendTestMessage(integration.id)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Enviar Teste
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="configure" className="space-y-6">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <integration.icon className="w-5 h-5" />
                  {integration.name}
                </CardTitle>
                <CardDescription>Configure as credenciais para {integration.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {integration.id === 'whatsapp' && (
                  <>
                    <div>
                      <Label htmlFor="whatsapp-token">Token da API WhatsApp Business</Label>
                      <Input
                        id="whatsapp-token"
                        type="password"
                        placeholder="Digite seu token da API"
                        value={apiKeys[integration.id] || ''}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, [integration.id]: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp-phone">Número do Telefone</Label>
                      <Input
                        id="whatsapp-phone"
                        placeholder="+55 11 99999-9999"
                        value={webhookUrls[integration.id] || ''}
                        onChange={(e) => setWebhookUrls(prev => ({ ...prev, [integration.id]: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                
                {integration.id === 'email' && (
                  <>
                    <div>
                      <Label htmlFor="email-smtp">Servidor SMTP</Label>
                      <Input
                        id="email-smtp"
                        placeholder="smtp.gmail.com"
                        value={webhookUrls[integration.id] || ''}
                        onChange={(e) => setWebhookUrls(prev => ({ ...prev, [integration.id]: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-key">Chave da API Email</Label>
                      <Input
                        id="email-key"
                        type="password"
                        placeholder="Digite sua chave da API"
                        value={apiKeys[integration.id] || ''}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, [integration.id]: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                {integration.id === 'zapier' && (
                  <div>
                    <Label htmlFor="zapier-webhook">Webhook URL do Zapier</Label>
                    <Input
                      id="zapier-webhook"
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      value={webhookUrls[integration.id] || ''}
                      onChange={(e) => setWebhookUrls(prev => ({ ...prev, [integration.id]: e.target.value }))}
                    />
                  </div>
                )}

                <Button onClick={() => connectIntegration(integration.id)}>
                  Salvar Configuração
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testar Integrações</CardTitle>
              <CardDescription>Execute testes para verificar se suas integrações estão funcionando</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations
                .filter(integration => integration.isConnected)
                .map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <integration.icon className="w-5 h-5" />
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">Status: Conectado</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testIntegration(integration.id)}
                      >
                        Testar Conexão
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => sendTestMessage(integration.id)}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Enviar Teste
                      </Button>
                    </div>
                  </div>
                ))}
              
              {integrations.filter(i => i.isConnected).length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma integração conectada. Configure suas integrações na aba "Configurar".
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
