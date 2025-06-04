
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type CargoEquipe = 'assessor' | 'estagiario' | 'coordenador' | 'secretario' | 'chefe_gabinete';
export type StatusFuncionario = 'ativo' | 'inativo' | 'licenca' | 'ferias';

export interface Funcionario {
  id: string;
  user_id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cargo: CargoEquipe;
  status: StatusFuncionario;
  data_admissao: string;
  data_demissao?: string;
  salario?: number;
  carga_horaria: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const useEquipe = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFuncionarios = async () => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar funcionários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar funcionários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createFuncionario = async (funcionario: Omit<Funcionario, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('funcionarios')
        .insert([{ ...funcionario, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setFuncionarios(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Erro ao criar funcionário:', error);
      throw error;
    }
  };

  const updateFuncionario = async (id: string, updates: Partial<Funcionario>) => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setFuncionarios(prev => prev.map(f => f.id === id ? data : f));
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar funcionário:', error);
      throw error;
    }
  };

  const deleteFuncionario = async (id: string) => {
    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFuncionarios(prev => prev.filter(f => f.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar funcionário:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  return {
    funcionarios,
    loading,
    fetchFuncionarios,
    createFuncionario,
    updateFuncionario,
    deleteFuncionario,
    refetch: fetchFuncionarios
  };
};
