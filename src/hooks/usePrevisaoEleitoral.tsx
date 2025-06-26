
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PrevisaoEleitoral {
  id: string;
  cenario: 'otimista' | 'realista' | 'pessimista';
  percentual_votos: number;
  margem_erro: number;
  fatores_influencia: string[];
  data_eleicao: string;
  confiabilidade: number;
  tendencia: 'crescimento' | 'estabilidade' | 'queda';
}

export const usePrevisaoEleitoral = () => {
  const [previsoes, setPrevisoes] = useState<PrevisaoEleitoral[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const calcularPrevisao = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Buscar dados históricos
      const { data: dadosEleitorais } = await supabase
        .from('dados_eleitorais')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_candidato_proprio', true);

      const { data: redesSociais } = await supabase
        .from('dados_redes_sociais')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_candidato_proprio', true);

      const { data: contatos } = await supabase
        .from('contatos')
        .select('*')
        .eq('user_id', user.id);

      // Algoritmo de previsão baseado em múltiplos fatores
      const basePercentual = dadosEleitorais && dadosEleitorais.length > 0 
        ? dadosEleitorais[dadosEleitorais.length - 1].percentual_votos || 0
        : 0;

      const crescimentoRedes = redesSociais && redesSociais.length > 1
        ? ((redesSociais[redesSociais.length - 1].seguidores || 0) - (redesSociais[0].seguidores || 0)) / (redesSociais[0].seguidores || 1)
        : 0;

      const baseContatos = contatos ? contatos.length : 0;
      const fatorEngajamento = redesSociais && redesSociais.length > 0
        ? redesSociais[redesSociais.length - 1].engajamento_medio || 0
        : 0;

      // Cenários de previsão
      const previsoesCenarios: PrevisaoEleitoral[] = [
        {
          id: 'otimista',
          cenario: 'otimista',
          percentual_votos: Math.min(basePercentual * 1.3 + (crescimentoRedes * 100) + (fatorEngajamento * 0.1), 100),
          margem_erro: 3.5,
          fatores_influencia: ['crescimento_redes_sociais', 'alto_engajamento', 'expansao_base'],
          data_eleicao: '2026-10-04',
          confiabilidade: 70,
          tendencia: 'crescimento'
        },
        {
          id: 'realista',
          cenario: 'realista',
          percentual_votos: basePercentual + (crescimentoRedes * 50) + (fatorEngajamento * 0.05),
          margem_erro: 2.8,
          fatores_influencia: ['tendencia_atual', 'engajamento_medio', 'base_estavel'],
          data_eleicao: '2026-10-04',
          confiabilidade: 85,
          tendencia: 'estabilidade'
        },
        {
          id: 'pessimista',
          cenario: 'pessimista',
          percentual_votos: Math.max(basePercentual * 0.8 + (crescimentoRedes * 20), 0),
          margem_erro: 4.2,
          fatores_influencia: ['cenario_adverso', 'baixo_engajamento', 'perda_base'],
          data_eleicao: '2026-10-04',
          confiabilidade: 75,
          tendencia: 'queda'
        }
      ];

      setPrevisoes(previsoesCenarios);
    } catch (error) {
      console.error('Erro ao calcular previsão:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      calcularPrevisao();
    }
  }, [user]);

  return { previsoes, loading, calcularPrevisao };
};
