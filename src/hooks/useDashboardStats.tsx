
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
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Buscar dados principais da função
      const { data, error } = await supabase.rpc('get_dashboard_stats', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }

      // Buscar aniversariantes do dia usando o mesmo método do hook useAniversariantes
      const hoje = new Date();
      const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
      const diaHoje = String(hoje.getDate()).padStart(2, '0');

      const { data: contatosData, error: aniversariantesError } = await supabase
        .from('contatos')
        .select('data_nascimento')
        .eq('user_id', user.id)
        .not('data_nascimento', 'is', null);

      let aniversariantesHoje = 0;
      if (!aniversariantesError && contatosData) {
        aniversariantesHoje = contatosData.filter(contato => {
          if (!contato.data_nascimento) return false;
          
          const dataNascimento = new Date(contato.data_nascimento);
          const mesNascimento = String(dataNascimento.getMonth() + 1).padStart(2, '0');
          const diaNascimento = String(dataNascimento.getDate()).padStart(2, '0');
          
          return mesNascimento === mesHoje && diaNascimento === diaHoje;
        }).length;
      }

      if (aniversariantesError) {
        console.error('Erro ao buscar aniversariantes:', aniversariantesError);
      }

      // Garantir que sempre temos valores válidos
      const newStats = {
        demandas_pendentes: (data && data.length > 0) ? Number(data[0].demandas_pendentes || 0) : 0,
        eventos_hoje: (data && data.length > 0) ? Number(data[0].eventos_hoje || 0) : 0,
        novos_contatos_hoje: (data && data.length > 0) ? Number(data[0].novos_contatos_hoje || 0) : 0,
        leads_novos: (data && data.length > 0) ? Number(data[0].leads_novos || 0) : 0,
        aniversariantes_hoje: aniversariantesHoje
      };

      console.log('Stats atualizadas:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Manter valores padrão em caso de erro
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
