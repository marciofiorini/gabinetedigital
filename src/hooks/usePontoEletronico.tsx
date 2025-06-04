
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type TipoPonto = 'entrada' | 'saida' | 'almoco_saida' | 'almoco_entrada';

export interface RegistroPonto {
  id: string;
  user_id: string;
  funcionario_id: string;
  tipo: TipoPonto;
  data_hora: string;
  observacoes?: string;
  created_at: string;
  funcionario?: {
    nome: string;
    cargo: string;
  };
}

export const usePontoEletronico = () => {
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRegistros = async (funcionarioId?: string, dataInicio?: string, dataFim?: string) => {
    try {
      let query = supabase
        .from('ponto_eletronico')
        .select(`
          *,
          funcionario:funcionarios(nome, cargo)
        `)
        .order('data_hora', { ascending: false });

      if (funcionarioId) {
        query = query.eq('funcionario_id', funcionarioId);
      }

      if (dataInicio && dataFim) {
        query = query.gte('data_hora', dataInicio).lte('data_hora', dataFim);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRegistros(data as RegistroPonto[] || []);
    } catch (error: any) {
      console.error('Erro ao buscar registros de ponto:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar registros de ponto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const registrarPonto = async (funcionarioId: string, tipo: TipoPonto, observacoes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('ponto_eletronico')
        .insert([{
          user_id: user.id,
          funcionario_id: funcionarioId,
          tipo,
          data_hora: new Date().toISOString(),
          observacoes
        }])
        .select()
        .single();

      if (error) throw error;
      setRegistros(prev => [data as RegistroPonto, ...prev]);
      return data as RegistroPonto;
    } catch (error: any) {
      console.error('Erro ao registrar ponto:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  return {
    registros,
    loading,
    fetchRegistros,
    registrarPonto,
    refetch: fetchRegistros
  };
};
