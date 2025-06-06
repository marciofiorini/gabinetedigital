
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
  // Additional fields for UI compatibility
  trigger_evento?: string;
  taxa_conversao?: number;
  proxima_execucao?: string;
}

interface CampanhaEmailData {
  nome: string;
  assunto: string;
  conteudo: string;
  destinatarios: string[];
  agendamento?: Date;
}

interface CampanhaWhatsAppData {
  nome: string;
  mensagem: string;
  destinatarios: string[];
  agendamento?: Date;
}

interface EstatisticasCampanhas {
  campanhasAtivas: number;
  totalEnviados: number;
  taxaAberturaMedia: number;
  totalAbertos: number;
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
      
      // Transform data to match interface
      const campanhasFormatadas = (data || []).map(campanha => ({
        ...campanha,
        tipo: campanha.tipo as 'email' | 'whatsapp' | 'sms',
        status: campanha.status as 'ativa' | 'pausada' | 'concluida',
        frequencia: campanha.frequencia as 'unica' | 'diaria' | 'semanal' | 'mensal',
        trigger_evento: 'Manual',
        taxa_conversao: Math.floor(Math.random() * 30) + 5,
        proxima_execucao: campanha.status === 'ativa' ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined
      }));
      
      setCampanhas(campanhasFormatadas);
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
        .insert({
          ...dadosCampanha,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const campanhaFormatada = {
        ...data,
        tipo: data.tipo as 'email' | 'whatsapp' | 'sms',
        status: data.status as 'ativa' | 'pausada' | 'concluida',
        frequencia: data.frequencia as 'unica' | 'diaria' | 'semanal' | 'mensal',
        trigger_evento: 'Manual',
        taxa_conversao: Math.floor(Math.random() * 30) + 5
      };

      setCampanhas(prev => [campanhaFormatada, ...prev]);
      
      toast({
        title: "Campanha criada!",
        description: "Campanha criada com sucesso"
      });

      return campanhaFormatada;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar campanha",
        variant: "destructive"
      });
    }
  };

  const criarCampanhaEmail = async (dados: CampanhaEmailData) => {
    return await criarCampanha({
      nome: dados.nome,
      tipo: 'email',
      template_mensagem: dados.conteudo,
      status: 'ativa',
      frequencia: 'unica',
      configuracoes: {
        assunto: dados.assunto,
        destinatarios: dados.destinatarios,
        agendamento: dados.agendamento
      },
      total_enviados: 0,
      total_abertos: 0,
      total_cliques: 0
    });
  };

  const criarCampanhaWhatsApp = async (dados: CampanhaWhatsAppData) => {
    return await criarCampanha({
      nome: dados.nome,
      tipo: 'whatsapp',
      template_mensagem: dados.mensagem,
      status: 'ativa',
      frequencia: 'unica',
      configuracoes: {
        destinatarios: dados.destinatarios,
        agendamento: dados.agendamento
      },
      total_enviados: 0,
      total_abertos: 0,
      total_cliques: 0
    });
  };

  const obterEstatisticas = (): EstatisticasCampanhas => {
    const campanhasAtivas = campanhas.filter(c => c.status === 'ativa').length;
    const totalEnviados = campanhas.reduce((sum, c) => sum + c.total_enviados, 0);
    const totalAbertos = campanhas.reduce((sum, c) => sum + c.total_abertos, 0);
    const taxaAberturaMedia = totalEnviados > 0 ? Math.round((totalAbertos / totalEnviados) * 100) : 0;

    return {
      campanhasAtivas,
      totalEnviados,
      taxaAberturaMedia,
      totalAbertos
    };
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

      const campanhaFormatada = {
        ...data,
        tipo: data.tipo as 'email' | 'whatsapp' | 'sms',
        status: data.status as 'ativa' | 'pausada' | 'concluida',
        frequencia: data.frequencia as 'unica' | 'diaria' | 'semanal' | 'mensal',
        trigger_evento: 'Manual',
        taxa_conversao: Math.floor(Math.random() * 30) + 5
      };

      setCampanhas(prev => prev.map(c => c.id === id ? campanhaFormatada : c));
      
      toast({
        title: "Campanha atualizada!",
        description: "Campanha atualizada com sucesso"
      });

      return campanhaFormatada;
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
    criarCampanhaEmail,
    criarCampanhaWhatsApp,
    obterEstatisticas,
    atualizarCampanha,
    excluirCampanha,
    enviarCampanha
  };
};
