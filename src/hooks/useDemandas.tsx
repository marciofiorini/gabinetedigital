
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Demanda {
  id: string;
  user_id: string;
  titulo: string;
  descricao?: string;
  categoria?: string;
  prioridade: string;
  status: string;
  solicitante?: string;
  zona?: string;
  data_limite?: string;
  created_at: string;
  updated_at: string;
}

export const useDemandas = () => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDemandas = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('demandas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDemandas(data || []);
    } catch (error) {
      console.error('Erro ao buscar demandas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDemanda = async (demanda: Omit<Demanda, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('demandas')
        .insert({
          ...demanda,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      await fetchDemandas();
      return data;
    } catch (error) {
      console.error('Erro ao criar demanda:', error);
      return null;
    }
  };

  const updateDemanda = async (id: string, updates: Partial<Demanda>) => {
    try {
      const { error } = await supabase
        .from('demandas')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchDemandas();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar demanda:', error);
      return false;
    }
  };

  const deleteDemanda = async (id: string) => {
    try {
      const { error } = await supabase
        .from('demandas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchDemandas();
      return true;
    } catch (error) {
      console.error('Erro ao deletar demanda:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchDemandas();
  }, [user]);

  return {
    demandas,
    loading,
    fetchDemandas,
    createDemanda,
    updateDemanda,
    deleteDemanda
  };
};
