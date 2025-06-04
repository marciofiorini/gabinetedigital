
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta' | 'urgente';

export interface TarefaEquipe {
  id: string;
  user_id: string;
  funcionario_id: string;
  titulo: string;
  descricao?: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  data_inicio: string;
  data_limite?: string;
  data_conclusao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  funcionario?: {
    nome: string;
    cargo: string;
  };
}

export const useTarefasEquipe = () => {
  const [tarefas, setTarefas] = useState<TarefaEquipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTarefas = async () => {
    try {
      const { data, error } = await supabase
        .from('tarefas_equipe')
        .select(`
          *,
          funcionario:funcionarios(nome, cargo)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTarefas((data || []) as TarefaEquipe[]);
    } catch (error: any) {
      console.error('Erro ao buscar tarefas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tarefas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTarefa = async (tarefa: Omit<TarefaEquipe, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'funcionario'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('tarefas_equipe')
        .insert([{ ...tarefa, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setTarefas(prev => [data as TarefaEquipe, ...prev]);
      return data as TarefaEquipe;
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  };

  const updateTarefa = async (id: string, updates: Partial<TarefaEquipe>) => {
    try {
      const { data, error } = await supabase
        .from('tarefas_equipe')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTarefas(prev => prev.map(t => t.id === id ? data as TarefaEquipe : t));
      return data as TarefaEquipe;
    } catch (error: any) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  };

  const deleteTarefa = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tarefas_equipe')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTarefas(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar tarefa:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  return {
    tarefas,
    loading,
    fetchTarefas,
    createTarefa,
    updateTarefa,
    deleteTarefa,
    refetch: fetchTarefas
  };
};
