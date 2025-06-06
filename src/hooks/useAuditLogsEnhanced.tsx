
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AuditLog {
  id: string;
  user_id: string;
  changed_by: string;
  action: string;
  module?: string;
  entity_type?: string;
  entity_id?: string;
  role_changed?: string;
  old_value?: string;
  new_value?: string;
  changes?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export const useAuditLogsEnhanced = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    modulo: '',
    acao: '',
    dataInicio: '',
    dataFim: ''
  });
  const { user } = useAuth();

  const fetchLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      // Aplicar filtros
      if (filtros.modulo) {
        query = query.eq('module', filtros.modulo);
      }
      if (filtros.acao) {
        query = query.ilike('action', `%${filtros.acao}%`);
      }
      if (filtros.dataInicio) {
        query = query.gte('created_at', filtros.dataInicio);
      }
      if (filtros.dataFim) {
        query = query.lte('created_at', filtros.dataFim);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const logAction = async (
    action: string, 
    module?: string,
    entityType?: string,
    entityId?: string,
    oldValue?: any,
    newValue?: any,
    changes?: any
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .rpc('log_user_action', {
          p_action: action,
          p_module: module,
          p_entity_type: entityType,
          p_entity_id: entityId,
          p_old_value: oldValue ? JSON.stringify(oldValue) : null,
          p_new_value: newValue ? JSON.stringify(newValue) : null,
          p_changes: changes
        });

      if (error) throw error;
      fetchLogs(); // Refresh logs
    } catch (error) {
      console.error('Erro ao registrar ação:', error);
    }
  };

  const getModulosDisponiveis = () => {
    const modulos = [...new Set(logs.map(log => log.module).filter(Boolean))];
    return modulos.sort();
  };

  const getEstatisticas = () => {
    const hoje = new Date().toISOString().split('T')[0];
    const logsHoje = logs.filter(log => log.created_at.startsWith(hoje));
    
    const acoesPorModulo = logs.reduce((acc, log) => {
      if (log.module) {
        acc[log.module] = (acc[log.module] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalLogs: logs.length,
      logsHoje: logsHoje.length,
      moduloMaisAtivo: Object.entries(acoesPorModulo).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
      acoesPorModulo
    };
  };

  useEffect(() => {
    fetchLogs();
  }, [user, filtros]);

  return {
    logs,
    loading,
    filtros,
    setFiltros,
    fetchLogs,
    logAction,
    getModulosDisponiveis,
    getEstatisticas
  };
};
