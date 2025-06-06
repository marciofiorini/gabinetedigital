
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CampanhaAutomatizada {
  id: string;
  nome: string;
  tipo: 'email' | 'whatsapp' | 'sms';
  status: 'ativa' | 'pausada' | 'concluida';
  segmento_id?: string;
  template_mensagem?: string;
  frequencia: 'unica' | 'diaria' | 'semanal' | 'mensal';
  data_inicio?: string;
  data_fim?: string;
  configuracoes: any;
  total_enviados: number;
  total_abertos: number;
  total_cliques: number;
  created_at: string;
  updated_at: string;
}

export const useCampanhasAutomatizadas = () => {
  const [campanhas, setCampanhas] = useState<CampanhaAutomatizada[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const carregarCampanhas = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campanhas_marketing')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampanhas(data || []);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar campanhas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const criarCampanha = async (dadosCampanha: Partial<CampanhaAutomatizada>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('campanhas_marketing')
        .insert([{
          ...dadosCampanha,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setCampanhas(prev => [data, ...prev]);
      
      toast({
        title: "Campanha criada!",
        description: "Campanha criada com sucesso"
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

  const atualizarCampanha = async (id: string, dados: Partial<CampanhaAutomatizada>) => {
    try {
      const { data, error } = await supabase
        .from('campanhas_marketing')
        .update(dados)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCampanhas(prev => prev.map(c => c.id === id ? data : c));
      
      toast({
        title: "Campanha atualizada!",
        description: "Campanha atualizada com sucesso"
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

  const excluirCampanha = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campanhas_marketing')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCampanhas(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Campanha excluída!",
        description: "Campanha excluída com sucesso"
      });
    } catch (error) {
      console.error('Erro ao excluir campanha:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir campanha",
        variant: "destructive"
      });
    }
  };

  const enviarCampanha = async (id: string) => {
    try {
      // Simular envio da campanha
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await atualizarCampanha(id, { 
        status: 'ativa',
        total_enviados: Math.floor(Math.random() * 1000) + 100
      });
      
      toast({
        title: "Campanha enviada!",
        description: "Campanha foi enviada com sucesso"
      });
    } catch (error) {
      console.error('Erro ao enviar campanha:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar campanha",
        variant: "destructive"
      });
    }
  };

  return {
    campanhas,
    loading,
    carregarCampanhas,
    criarCampanha,
    atualizarCampanha,
    excluirCampanha,
    enviarCampanha
  };
};
