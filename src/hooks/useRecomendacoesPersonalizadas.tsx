
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Recomendacao {
  id: string;
  tipo: 'acao' | 'campanha' | 'contato' | 'evento';
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  baseado_em: string[];
  confianca: number;
  data_sugestao: string;
}

export const useRecomendacoesPersonalizadas = () => {
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const gerarRecomendacoes = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Buscar histórico do usuário
      const { data: contatos } = await supabase
        .from('contatos')
        .select('*')
        .eq('user_id', user.id);

      const { data: demandas } = await supabase
        .from('demandas')
        .select('*')
        .eq('user_id', user.id);

      const { data: campanhas } = await supabase
        .from('campanhas_marketing')
        .select('*')
        .eq('user_id', user.id);

      // Gerar recomendações baseadas no histórico
      const novasRecomendacoes: Recomendacao[] = [];

      // Recomendação baseada em contatos inativos
      if (contatos && contatos.length > 0) {
        const contatosInativos = contatos.filter(c => 
          new Date(c.updated_at).getTime() < Date.now() - (30 * 24 * 60 * 60 * 1000)
        );
        
        if (contatosInativos.length > 5) {
          novasRecomendacoes.push({
            id: `rec-contatos-${Date.now()}`,
            tipo: 'campanha',
            titulo: 'Reativar Contatos Dormentes',
            descricao: `Você tem ${contatosInativos.length} contatos sem interação há mais de 30 dias. Sugiro uma campanha de reativação.`,
            prioridade: 'alta',
            baseado_em: ['histórico_contatos', 'tempo_inatividade'],
            confianca: 85,
            data_sugestao: new Date().toISOString()
          });
        }
      }

      // Recomendação baseada em demandas pendentes
      if (demandas && demandas.length > 0) {
        const demandasPendentes = demandas.filter(d => d.status === 'pendente');
        if (demandasPendentes.length > 10) {
          novasRecomendacoes.push({
            id: `rec-demandas-${Date.now()}`,
            tipo: 'acao',
            titulo: 'Otimizar Fluxo de Demandas',
            descricao: `${demandasPendentes.length} demandas pendentes. Recomendo criar fluxos automatizados para agilizar o atendimento.`,
            prioridade: 'alta',
            baseado_em: ['demandas_pendentes', 'volume_trabalho'],
            confianca: 90,
            data_sugestao: new Date().toISOString()
          });
        }
      }

      // Recomendação baseada em campanhas
      if (campanhas && campanhas.length > 0) {
        const campanhasRecentes = campanhas.filter(c => 
          new Date(c.created_at).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
        );
        
        if (campanhasRecentes.length === 0) {
          novasRecomendacoes.push({
            id: `rec-campanhas-${Date.now()}`,
            tipo: 'campanha',
            titulo: 'Aumentar Frequência de Campanhas',
            descricao: 'Não há campanhas criadas nos últimos 7 dias. Manter comunicação regular aumenta o engajamento.',
            prioridade: 'media',
            baseado_em: ['frequencia_campanhas', 'engajamento'],
            confianca: 75,
            data_sugestao: new Date().toISOString()
          });
        }
      }

      setRecomendacoes(novasRecomendacoes);
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      gerarRecomendacoes();
    }
  }, [user]);

  return { recomendacoes, loading, gerarRecomendacoes };
};
