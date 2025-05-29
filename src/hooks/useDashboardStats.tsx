
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  demandas_pendentes: number;
  eventos_hoje: number;
  novos_contatos_hoje: number;
  leads_novos: number;
  novos_lideres: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    demandas_pendentes: 0,
    eventos_hoje: 0,
    novos_contatos_hoje: 0,
    leads_novos: 0,
    novos_lideres: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Buscar dados principais da função
      const { data, error } = await supabase.rpc('get_dashboard_stats', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return;
      }

      // Buscar novos líderes separadamente
      const { data: novosLideres, error: lideresError } = await supabase
        .from('lideres')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', new Date().toISOString().split('T')[0])
        .count();

      if (lideresError) {
        console.error('Erro ao buscar novos líderes:', lideresError);
      }

      if (data && data.length > 0) {
        setStats({
          demandas_pendentes: Number(data[0].demandas_pendentes),
          eventos_hoje: Number(data[0].eventos_hoje),
          novos_contatos_hoje: Number(data[0].novos_contatos_hoje),
          leads_novos: Number(data[0].leads_novos),
          novos_lideres: novosLideres || 0
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
};
