
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConsultaPublica {
  id: string;
  titulo: string;
  descricao: string;
  tipo_consulta: string;
  tema: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  publico_alvo: string;
  local_realizacao: string;
  modalidade: string;
  link_participacao: string;
  total_participantes: number;
  resultados: any;
  documentos: any[];
  created_at: string;
  updated_at: string;
}

interface ParticipacaoConsulta {
  id: string;
  consulta_id: string;
  nome_participante: string;
  email: string;
  telefone: string;
  contribuicao: string;
  data_participacao: string;
  aprovado: boolean;
}

export const useConsultasPublicas = () => {
  const [consultas, setConsultas] = useState<ConsultaPublica[]>([]);
  const [participacoes, setParticipacoes] = useState<ParticipacaoConsulta[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConsultas = async () => {
    try {
      const { data, error } = await supabase
        .from('consultas_publicas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultas(data || []);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar consultas públicas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipacoes = async (consultaId: string) => {
    try {
      const { data, error } = await supabase
        .from('participacoes_consulta')
        .select('*')
        .eq('consulta_id', consultaId)
        .order('data_participacao', { ascending: false });

      if (error) throw error;
      setParticipacoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar participações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar participações",
        variant: "destructive",
      });
    }
  };

  const createConsulta = async (consulta: Omit<ConsultaPublica, 'id' | 'created_at' | 'updated_at' | 'total_participantes'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('consultas_publicas')
        .insert([{ ...consulta, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setConsultas(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Consulta pública criada com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar consulta pública",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateConsulta = async (id: string, updates: Partial<ConsultaPublica>) => {
    try {
      const { data, error } = await supabase
        .from('consultas_publicas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setConsultas(prev => prev.map(consulta => 
        consulta.id === id ? data : consulta
      ));
      toast({
        title: "Sucesso",
        description: "Consulta pública atualizada com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar consulta pública",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteConsulta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('consultas_publicas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConsultas(prev => prev.filter(consulta => consulta.id !== id));
      toast({
        title: "Sucesso",
        description: "Consulta pública removida com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar consulta:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover consulta pública",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  return {
    consultas,
    participacoes,
    loading,
    createConsulta,
    updateConsulta,
    deleteConsulta,
    fetchParticipacoes,
    refetch: fetchConsultas
  };
};
