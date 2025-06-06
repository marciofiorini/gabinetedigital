
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CampanhaAutomatizada {
  id: string;
  nome: string;
  tipo: 'email' | 'whatsapp' | 'sms';
  status: 'ativa' | 'pausada' | 'finalizada';
  template_id?: string;
  segmento_alvo: string[];
  trigger_evento: string;
  frequencia: string;
  proxima_execucao?: string;
  ultima_execucao?: string;
  total_enviados: number;
  total_abertos: number;
  total_cliques: number;
  taxa_conversao: number;
  created_at: string;
}

export const useCampanhasAutomatizadas = () => {
  const [campanhas, setCampanhas] = useState<CampanhaAutomatizada[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const enviarCampanha = async (campanhaId: string, destinatarios: string[]) => {
    try {
      const response = await fetch('/functions/v1/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await supabase.auth.getSession().then(s => s.data.session?.access_token)}`,
        },
        body: JSON.stringify({
          campanha_id: campanhaId,
          destinatarios,
          user_id: user?.id
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Campanha enviada!",
          description: `Mensagens enviadas para ${destinatarios.length} destinatários`
        });
        return result;
      } else {
        throw new Error(result.error || 'Erro ao enviar campanha');
      }
    } catch (error) {
      console.error('Erro ao enviar campanha:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar campanha",
        variant: "destructive"
      });
    }
  };

  const criarCampanhaWhatsApp = async (dados: {
    nome: string;
    mensagem: string;
    destinatarios: string[];
    agendamento?: Date;
  }) => {
    try {
      const { data, error } = await supabase
        .from('campanhas_marketing')
        .insert({
          nome: dados.nome,
          tipo: 'whatsapp',
          template_mensagem: dados.mensagem,
          status: dados.agendamento ? 'agendada' : 'ativa',
          data_inicio: dados.agendamento || new Date().toISOString(),
          user_id: user?.id,
          configuracoes: {
            destinatarios: dados.destinatarios,
            agendamento: dados.agendamento
          }
        })
        .select()
        .single();

      if (error) throw error;

      if (!dados.agendamento) {
        await enviarCampanha(data.id, dados.destinatarios);
      }

      toast({
        title: "Sucesso",
        description: dados.agendamento ? "Campanha agendada!" : "Campanha enviada!"
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar campanha WhatsApp:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar campanha",
        variant: "destructive"
      });
    }
  };

  const criarCampanhaEmail = async (dados: {
    nome: string;
    assunto: string;
    conteudo: string;
    destinatarios: string[];
    agendamento?: Date;
  }) => {
    try {
      const { data, error } = await supabase
        .from('campanhas_marketing')
        .insert({
          nome: dados.nome,
          tipo: 'email',
          assunto: dados.assunto,
          template_mensagem: dados.conteudo,
          status: dados.agendamento ? 'agendada' : 'ativa',
          data_inicio: dados.agendamento || new Date().toISOString(),
          user_id: user?.id,
          configuracoes: {
            destinatarios: dados.destinatarios,
            agendamento: dados.agendamento
          }
        })
        .select()
        .single();

      if (error) throw error;

      if (!dados.agendamento) {
        await enviarCampanha(data.id, dados.destinatarios);
      }

      toast({
        title: "Sucesso",
        description: dados.agendamento ? "Campanha agendada!" : "Campanha enviada!"
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar campanha email:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar campanha",
        variant: "destructive"
      });
    }
  };

  const obterEstatisticas = () => {
    const ativas = campanhas.filter(c => c.status === 'ativa').length;
    const totalEnviados = campanhas.reduce((acc, c) => acc + c.total_enviados, 0);
    const totalAbertos = campanhas.reduce((acc, c) => acc + c.total_abertos, 0);
    const taxaAberturaMedia = totalEnviados > 0 ? (totalAbertos / totalEnviados) * 100 : 0;

    return {
      campanhasAtivas: ativas,
      totalEnviados,
      totalAbertos,
      taxaAberturaMedia: taxaAberturaMedia.toFixed(1)
    };
  };

  useEffect(() => {
    if (user) {
      // Simular dados de campanhas automatizadas
      setCampanhas([
        {
          id: '1',
          nome: 'Boas-vindas Novos Contatos',
          tipo: 'email',
          status: 'ativa',
          segmento_alvo: ['novos_contatos'],
          trigger_evento: 'novo_contato',
          frequencia: 'imediato',
          total_enviados: 245,
          total_abertos: 189,
          total_cliques: 67,
          taxa_conversao: 27.3,
          created_at: '2024-01-15'
        },
        {
          id: '2',
          nome: 'Newsletter Semanal',
          tipo: 'email',
          status: 'ativa',
          segmento_alvo: ['todos_contatos'],
          trigger_evento: 'semanal',
          frequencia: 'semanal',
          proxima_execucao: '2024-06-10T10:00:00Z',
          total_enviados: 1850,
          total_abertos: 1295,
          total_cliques: 387,
          taxa_conversao: 20.9,
          created_at: '2024-01-01'
        },
        {
          id: '3',
          nome: 'Convite Eventos WhatsApp',
          tipo: 'whatsapp',
          status: 'ativa',
          segmento_alvo: ['lideres_comunitarios'],
          trigger_evento: 'novo_evento',
          frequencia: 'por_evento',
          total_enviados: 89,
          total_abertos: 89,
          total_cliques: 34,
          taxa_conversao: 38.2,
          created_at: '2024-02-01'
        }
      ]);
      setLoading(false);
    }
  }, [user]);

  return {
    campanhas,
    loading,
    criarCampanhaEmail,
    criarCampanhaWhatsApp,
    enviarCampanha,
    obterEstatisticas
  };
};
