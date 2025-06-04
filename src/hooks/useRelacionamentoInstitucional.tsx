
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RelacionamentoInstitucional {
  id: string;
  nome_instituicao: string;
  tipo_instituicao: string;
  responsavel_nome: string;
  responsavel_cargo: string;
  email: string;
  telefone: string;
  endereco: string;
  website: string;
  nivel_relacionamento: string;
  area_atuacao: string;
  observacoes: string;
  ultima_interacao: string;
  proximo_contato: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useRelacionamentoInstitucional = () => {
  const [relacionamentos, setRelacionamentos] = useState<RelacionamentoInstitucional[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRelacionamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('relacionamento_institucional')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRelacionamentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar relacionamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar relacionamentos institucionais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRelacionamento = async (relacionamento: Omit<RelacionamentoInstitucional, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('relacionamento_institucional')
        .insert([{ ...relacionamento, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setRelacionamentos(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Relacionamento institucional criado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar relacionamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar relacionamento institucional",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateRelacionamento = async (id: string, updates: Partial<RelacionamentoInstitucional>) => {
    try {
      const { data, error } = await supabase
        .from('relacionamento_institucional')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setRelacionamentos(prev => prev.map(rel => 
        rel.id === id ? data : rel
      ));
      toast({
        title: "Sucesso",
        description: "Relacionamento institucional atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar relacionamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar relacionamento institucional",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteRelacionamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('relacionamento_institucional')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRelacionamentos(prev => prev.filter(rel => rel.id !== id));
      toast({
        title: "Sucesso",
        description: "Relacionamento institucional removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar relacionamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover relacionamento institucional",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchRelacionamentos();
  }, []);

  return {
    relacionamentos,
    loading,
    createRelacionamento,
    updateRelacionamento,
    deleteRelacionamento,
    refetch: fetchRelacionamentos
  };
};
