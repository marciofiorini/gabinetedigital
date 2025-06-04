
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MetricaDesempenho {
  id: string;
  funcionario_id: string;
  periodo: string;
  tarefas_concluidas: number;
  tarefas_atrasadas: number;
  horas_trabalhadas: number;
  avaliacao_media: number;
  pontos_fortes: string[];
  areas_melhoria: string[];
  meta_produtividade: number;
  produtividade_atual: number;
}

export const useDesempenhoEquipe = () => {
  const [metricas, setMetricas] = useState<MetricaDesempenho[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetricas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Simular dados de desempenho por enquanto
      const mockMetricas: MetricaDesempenho[] = [
        {
          id: '1',
          funcionario_id: 'func-1',
          periodo: '2024-01',
          tarefas_concluidas: 15,
          tarefas_atrasadas: 2,
          horas_trabalhadas: 160,
          avaliacao_media: 8.5,
          pontos_fortes: ['Comunicação', 'Proatividade'],
          areas_melhoria: ['Gestão de tempo'],
          meta_produtividade: 80,
          produtividade_atual: 85
        }
      ];

      setMetricas(mockMetricas);
    } catch (error: any) {
      console.error('Erro ao buscar métricas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar métricas de desempenho",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricas();
  }, []);

  return {
    metricas,
    loading,
    fetchMetricas,
    refetch: fetchMetricas
  };
};
