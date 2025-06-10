
import { useAuth } from '@/contexts/AuthContext';

export const useUserSettings = () => {
  const { settings, updateSettings, loading } = useAuth();

  return {
    settings,
    updateSettings,
    loading
  };
};
