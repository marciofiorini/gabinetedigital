
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type DemandaStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
export type DemandaPrioridade = 'baixa' | 'media' | 'alta' | 'urgente';

export interface Demanda {
  id: string;
  user_id: string;
  titulo: string;
  descricao?: string;
  categoria?: string;
  prioridade: DemandaPrioridade;
  status: DemandaStatus;
  solicitante?: string;
  zona?: string;
  data_limite?: string;
  created_at: string;
  updated_at: string;
}

export const useDemandas = () => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDemandas = async () => {
    try {
      const { data, error } = await supabase
        .from('demandas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDemandas(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar demandas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar demandas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemanda = async (demanda: Omit<Demanda, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('demandas')
        .insert([demanda])
        .select()
        .single();

      if (error) throw error;
      setDemandas(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Erro ao criar demanda:', error);
      throw error;
    }
  };

  const updateDemanda = async (id: string, updates: Partial<Demanda>) => {
    try {
      const { data, error } = await supabase
        .from('demandas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDemandas(prev => prev.map(d => d.id === id ? data : d));
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar demanda:', error);
      throw error;
    }
  };

  const deleteDemanda = async (id: string) => {
    try {
      const { error } = await supabase
        .from('demandas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDemandas(prev => prev.filter(d => d.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar demanda:', error);
      return false;
    }
  };

  const refetch = fetchDemandas;

  useEffect(() => {
    fetchDemandas();
  }, []);

  return {
    demandas,
    loading,
    fetchDemandas,
    createDemanda,
    updateDemanda,
    deleteDemanda,
    refetch
  };
};
