
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedAuditLog {
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

interface SecurityMetrics {
  totalEvents: number;
  securityEvents: number;
  failedLogins: number;
  sessionValidations: number;
  lastActivity: Date | null;
}

export const useEnhancedAuditLogs = () => {
  const [logs, setLogs] = useState<EnhancedAuditLog[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    securityEvents: 0,
    failedLogins: 0,
    sessionValidations: 0,
    lastActivity: null
  });
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    modulo: '',
    acao: '',
    dataInicio: '',
    dataFim: '',
    severity: '',
    entityType: ''
  });
  const { user } = useAuth();

  const fetchEnhancedLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500); // Increased limit for better analytics

      // Apply enhanced filters
      if (filtros.modulo) {
        query = query.eq('module', filtros.modulo);
      }
      if (filtros.acao) {
        query = query.ilike('action', `%${filtros.acao}%`);
      }
      if (filtros.entityType) {
        query = query.eq('entity_type', filtros.entityType);
      }
      if (filtros.dataInicio) {
        query = query.gte('created_at', filtros.dataInicio);
      }
      if (filtros.dataFim) {
        query = query.lte('created_at', filtros.dataFim);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const enhancedLogs = (data || []) as EnhancedAuditLog[];
      setLogs(enhancedLogs);
      
      // Calculate security metrics
      const metrics = calculateSecurityMetrics(enhancedLogs);
      setSecurityMetrics(metrics);
      
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria aprimorados:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSecurityMetrics = (logs: EnhancedAuditLog[]): SecurityMetrics => {
    const securityEvents = logs.filter(log => log.module === 'security');
    const failedLogins = logs.filter(log => log.action === 'failed_login');
    const sessionValidations = logs.filter(log => log.action === 'session_validation');
    
    const lastActivity = logs.length > 0 ? new Date(logs[0].created_at) : null;

    return {
      totalEvents: logs.length,
      securityEvents: securityEvents.length,
      failedLogins: failedLogins.length,
      sessionValidations: sessionValidations.length,
      lastActivity
    };
  };

  const logEnhancedAction = async (
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
      const { error } = await supabase.rpc('log_user_action', {
        p_action: action,
        p_module: module || 'system',
        p_entity_type: entityType,
        p_entity_id: entityId,
        p_old_value: oldValue ? JSON.stringify(oldValue) : null,
        p_new_value: newValue ? JSON.stringify(newValue) : null,
        p_changes: changes
      });

      if (error) throw error;
      
      // Refresh logs after successful logging
      fetchEnhancedLogs();
    } catch (error) {
      console.error('Erro ao registrar ação aprimorada:', error);
    }
  };

  const logSecurityEvent = async (eventType: string, details?: any) => {
    if (!user) return;

    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_user_id: user.id,
        p_ip_address: null, // Client-side can't reliably get IP
        p_user_agent: navigator.userAgent,
        p_details: details
      });
      
      // Refresh logs after security event
      fetchEnhancedLogs();
    } catch (error) {
      console.error('Erro ao registrar evento de segurança:', error);
    }
  };

  const getModulosDisponiveis = () => {
    const modulos = [...new Set(logs.map(log => log.module).filter(Boolean))];
    return modulos.sort();
  };

  const getEntityTypesDisponiveis = () => {
    const entityTypes = [...new Set(logs.map(log => log.entity_type).filter(Boolean))];
    return entityTypes.sort();
  };

  const getEstatisticasAprimoradas = () => {
    const hoje = new Date().toISOString().split('T')[0];
    const logsHoje = logs.filter(log => log.created_at.startsWith(hoje));
    
    const acoesPorModulo = logs.reduce((acc, log) => {
      if (log.module) {
        acc[log.module] = (acc[log.module] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const acoesPorTipo = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const usuariosAtivos = new Set(logs.map(log => log.user_id)).size;

    return {
      totalLogs: logs.length,
      logsHoje: logsHoje.length,
      moduloMaisAtivo: Object.entries(acoesPorModulo).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
      acaoMaisFrequente: Object.entries(acoesPorTipo).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
      usuariosAtivos,
      acoesPorModulo,
      acoesPorTipo,
      securityMetrics
    };
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchEnhancedLogs();
    
    const channel = supabase
      .channel('enhanced-audit-logs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'access_logs'
        },
        () => {
          fetchEnhancedLogs(); // Refresh on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, filtros]);

  return {
    logs,
    securityMetrics,
    loading,
    filtros,
    setFiltros,
    fetchEnhancedLogs,
    logEnhancedAction,
    logSecurityEvent,
    getModulosDisponiveis,
    getEntityTypesDisponiveis,
    getEstatisticasAprimoradas
  };
};
