
import { useState } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    modulo: '',
    acao: '',
    dataInicio: '',
    dataFim: ''
  });

  const fetchLogs = async () => {
    console.log('Mock: fetchLogs');
    setLogs([]);
  };

  const logAction = async () => {
    console.log('Mock: logAction');
  };

  const getModulosDisponiveis = () => {
    return [];
  };

  const getEstatisticas = () => {
    return {
      totalLogs: 0,
      logsHoje: 0,
      moduloMaisAtivo: 'N/A',
      acoesPorModulo: {}
    };
  };

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
