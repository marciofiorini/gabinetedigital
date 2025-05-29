
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadTheme = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('user_settings')
            .select('dark_mode')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (data?.dark_mode) {
            setIsDarkMode(data.dark_mode);
            document.documentElement.classList.toggle('dark', data.dark_mode);
          }
        } catch (error) {
          console.error('Erro ao carregar tema:', error);
        }
      }
    };
    
    loadTheme();
  }, [user]);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    
    if (user) {
      try {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            dark_mode: newMode
          });
      } catch (error) {
        console.error('Erro ao salvar tema:', error);
      }
    }
  };

  return { isDarkMode, toggleTheme };
};
