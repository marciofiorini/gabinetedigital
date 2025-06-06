
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  id: string;
  action: string;
  module?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  old_value?: string;
}

export const useSecurityMonitoring = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchSecurityEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('access_logs')
        .select('id, action, module, ip_address, user_agent, created_at, old_value')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching security events:', error);
        return;
      }
      setSecurityEvents(data || []);
    } catch (error) {
      console.error('Error fetching security events:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSessionValidity = async () => {
    if (!user) return false;
    return true; // Simplified for now
  };

  const getFailedLoginAttempts = (email?: string) => {
    return securityEvents.filter(event => 
      event.action === 'failed_login_attempt' && 
      (!email || event.old_value === email)
    );
  };

  const getRecentLogins = () => {
    return securityEvents.filter(event => event.action === 'login');
  };

  const logSecurityAction = async (action: string, details?: any) => {
    if (!user) return;
    
    try {
      await supabase
        .from('access_logs')
        .insert({
          user_id: user.id,
          changed_by: user.id,
          action: action,
          module: 'security',
          changes: details
        });
      
      fetchSecurityEvents();
    } catch (error) {
      console.error('Error logging security action:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSecurityEvents();
    }
  }, [user]);

  return {
    securityEvents,
    loading,
    fetchSecurityEvents,
    checkSessionValidity,
    getFailedLoginAttempts,
    getRecentLogins,
    logSecurityAction
  };
};
