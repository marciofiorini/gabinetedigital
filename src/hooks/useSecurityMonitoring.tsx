
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
        .in('action', ['failed_login_attempt', 'login', 'logout', 'password_updated', 'role_changed'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSecurityEvents(data || []);
    } catch (error) {
      console.error('Error fetching security events:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSessionValidity = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('access_logs')
        .select('created_at')
        .eq('user_id', user.id)
        .in('action', ['login', 'page_access', 'api_call'])
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return false;
      
      const lastActivity = new Date(data[0].created_at);
      const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000);
      
      return lastActivity > eightHoursAgo;
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
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
      await supabase.rpc('log_user_action', {
        p_action: action,
        p_module: 'security',
        p_changes: details
      });
      
      // Refresh events after logging
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
