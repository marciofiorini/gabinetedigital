
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type StatusAvaliacao = 'pendente' | 'em_andamento' | 'concluida' | 'aprovada';

export interface CriterioAvaliacao {
  id: string;
  avaliacao_id: string;
  criterio: string;
  nota: number;
  peso: number;
  observacoes?: string;
  created_at: string;
}

export interface AvaliacaoDesempenho {
  id: string;
  user_id: string;
  funcionario_id: string;
  periodo_inicio: string;
  periodo_fim: string;
  nota_geral?: number;
  pontos_fortes?: string;
  pontos_melhoria?: string;
  objetivos_proximos?: string;
  comentarios_avaliador?: string;
  comentarios_funcionario?: string;
  status: StatusAvaliacao;
  avaliador_id?: string;
  created_at: string;
  updated_at: string;
  funcionario?: {
    nome: string;
    cargo: string;
  };
  avaliador?: {
    nome: string;
  };
  criterios?: CriterioAvaliacao[];
}

export const useAvaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoDesempenho[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAvaliacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes_desempenho')
        .select(`
          *,
          funcionario:funcionarios!funcionario_id(nome, cargo),
          avaliador:funcionarios!avaliador_id(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvaliacoes((data || []) as AvaliacaoDesempenho[]);
    } catch (error: any) {
      console.error('Erro ao buscar avaliações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar avaliações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAvaliacao = async (avaliacao: Omit<AvaliacaoDesempenho, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'funcionario' | 'avaliador' | 'criterios'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('avaliacoes_desempenho')
        .insert([{ ...avaliacao, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setAvaliacoes(prev => [data as AvaliacaoDesempenho, ...prev]);
      return data as AvaliacaoDesempenho;
    } catch (error: any) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  };

  const updateAvaliacao = async (id: string, updates: Partial<AvaliacaoDesempenho>) => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes_desempenho')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAvaliacoes(prev => prev.map(a => a.id === id ? data as AvaliacaoDesempenho : a));
      return data as AvaliacaoDesempenho;
    } catch (error: any) {
      console.error('Erro ao atualizar avaliação:', error);
      throw error;
    }
  };

  const deleteAvaliacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('avaliacoes_desempenho')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAvaliacoes(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar avaliação:', error);
      return false;
    }
  };

  const addCriterio = async (avaliacaoId: string, criterio: Omit<CriterioAvaliacao, 'id' | 'avaliacao_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('criterios_avaliacao')
        .insert([{ ...criterio, avaliacao_id: avaliacaoId }])
        .select()
        .single();

      if (error) throw error;
      return data as CriterioAvaliacao;
    } catch (error: any) {
      console.error('Erro ao adicionar critério:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  return {
    avaliacoes,
    loading,
    fetchAvaliacoes,
    createAvaliacao,
    updateAvaliacao,
    deleteAvaliacao,
    addCriterio,
    refetch: fetchAvaliacoes
  };
};
