
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type StatusFolha = 'pendente' | 'processada' | 'paga';

export interface FolhaPagamento {
  id: string;
  user_id: string;
  funcionario_id: string;
  mes_referencia: string;
  salario_base: number;
  horas_trabalhadas: number;
  horas_extras: number;
  valor_hora_extra: number;
  adicional_noturno: number;
  vale_transporte: number;
  vale_alimentacao: number;
  plano_saude: number;
  outros_beneficios: number;
  inss: number;
  ir: number;
  outros_descontos: number;
  salario_liquido?: number;
  status: StatusFolha;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  funcionario?: {
    nome: string;
    cargo: string;
  };
}

export const useFolhaPagamento = () => {
  const [folhas, setFolhas] = useState<FolhaPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFolhas = async (mesReferencia?: string) => {
    try {
      let query = supabase
        .from('folha_pagamento')
        .select(`
          *,
          funcionario:funcionarios(nome, cargo)
        `)
        .order('mes_referencia', { ascending: false });

      if (mesReferencia) {
        query = query.eq('mes_referencia', mesReferencia);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFolhas((data || []) as FolhaPagamento[]);
    } catch (error: any) {
      console.error('Erro ao buscar folhas de pagamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar folhas de pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createFolha = async (folha: Omit<FolhaPagamento, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'funcionario' | 'salario_liquido'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('folha_pagamento')
        .insert([{ ...folha, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setFolhas(prev => [data as FolhaPagamento, ...prev]);
      return data as FolhaPagamento;
    } catch (error: any) {
      console.error('Erro ao criar folha de pagamento:', error);
      throw error;
    }
  };

  const updateFolha = async (id: string, updates: Partial<FolhaPagamento>) => {
    try {
      const { data, error } = await supabase
        .from('folha_pagamento')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setFolhas(prev => prev.map(f => f.id === id ? data as FolhaPagamento : f));
      return data as FolhaPagamento;
    } catch (error: any) {
      console.error('Erro ao atualizar folha de pagamento:', error);
      throw error;
    }
  };

  const deleteFolha = async (id: string) => {
    try {
      const { error } = await supabase
        .from('folha_pagamento')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFolhas(prev => prev.filter(f => f.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar folha de pagamento:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchFolhas();
  }, []);

  return {
    folhas,
    loading,
    fetchFolhas,
    createFolha,
    updateFolha,
    deleteFolha,
    refetch: fetchFolhas
  };
};
