
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Globe, Save, Settings } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { toast } from 'sonner';

export const GeneralSettings = () => {
  const { settings, updateSettings, loading } = useUserSettings();
  
  const [formData, setFormData] = useState({
    language: settings?.language || 'pt-BR',
    timezone: settings?.timezone || 'America/Sao_Paulo',
    keyboard_shortcuts_enabled: settings?.keyboard_shortcuts_enabled ?? true
  });

  const handleSave = async () => {
    await updateSettings(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Configurações Gerais
        </CardTitle>
        <CardDescription>
          Configure as preferências gerais do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Fuso Horário</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => setFormData({ ...formData, timezone: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o fuso horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tóquio (GMT+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Atalhos de Teclado</Label>
            <p className="text-sm text-gray-600">Habilitar atalhos de teclado para navegação rápida</p>
          </div>
          <Switch
            checked={formData.keyboard_shortcuts_enabled}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, keyboard_shortcuts_enabled: checked })
            }
          />
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
