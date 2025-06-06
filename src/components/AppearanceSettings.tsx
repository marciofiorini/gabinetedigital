
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Palette, Monitor, Sun, Moon, Save } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';

export const AppearanceSettings = () => {
  const { settings, updateSettings, loading } = useUserSettings();
  
  const [formData, setFormData] = useState({
    theme: settings?.theme || 'light',
    dark_mode: settings?.dark_mode || false
  });

  const handleSave = async () => {
    await updateSettings(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Configurações de Aparência
        </CardTitle>
        <CardDescription>
          Personalize a aparência da interface do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Tema do Sistema</Label>
          <Select
            value={formData.theme}
            onValueChange={(value) => setFormData({ ...formData, theme: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Claro
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Escuro
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Sistema
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Modo Escuro</Label>
            <p className="text-sm text-gray-600">Ativa o tema escuro independente das configurações do sistema</p>
          </div>
          <Switch
            checked={formData.dark_mode}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, dark_mode: checked })
            }
          />
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-4">Prévia do Tema</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-white">
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                <div className="h-8 bg-blue-500 rounded text-white flex items-center justify-center text-xs">
                  Tema Claro
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gray-900 text-white">
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                <div className="h-8 bg-blue-600 rounded text-white flex items-center justify-center text-xs">
                  Tema Escuro
                </div>
              </div>
            </div>
          </div>
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
