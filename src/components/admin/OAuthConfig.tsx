
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Check, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OAuthProvider {
  id: string;
  name: string;
  description: string;
  clientIdLabel: string;
  clientSecretLabel: string;
  redirectUrl: string;
  setupUrl: string;
  isEnabled: boolean;
  isConfigured: boolean;
}

export const OAuthConfig: React.FC = () => {
  const { toast } = useToast();
  
  const [providers, setProviders] = useState<OAuthProvider[]>([
    {
      id: 'google',
      name: 'Google',
      description: 'Permitir login com contas Google',
      clientIdLabel: 'Client ID',
      clientSecretLabel: 'Client Secret',
      redirectUrl: `${window.location.origin}/auth/callback`,
      setupUrl: 'https://console.cloud.google.com/apis/credentials',
      isEnabled: false,
      isConfigured: false
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Permitir login com contas Facebook',
      clientIdLabel: 'App ID',
      clientSecretLabel: 'App Secret',
      redirectUrl: `${window.location.origin}/auth/callback`,
      setupUrl: 'https://developers.facebook.com/apps',
      isEnabled: false,
      isConfigured: false
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Permitir login com contas LinkedIn',
      clientIdLabel: 'Client ID',
      clientSecretLabel: 'Client Secret',
      redirectUrl: `${window.location.origin}/auth/callback`,
      setupUrl: 'https://www.linkedin.com/developers/apps',
      isEnabled: false,
      isConfigured: false
    }
  ]);

  const [credentials, setCredentials] = useState<Record<string, { clientId: string; clientSecret: string }>>({});

  const handleToggleProvider = (providerId: string, enabled: boolean) => {
    setProviders(prev =>
      prev.map(p =>
        p.id === providerId ? { ...p, isEnabled: enabled } : p
      )
    );

    if (enabled) {
      toast({
        title: "Provider Ativado",
        description: `Login com ${providers.find(p => p.id === providerId)?.name} foi ativado`
      });
    }
  };

  const handleSaveCredentials = (providerId: string) => {
    const creds = credentials[providerId];
    if (!creds?.clientId || !creds?.clientSecret) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setProviders(prev =>
      prev.map(p =>
        p.id === providerId ? { ...p, isConfigured: true } : p
      )
    );

    toast({
      title: "Credenciais Salvas",
      description: `Credenciais do ${providers.find(p => p.id === providerId)?.name} foram configuradas`
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "URL copiada para a área de transferência"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configuração OAuth</h2>
        <p className="text-gray-600">Configure provedores de autenticação social</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Para configurar OAuth, você precisa criar aplicações nos respectivos provedores e configurar as URLs de redirecionamento corretamente.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="providers">Provedores</TabsTrigger>
          <TabsTrigger value="setup">Instruções</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          {providers.map((provider) => (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {provider.name}
                      {provider.isConfigured && (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Configurado
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{provider.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`switch-${provider.id}`}>Ativo</Label>
                    <Switch
                      id={`switch-${provider.id}`}
                      checked={provider.isEnabled}
                      onCheckedChange={(enabled) => handleToggleProvider(provider.id, enabled)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{provider.clientIdLabel}</Label>
                    <Input
                      type="password"
                      placeholder={`Digite o ${provider.clientIdLabel}`}
                      value={credentials[provider.id]?.clientId || ''}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        [provider.id]: {
                          ...prev[provider.id],
                          clientId: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>{provider.clientSecretLabel}</Label>
                    <Input
                      type="password"
                      placeholder={`Digite o ${provider.clientSecretLabel}`}
                      value={credentials[provider.id]?.clientSecret || ''}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        [provider.id]: {
                          ...prev[provider.id],
                          clientSecret: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>URL de Redirecionamento</Label>
                  <div className="flex gap-2">
                    <Input
                      value={provider.redirectUrl}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(provider.redirectUrl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Use esta URL na configuração do seu app {provider.name}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleSaveCredentials(provider.id)}>
                    Salvar Configuração
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={provider.setupUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Configurar no {provider.name}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instruções de Configuração</CardTitle>
              <CardDescription>
                Siga estes passos para configurar cada provedor OAuth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Google OAuth</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Acesse o Google Cloud Console</li>
                  <li>Crie um novo projeto ou selecione um existente</li>
                  <li>Ative a API Google+ e OAuth2</li>
                  <li>Crie credenciais OAuth 2.0</li>
                  <li>Configure as URLs de redirecionamento autorizadas</li>
                  <li>Copie o Client ID e Client Secret</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Facebook OAuth</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Acesse o Facebook Developers</li>
                  <li>Crie um novo app ou selecione um existente</li>
                  <li>Adicione o produto "Facebook Login"</li>
                  <li>Configure as URLs de redirecionamento válidas</li>
                  <li>Copie o App ID e App Secret</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">LinkedIn OAuth</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Acesse o LinkedIn Developers</li>
                  <li>Crie uma nova aplicação</li>
                  <li>Configure os produtos necessários</li>
                  <li>Adicione as URLs de redirecionamento autorizadas</li>
                  <li>Copie o Client ID e Client Secret</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
