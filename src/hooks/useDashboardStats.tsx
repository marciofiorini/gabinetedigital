
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
  const [stats, setStats] = useState<DashboardStats>({
    demandas_pendentes: 0,
    eventos_hoje: 0,
    novos_contatos_hoje: 0,
    leads_novos: 0,
    aniversariantes_hoje: 0
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

      // Buscar aniversariantes do dia
      const hoje = new Date();
      const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
      const diaHoje = String(hoje.getDate()).padStart(2, '0');

      const { count: aniversariantesHoje, error: aniversariantesError } = await supabase
        .from('contatos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('data_nascimento', 'is', null)
        .like('data_nascimento', `%-${mesHoje}-${diaHoje}`);

      if (aniversariantesError) {
        console.error('Erro ao buscar aniversariantes:', aniversariantesError);
      }

      if (data && data.length > 0) {
        setStats({
          demandas_pendentes: Number(data[0].demandas_pendentes),
          eventos_hoje: Number(data[0].eventos_hoje),
          novos_contatos_hoje: Number(data[0].novos_contatos_hoje),
          leads_novos: Number(data[0].leads_novos),
          aniversariantes_hoje: aniversariantesHoje || 0
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
