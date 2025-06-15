
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLGPDCompliance } from '@/hooks/useLGPDCompliance';
import { Bell, Clock, AlertTriangle } from 'lucide-react';

interface ConsentNotification {
  id: string;
  consent_type: string;
  expires_in_days: number;
  auto_remind: boolean;
}

export const ConsentNotificationManager = () => {
  const { configureConsentNotifications, loading } = useLGPDCompliance();
  const [notifications, setNotifications] = useState<ConsentNotification[]>([
    {
      id: '1',
      consent_type: 'marketing',
      expires_in_days: 30,
      auto_remind: true
    },
    {
      id: '2',
      consent_type: 'analytics',
      expires_in_days: 90,
      auto_remind: false
    }
  ]);

  const handleNotificationChange = (id: string, field: keyof ConsentNotification, value: any) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, [field]: value }
        : notification
    ));
  };

  const handleSave = async () => {
    await configureConsentNotifications(notifications);
  };

  const addNotification = () => {
    const newNotification: ConsentNotification = {
      id: Date.now().toString(),
      consent_type: 'cookies',
      expires_in_days: 30,
      auto_remind: true
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificações de Consentimento
        </CardTitle>
        <CardDescription>
          Configure lembretes automáticos para renovação de consentimentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <Label className="font-medium">Configuração de Lembrete</Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                >
                  Remover
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Consentimento</Label>
                  <Select
                    value={notification.consent_type}
                    onValueChange={(value) => handleNotificationChange(notification.id, 'consent_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="cookies">Cookies</SelectItem>
                      <SelectItem value="data_processing">Processamento de Dados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Expira em (dias)</Label>
                  <Input
                    type="number"
                    value={notification.expires_in_days}
                    onChange={(e) => handleNotificationChange(notification.id, 'expires_in_days', parseInt(e.target.value))}
                    min="1"
                    max="365"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Switch
                      checked={notification.auto_remind}
                      onCheckedChange={(checked) => handleNotificationChange(notification.id, 'auto_remind', checked)}
                    />
                    Lembrete Automático
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enviar notificação 7 dias antes da expiração
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={addNotification}>
            Adicionar Configuração
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Sobre as Notificações</h4>
              <p className="text-sm text-yellow-700 mt-1">
                As notificações são enviadas automaticamente quando configuradas. 
                Consentimentos com data de expiração próxima serão destacados para renovação.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
