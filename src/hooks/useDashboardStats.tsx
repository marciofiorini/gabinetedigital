
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  demandas_pendentes: number;
  eventos_hoje: number;
  novos_contatos_hoje: number;
  leads_novos: number;
  aniversariantes_hoje: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Use the new function directly
      const { data, error } = await supabase.rpc('get_dashboard_stats_complete', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Erro na função get_dashboard_stats_complete:', error);
        // Fallback para função antiga
        const { data: oldData, error: oldError } = await supabase.rpc('get_dashboard_stats', {
          target_user_id: user.id
        });

        if (oldError) throw oldError;

        if (oldData && Array.isArray(oldData) && oldData.length > 0) {
          setStats({
            ...oldData[0],
            aniversariantes_hoje: 0 // Default value
          });
        }
      } else if (data && Array.isArray(data) && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setStats({
        demandas_pendentes: 0,
        eventos_hoje: 0,
        novos_contatos_hoje: 0,
        leads_novos: 0,
        aniversariantes_hoje: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return { stats, loading, refetch: fetchStats };
};
