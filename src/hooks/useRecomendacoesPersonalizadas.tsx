
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RecomendacaoPersonalizada {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'campanha' | 'contato' | 'acao';
  prioridade: 'alta' | 'media' | 'baixa';
  confianca: number;
  baseado_em: string[];
}

export const useRecomendacoesPersonalizadas = () => {
  const [recomendacoes, setRecomendacoes] = useState<RecomendacaoPersonalizada[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(true);
      // Simulando dados de recomendações
      setTimeout(() => {
        setRecomendacoes([
          {
            id: '1',
            titulo: 'Contatar líderes inativos',
            descricao: 'Há 15 líderes sem contato nos últimos 30 dias',
            tipo: 'contato',
            prioridade: 'alta',
            confianca: 85,
            baseado_em: ['histórico de contatos', 'engajamento']
          },
          {
            id: '2',
            titulo: 'Agendar reunião pública',
            descricao: 'Baseado no crescimento de demandas na região Norte',
            tipo: 'campanha',
            prioridade: 'media',
            confianca: 72,
            baseado_em: ['análise de demandas', 'localização']
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  return { recomendacoes, loading };
};
