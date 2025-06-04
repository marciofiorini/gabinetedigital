
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type TipoAgenda = 'reuniao' | 'tarefa' | 'evento' | 'ferias' | 'licenca' | 'treinamento';
export type PrioridadeAgenda = 'baixa' | 'media' | 'alta' | 'urgente';
export type StatusAgenda = 'agendado' | 'confirmado' | 'cancelado' | 'concluido';

export interface AgendaFuncionario {
  id: string;
  user_id: string;
  funcionario_id: string;
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  tipo: TipoAgenda;
  prioridade: PrioridadeAgenda;
  status: StatusAgenda;
  local?: string;
  participantes?: string[];
  observacoes?: string;
  created_at: string;
  updated_at: string;
  funcionario?: {
    nome: string;
    cargo: string;
  };
}

export const useAgendaFuncionario = () => {
  const [agenda, setAgenda] = useState<AgendaFuncionario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAgenda = async (funcionarioId?: string, dataInicio?: string, dataFim?: string) => {
    try {
      let query = supabase
        .from('agenda_funcionario')
        .select(`
          *,
          funcionario:funcionarios(nome, cargo)
        `)
        .order('data_inicio', { ascending: true });

      if (funcionarioId) {
        query = query.eq('funcionario_id', funcionarioId);
      }

      if (dataInicio && dataFim) {
        query = query.gte('data_inicio', dataInicio).lte('data_fim', dataFim);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAgenda((data || []) as AgendaFuncionario[]);
    } catch (error: any) {
      console.error('Erro ao buscar agenda:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar agenda",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAgenda = async (item: Omit<AgendaFuncionario, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'funcionario'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('agenda_funcionario')
        .insert([{ ...item, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setAgenda(prev => [data as AgendaFuncionario, ...prev]);
      return data as AgendaFuncionario;
    } catch (error: any) {
      console.error('Erro ao criar item da agenda:', error);
      throw error;
    }
  };

  const updateAgenda = async (id: string, updates: Partial<AgendaFuncionario>) => {
    try {
      const { data, error } = await supabase
        .from('agenda_funcionario')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAgenda(prev => prev.map(a => a.id === id ? data as AgendaFuncionario : a));
      return data as AgendaFuncionario;
    } catch (error: any) {
      console.error('Erro ao atualizar item da agenda:', error);
      throw error;
    }
  };

  const deleteAgenda = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agenda_funcionario')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAgenda(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar item da agenda:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  return {
    agenda,
    loading,
    fetchAgenda,
    createAgenda,
    updateAgenda,
    deleteAgenda,
    refetch: fetchAgenda
  };
};
