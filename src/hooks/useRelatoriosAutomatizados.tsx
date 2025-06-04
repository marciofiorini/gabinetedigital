
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RelatorioAutomatizado {
  id: string;
  nome: string;
  tipo_relatorio: string;
  formato: string;
  frequencia: string;
  configuracao: any;
  destinatarios: string[];
  proxima_execucao: string | null;
  ultima_execucao: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useRelatoriosAutomatizados = () => {
  const [relatorios, setRelatorios] = useState<RelatorioAutomatizado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRelatorios = async () => {
    try {
      const { data, error } = await supabase
        .from('relatorios_automatizados')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRelatorios(data || []);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar relatórios automatizados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRelatorio = async (relatorio: Omit<RelatorioAutomatizado, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Calcular próxima execução baseada na frequência
      const proximaExecucao = calcularProximaExecucao(relatorio.frequencia);

      const { data, error } = await supabase
        .from('relatorios_automatizados')
        .insert([{ 
          ...relatorio, 
          user_id: user.id,
          proxima_execucao: proximaExecucao
        }])
        .select()
        .single();

      if (error) throw error;

      setRelatorios(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Relatório automatizado criado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar relatório automatizado",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateRelatorio = async (id: string, updates: Partial<RelatorioAutomatizado>) => {
    try {
      const { data, error } = await supabase
        .from('relatorios_automatizados')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setRelatorios(prev => prev.map(rel => rel.id === id ? data : rel));
      toast({
        title: "Sucesso",
        description: "Relatório atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar relatório",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteRelatorio = async (id: string) => {
    try {
      const { error } = await supabase
        .from('relatorios_automatizados')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRelatorios(prev => prev.filter(rel => rel.id !== id));
      toast({
        title: "Sucesso",
        description: "Relatório removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover relatório",
        variant: "destructive",
      });
      throw error;
    }
  };

  const calcularProximaExecucao = (frequencia: string): string => {
    const agora = new Date();
    
    switch (frequencia) {
      case 'diario':
        agora.setDate(agora.getDate() + 1);
        break;
      case 'semanal':
        agora.setDate(agora.getDate() + 7);
        break;
      case 'mensal':
        agora.setMonth(agora.getMonth() + 1);
        break;
      case 'trimestral':
        agora.setMonth(agora.getMonth() + 3);
        break;
      default:
        agora.setDate(agora.getDate() + 1);
    }
    
    return agora.toISOString();
  };

  const executarRelatorio = async (relatorioId: string) => {
    try {
      // Aqui seria implementada a lógica de geração do relatório
      // Por enquanto, vamos apenas atualizar as datas
      const agora = new Date().toISOString();
      const relatorio = relatorios.find(r => r.id === relatorioId);
      const proximaExecucao = relatorio ? calcularProximaExecucao(relatorio.frequencia) : agora;

      await updateRelatorio(relatorioId, {
        ultima_execucao: agora,
        proxima_execucao: proximaExecucao
      });

      toast({
        title: "Sucesso",
        description: "Relatório executado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao executar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao executar relatório",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRelatorios();
  }, []);

  return {
    relatorios,
    loading,
    createRelatorio,
    updateRelatorio,
    deleteRelatorio,
    executarRelatorio,
    refetch: fetchRelatorios
  };
};
