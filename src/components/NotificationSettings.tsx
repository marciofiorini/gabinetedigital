
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageCircle, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  isEnabled: boolean;
  isConfigured: boolean;
}

export const NotificationSettings: React.FC = () => {
  const { toast } = useToast();

  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'push',
      name: 'Notificações Push',
      description: 'Receba notificações no navegador',
      icon: Bell,
      isEnabled: false,
      isConfigured: false
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Receba notificações por email',
      icon: Mail,
      isEnabled: false,
      isConfigured: false
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Receba notificações no WhatsApp',
      icon: MessageCircle,
      isEnabled: false,
      isConfigured: false
    },
    {
      id: 'sms',
      name: 'SMS',
      description: 'Receba notificações por SMS',
      icon: Smartphone,
      isEnabled: false,
      isConfigured: false
    }
  ]);

  const [notificationTypes, setNotificationTypes] = useState({
    newLead: true,
    newDemanda: true,
    newEvento: false,
    deadlines: true,
    system: false
  });

  const handleChannelToggle = async (channelId: string, enabled: boolean) => {
    if (channelId === 'push' && enabled) {
      // Solicitar permissão para notificações push
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setChannels(prev =>
            prev.map(c =>
              c.id === channelId ? { ...c, isEnabled: enabled, isConfigured: true } : c
            )
          );
          toast({
            title: "Notificações Push Ativadas",
            description: "Você receberá notificações no navegador"
          });
        } else {
          toast({
            title: "Permissão Negada",
            description: "Não foi possível ativar as notificações push",
            variant: "destructive"
          });
          return;
        }
      }
    } else {
      setChannels(prev =>
        prev.map(c =>
          c.id === channelId ? { ...c, isEnabled: enabled } : c
        )
      );
    }
  };

  const testNotification = async (channelId: string) => {
    try {
      if (channelId === 'push' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Teste - Gabinete Digital', {
          body: 'Esta é uma notificação de teste!',
          icon: '/favicon.ico'
        });
      } else {
        // Simular teste para outros canais
        toast({
          title: "Teste Enviado",
          description: `Notificação de teste enviada via ${channels.find(c => c.id === channelId)?.name}`
        });
      }
    } catch (error) {
      toast({
        title: "Erro no Teste",
        description: "Não foi possível enviar a notificação de teste",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configurações de Notificação</h2>
        <p className="text-gray-600">Gerencie como você recebe notificações</p>
      </div>

      {/* Canais de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle>Canais de Notificação</CardTitle>
          <CardDescription>
            Configure os meios pelos quais você deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((channel) => {
            const IconComponent = channel.icon;
            return (
              <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{channel.name}</h4>
                      {channel.isConfigured && (
                        <Badge variant="secondary" className="text-xs">
                          Configurado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{channel.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {channel.isEnabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testNotification(channel.id)}
                    >
                      Testar
                    </Button>
                  )}
                  <Switch
                    checked={channel.isEnabled}
                    onCheckedChange={(enabled) => handleChannelToggle(channel.id, enabled)}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Tipos de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Notificação</CardTitle>
          <CardDescription>
            Escolha quais eventos devem gerar notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-lead">Novos Leads</Label>
              <p className="text-sm text-gray-600">Quando um novo lead for cadastrado</p>
            </div>
            <Switch
              id="new-lead"
              checked={notificationTypes.newLead}
              onCheckedChange={(checked) => 
                setNotificationTypes(prev => ({ ...prev, newLead: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-demanda">Novas Demandas</Label>
              <p className="text-sm text-gray-600">Quando uma nova demanda for criada</p>
            </div>
            <Switch
              id="new-demanda"
              checked={notificationTypes.newDemanda}
              onCheckedChange={(checked) => 
                setNotificationTypes(prev => ({ ...prev, newDemanda: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-evento">Novos Eventos</Label>
              <p className="text-sm text-gray-600">Quando um novo evento for agendado</p>
            </div>
            <Switch
              id="new-evento"
              checked={notificationTypes.newEvento}
              onCheckedChange={(checked) => 
                setNotificationTypes(prev => ({ ...prev, newEvento: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="deadlines">Prazos e Lembretes</Label>
              <p className="text-sm text-gray-600">Lembretes de prazos importantes</p>
            </div>
            <Switch
              id="deadlines"
              checked={notificationTypes.deadlines}
              onCheckedChange={(checked) => 
                setNotificationTypes(prev => ({ ...prev, deadlines: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="system">Notificações do Sistema</Label>
              <p className="text-sm text-gray-600">Atualizações e manutenções do sistema</p>
            </div>
            <Switch
              id="system"
              checked={notificationTypes.system}
              onCheckedChange={(checked) => 
                setNotificationTypes(prev => ({ ...prev, system: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Configurações Salvas", description: "Suas preferências foram atualizadas" })}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};
