
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type StatusOrcamento = 'pendente' | 'em_execucao' | 'executado' | 'cancelado';
export type TipoOrcamento = 'emenda' | 'recurso' | 'verba';
export type OrigemOrcamento = 'federal' | 'estadual' | 'municipal';

export interface OrcamentoPublico {
  id: string;
  user_id: string;
  tipo: TipoOrcamento;
  numero_emenda?: string;
  descricao: string;
  valor_total: number;
  valor_executado: number;
  valor_pendente?: number;
  origem?: OrigemOrcamento;
  destino?: string;
  status: StatusOrcamento;
  data_aprovacao?: string;
  data_limite?: string;
  observacoes?: string;
  documentos?: any[];
  created_at: string;
  updated_at: string;
}

export const useOrcamentoPublico = () => {
  const [orcamentos, setOrcamentos] = useState<OrcamentoPublico[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrcamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('orcamento_publico')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrcamentos(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar orçamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar orçamentos públicos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrcamento = async (orcamento: Omit<OrcamentoPublico, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'valor_pendente'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('orcamento_publico')
        .insert([{ ...orcamento, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setOrcamentos(prev => [data as OrcamentoPublico, ...prev]);
      return data as OrcamentoPublico;
    } catch (error: any) {
      console.error('Erro ao criar orçamento:', error);
      throw error;
    }
  };

  const updateOrcamento = async (id: string, updates: Partial<OrcamentoPublico>) => {
    try {
      const { data, error } = await supabase
        .from('orcamento_publico')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOrcamentos(prev => prev.map(o => o.id === id ? data as OrcamentoPublico : o));
      return data as OrcamentoPublico;
    } catch (error: any) {
      console.error('Erro ao atualizar orçamento:', error);
      throw error;
    }
  };

  const deleteOrcamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orcamento_publico')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOrcamentos(prev => prev.filter(o => o.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar orçamento:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  return {
    orcamentos,
    loading,
    fetchOrcamentos,
    createOrcamento,
    updateOrcamento,
    deleteOrcamento,
    refetch: fetchOrcamentos
  };
};
