
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationSettings } from '@/components/NotificationSettings';
import { PWAFeatures } from '@/components/PWAFeatures';
import { Settings, Bell, Smartphone, Shield, Palette, Globe, User } from 'lucide-react';
import { UserProfileSettings } from '@/components/UserProfileSettings';
import { SecuritySettings } from '@/components/SecuritySettings';
import { AppearanceSettings } from '@/components/AppearanceSettings';
import { GeneralSettings } from '@/components/GeneralSettings';

const Configuracoes = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="geral" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Mobile/PWA
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <UserProfileSettings />
        </TabsContent>

        <TabsContent value="geral">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="notificacoes">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="mobile">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Recursos Mobile e PWA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PWAFeatures />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instruções para Instalação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Para desenvolvedores:</h4>
                  <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                    <p>1. Transfira o projeto para seu GitHub via "Export to Github"</p>
                    <p>2. Faça git pull do projeto</p>
                    <p>3. Execute: npm install</p>
                    <p>4. Para iOS: npx cap add ios && npx cap run ios</p>
                    <p>5. Para Android: npx cap add android && npx cap run android</p>
                    <p>6. Build: npm run build && npx cap sync</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recursos Implementados:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>PWA com instalação automática</li>
                    <li>Service Worker para cache offline</li>
                    <li>Splash screen nativa</li>
                    <li>Feedback háptico</li>
                    <li>Compartilhamento nativo</li>
                    <li>Detecção de status de rede</li>
                    <li>Configuração para iOS e Android</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seguranca">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="aparencia">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
