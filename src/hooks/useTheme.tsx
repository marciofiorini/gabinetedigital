
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadTheme = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_settings')
          .select('dark_mode')
          .eq('user_id', user.id)
          .single();
        
        if (data?.dark_mode) {
          setIsDarkMode(data.dark_mode);
          document.documentElement.classList.toggle('dark', data.dark_mode);
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
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          dark_mode: newMode
        });
    }
  };

  return { isDarkMode, toggleTheme };
};
