
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type StatusProjeto = 'planejamento' | 'aprovacao' | 'execucao' | 'concluido' | 'cancelado';
export type PrioridadeProjeto = 'baixa' | 'media' | 'alta' | 'urgente';
export type CategoriaProjeto = 'infraestrutura' | 'social' | 'educacao' | 'saude' | 'outros';

export interface ProjetoFinanceiro {
  id: string;
  user_id: string;
  nome_projeto: string;
  descricao: string;
  categoria?: CategoriaProjeto;
  custo_estimado: number;
  custo_real: number;
  fonte_recurso?: string;
  beneficiarios_estimados?: number;
  data_inicio_prevista?: string;
  data_fim_prevista?: string;
  data_inicio_real?: string;
  data_fim_real?: string;
  status: StatusProjeto;
  prioridade: PrioridadeProjeto;
  impacto_social?: string;
  retorno_estimado?: string;
  riscos_identificados?: string;
  documentos?: any[];
  marcos?: any[];
  created_at: string;
  updated_at: string;
}

export const useProjetosFinanceiro = () => {
  const [projetos, setProjetos] = useState<ProjetoFinanceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjetos = async (filtros?: { status?: StatusProjeto; categoria?: CategoriaProjeto }) => {
    try {
      let query = supabase
        .from('projetos_impacto_financeiro')
        .select('*')
        .order('created_at', { ascending: false });

      if (filtros?.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros?.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjetos(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar projetos financeiros:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar projetos financeiros",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createProjeto = async (projeto: Omit<ProjetoFinanceiro, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('projetos_impacto_financeiro')
        .insert([{ ...projeto, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setProjetos(prev => [data as ProjetoFinanceiro, ...prev]);
      return data as ProjetoFinanceiro;
    } catch (error: any) {
      console.error('Erro ao criar projeto financeiro:', error);
      throw error;
    }
  };

  const updateProjeto = async (id: string, updates: Partial<ProjetoFinanceiro>) => {
    try {
      const { data, error } = await supabase
        .from('projetos_impacto_financeiro')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProjetos(prev => prev.map(p => p.id === id ? data as ProjetoFinanceiro : p));
      return data as ProjetoFinanceiro;
    } catch (error: any) {
      console.error('Erro ao atualizar projeto financeiro:', error);
      throw error;
    }
  };

  const deleteProjeto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projetos_impacto_financeiro')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjetos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar projeto financeiro:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchProjetos();
  }, []);

  return {
    projetos,
    loading,
    fetchProjetos,
    createProjeto,
    updateProjeto,
    deleteProjeto,
    refetch: fetchProjetos
  };
};
