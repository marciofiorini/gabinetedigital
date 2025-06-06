
import { useState } from 'react';
import { toast } from 'sonner';

export interface UserSettings {
  language: string;
  timezone: string;
  keyboard_shortcuts_enabled: boolean;
  theme: string;
  dark_mode: boolean;
}

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    keyboard_shortcuts_enabled: true,
    theme: 'light',
    dark_mode: false
  });
  
  const [loading, setLoading] = useState(false);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({ ...prev, ...newSettings }));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    updateSettings,
    loading
  };
};
