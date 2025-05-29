
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
      
      // Tentar usar a nova função primeiro, se falhar usar a antiga
      let { data, error } = await supabase.rpc('get_dashboard_stats_complete', {
        target_user_id: user.id
      });

      if (error || !data || data.length === 0) {
        // Fallback para função antiga
        const { data: oldData, error: oldError } = await supabase.rpc('get_dashboard_stats', {
          target_user_id: user.id
        });

        if (oldError) throw oldError;

        if (oldData && oldData.length > 0) {
          // Buscar aniversariantes separadamente
          const { data: aniversariantes, error: anivError } = await supabase
            .from('contatos')
            .select('id')
            .eq('user_id', user.id)
            .not('data_nascimento', 'is', null);

          let aniversariantes_hoje = 0;
          if (!anivError && aniversariantes) {
            const hoje = new Date();
            aniversariantes_hoje = aniversariantes.filter(contato => {
              // Implementar lógica de aniversário aqui se necessário
              return false; // Por enquanto retorna 0
            }).length;
          }

          setStats({
            ...oldData[0],
            aniversariantes_hoje
          });
        }
      } else {
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
