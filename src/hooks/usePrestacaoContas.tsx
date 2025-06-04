
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type StatusPrestacao = 'lancado' | 'revisado' | 'aprovado';
export type CategoriaPrestacao = 'pessoal' | 'material' | 'servicos' | 'viagens' | 'outros';

export interface PrestacaoContas {
  id: string;
  user_id: string;
  periodo_inicio: string;
  periodo_fim: string;
  categoria: CategoriaPrestacao;
  subcategoria?: string;
  descricao: string;
  valor: number;
  fornecedor?: string;
  numero_nota_fiscal?: string;
  data_pagamento?: string;
  centro_custo?: string;
  projeto_relacionado?: string;
  comprovantes?: any[];
  status: StatusPrestacao;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const usePrestacaoContas = () => {
  const [prestacoes, setPrestacoes] = useState<PrestacaoContas[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPrestacoes = async (periodo?: { inicio: string; fim: string }) => {
    try {
      let query = supabase
        .from('prestacao_contas')
        .select('*')
        .order('created_at', { ascending: false });

      if (periodo) {
        query = query
          .gte('periodo_inicio', periodo.inicio)
          .lte('periodo_fim', periodo.fim);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPrestacoes((data || []) as PrestacaoContas[]);
    } catch (error: any) {
      console.error('Erro ao buscar prestações de contas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar prestações de contas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPrestacao = async (prestacao: Omit<PrestacaoContas, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('prestacao_contas')
        .insert([{ ...prestacao, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setPrestacoes(prev => [data as PrestacaoContas, ...prev]);
      return data as PrestacaoContas;
    } catch (error: any) {
      console.error('Erro ao criar prestação de contas:', error);
      throw error;
    }
  };

  const updatePrestacao = async (id: string, updates: Partial<PrestacaoContas>) => {
    try {
      const { data, error } = await supabase
        .from('prestacao_contas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPrestacoes(prev => prev.map(p => p.id === id ? data as PrestacaoContas : p));
      return data as PrestacaoContas;
    } catch (error: any) {
      console.error('Erro ao atualizar prestação de contas:', error);
      throw error;
    }
  };

  const deletePrestacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prestacao_contas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPrestacoes(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar prestação de contas:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchPrestacoes();
  }, []);

  return {
    prestacoes,
    loading,
    fetchPrestacoes,
    createPrestacao,
    updatePrestacao,
    deletePrestacao,
    refetch: fetchPrestacoes
  };
};
