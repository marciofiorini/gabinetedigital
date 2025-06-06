
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SegmentoContato {
  id: string;
  user_id: string;
  nome: string;
  descricao?: string;
  criterios: any;
  contatos_ids: string[];
  total_contatos: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useSegmentosContatos = () => {
  const [segmentos, setSegmentos] = useState<SegmentoContato[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSegmentos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('segmentos_contatos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSegmentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar segmentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar segmentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const criarSegmento = async (segmento: Partial<SegmentoContato>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('segmentos_contatos')
        .insert({
          ...segmento,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setSegmentos(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Segmento criado com sucesso!"
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar segmento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar segmento",
        variant: "destructive"
      });
    }
  };

  const atualizarSegmento = async (id: string, updates: Partial<SegmentoContato>) => {
    try {
      const { data, error } = await supabase
        .from('segmentos_contatos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSegmentos(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "Sucesso",
        description: "Segmento atualizado com sucesso!"
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar segmento:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar segmento",
        variant: "destructive"
      });
    }
  };

  const excluirSegmento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('segmentos_contatos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSegmentos(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Sucesso",
        description: "Segmento excluído com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao excluir segmento:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir segmento",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSegmentos();
  }, [user]);

  return {
    segmentos,
    loading,
    criarSegmento,
    atualizarSegmento,
    excluirSegmento,
    refetch: fetchSegmentos
  };
};
