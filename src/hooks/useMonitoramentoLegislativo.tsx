
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MonitoramentoLegislativo {
  id: string;
  numero_projeto: string;
  tipo_projeto: string;
  titulo: string;
  ementa: string;
  autor: string;
  casa_legislativa: string;
  data_apresentacao: string;
  situacao_atual: string;
  tramitacao_atual: string;
  urgencia: string;
  tema_relacionado: string;
  impacto_estimado: string;
  observacoes: string;
  link_projeto: string;
  status_monitoramento: string;
  alertas_configurados: any[];
  created_at: string;
  updated_at: string;
}

interface TramitacaoLegislativa {
  id: string;
  projeto_id: string;
  data_tramitacao: string;
  orgao: string;
  situacao: string;
  despacho: string;
  observacoes: string;
  created_at: string;
}

export const useMonitoramentoLegislativo = () => {
  const [projetos, setProjetos] = useState<MonitoramentoLegislativo[]>([]);
  const [tramitacoes, setTramitacoes] = useState<TramitacaoLegislativa[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjetos = async () => {
    try {
      const { data, error } = await supabase
        .from('monitoramento_legislativo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const projetosFormatted = (data || []).map(item => ({
        ...item,
        alertas_configurados: Array.isArray(item.alertas_configurados) ? item.alertas_configurados : []
      }));
      
      setProjetos(projetosFormatted);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar monitoramento legislativo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTramitacoes = async (projetoId: string) => {
    try {
      const { data, error } = await supabase
        .from('tramitacao_legislativa')
        .select('*')
        .eq('projeto_id', projetoId)
        .order('data_tramitacao', { ascending: false });

      if (error) throw error;
      setTramitacoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar tramitações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tramitações",
        variant: "destructive",
      });
    }
  };

  const createProjeto = async (projeto: Omit<MonitoramentoLegislativo, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('monitoramento_legislativo')
        .insert([{ ...projeto, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const projetoFormatted = {
        ...data,
        alertas_configurados: Array.isArray(data.alertas_configurados) ? data.alertas_configurados : []
      };

      setProjetos(prev => [projetoFormatted, ...prev]);
      toast({
        title: "Sucesso",
        description: "Projeto legislativo adicionado ao monitoramento",
      });
      return projetoFormatted;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar projeto ao monitoramento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProjeto = async (id: string, updates: Partial<MonitoramentoLegislativo>) => {
    try {
      const { data, error } = await supabase
        .from('monitoramento_legislativo')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const projetoFormatted = {
        ...data,
        alertas_configurados: Array.isArray(data.alertas_configurados) ? data.alertas_configurados : []
      };

      setProjetos(prev => prev.map(projeto => 
        projeto.id === id ? projetoFormatted : projeto
      ));
      toast({
        title: "Sucesso",
        description: "Projeto legislativo atualizado com sucesso",
      });
      return projetoFormatted;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto legislativo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProjeto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('monitoramento_legislativo')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjetos(prev => prev.filter(projeto => projeto.id !== id));
      toast({
        title: "Sucesso",
        description: "Projeto removido do monitoramento",
      });
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover projeto do monitoramento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addTramitacao = async (tramitacao: Omit<TramitacaoLegislativa, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tramitacao_legislativa')
        .insert([tramitacao])
        .select()
        .single();

      if (error) throw error;

      setTramitacoes(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Tramitação adicionada com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar tramitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar tramitação",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProjetos();
  }, []);

  return {
    projetos,
    tramitacoes,
    loading,
    createProjeto,
    updateProjeto,
    deleteProjeto,
    addTramitacao,
    fetchTramitacoes,
    refetch: fetchProjetos
  };
};
