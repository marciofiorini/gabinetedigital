
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ArquivoDigital {
  id: string;
  titulo: string;
  descricao: string;
  tipo_documento: string;
  categoria: string;
  arquivo_url: string;
  arquivo_nome: string;
  arquivo_tamanho: number;
  numero_protocolo: string;
  data_documento: string;
  origem: string;
  destino: string;
  status: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const useArquivoDigital = () => {
  const [arquivos, setArquivos] = useState<ArquivoDigital[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchArquivos = async () => {
    try {
      const { data, error } = await supabase
        .from('arquivo_digital')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArquivos(data || []);
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar arquivos digitais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createArquivo = async (arquivo: Omit<ArquivoDigital, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('arquivo_digital')
        .insert([{ ...arquivo, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setArquivos(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Arquivo digital criado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar arquivo digital",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateArquivo = async (id: string, updates: Partial<ArquivoDigital>) => {
    try {
      const { data, error } = await supabase
        .from('arquivo_digital')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setArquivos(prev => prev.map(arquivo => 
        arquivo.id === id ? data : arquivo
      ));
      toast({
        title: "Sucesso",
        description: "Arquivo digital atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar arquivo digital",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteArquivo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('arquivo_digital')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setArquivos(prev => prev.filter(arquivo => arquivo.id !== id));
      toast({
        title: "Sucesso",
        description: "Arquivo digital removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover arquivo digital",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchArquivos();
  }, []);

  return {
    arquivos,
    loading,
    createArquivo,
    updateArquivo,
    deleteArquivo,
    refetch: fetchArquivos
  };
};
