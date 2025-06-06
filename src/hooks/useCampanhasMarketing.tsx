
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CampanhaMarketing {
  id: string;
  user_id: string;
  nome: string;
  tipo: string;
  status: string;
  segmento_id?: string;
  template_mensagem?: string;
  assunto?: string;
  trigger_evento?: string;
  frequencia: string;
  data_inicio?: string;
  data_fim?: string;
  total_enviados: number;
  total_abertos: number;
  total_cliques: number;
  configuracoes: any;
  created_at: string;
  updated_at: string;
}

export const useCampanhasMarketing = () => {
  const [campanhas, setCampanhas] = useState<CampanhaMarketing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCampanhas = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campanhas_marketing')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampanhas(data || []);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar campanhas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const criarCampanha = async (campanha: Partial<CampanhaMarketing>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('campanhas_marketing')
        .insert({
          ...campanha,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setCampanhas(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Campanha criada com sucesso!"
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar campanha",
        variant: "destructive"
      });
    }
  };

  const atualizarCampanha = async (id: string, updates: Partial<CampanhaMarketing>) => {
    try {
      const { data, error } = await supabase
        .from('campanhas_marketing')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCampanhas(prev => prev.map(c => c.id === id ? data : c));
      toast({
        title: "Sucesso",
        description: "Campanha atualizada com sucesso!"
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar campanha",
        variant: "destructive"
      });
    }
  };

  const ativarCampanha = async (id: string) => {
    return atualizarCampanha(id, { status: 'ativa' });
  };

  const pausarCampanha = async (id: string) => {
    return atualizarCampanha(id, { status: 'pausada' });
  };

  const finalizarCampanha = async (id: string) => {
    return atualizarCampanha(id, { status: 'finalizada' });
  };

  useEffect(() => {
    fetchCampanhas();
  }, [user]);

  return {
    campanhas,
    loading,
    criarCampanha,
    atualizarCampanha,
    ativarCampanha,
    pausarCampanha,
    finalizarCampanha,
    refetch: fetchCampanhas
  };
};
