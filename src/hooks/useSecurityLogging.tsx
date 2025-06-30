
import { supabase } from '@/integrations/supabase/client';

export const useSecurityLogging = () => {
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const logSecurityEvent = async (action: string, details: any, userId?: string) => {
    try {
      await supabase.from('access_logs').insert({
        user_id: details.user_id || userId || null,
        action,
        module: 'auth',
        entity_type: 'security_event',
        changes: details,
        user_agent: navigator.userAgent,
        ip_address: details.ip_address || await getClientIP(),
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  };

  return {
    logSecurityEvent,
    getClientIP
  };
};
