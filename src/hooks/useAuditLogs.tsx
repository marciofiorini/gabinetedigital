
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AuditLog {
  id: string;
  user_id: string;
  changed_by: string;
  action: string;
  role_changed?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const logAction = async (action: string, details?: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('access_logs')
        .insert({
          user_id: user.id,
          changed_by: user.id,
          action,
          new_value: details ? JSON.stringify(details) : null
        });

      if (error) throw error;
      fetchLogs(); // Refresh logs
    } catch (error) {
      console.error('Erro ao registrar ação:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  return {
    logs,
    loading,
    fetchLogs,
    logAction
  };
};
