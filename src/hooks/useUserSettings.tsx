
import { useAuth } from '@/contexts/AuthContext';

export interface UserSettings {
  language: string;
  timezone: string;
  keyboard_shortcuts_enabled: boolean;
  theme: string;
  dark_mode: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

export const useUserSettings = () => {
  const { settings, updateSettings, loading } = useAuth();

  return {
    settings: settings ? {
      language: settings.language,
      timezone: settings.timezone,
      keyboard_shortcuts_enabled: settings.keyboard_shortcuts_enabled,
      theme: settings.theme,
      dark_mode: settings.dark_mode,
      email_notifications: settings.email_notifications,
      push_notifications: settings.push_notifications
    } : {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      keyboard_shortcuts_enabled: true,
      theme: 'light',
      dark_mode: false,
      email_notifications: true,
      push_notifications: true
    },
    updateSettings,
    loading
  };
};
