
import { supabase } from '@/integrations/supabase/client';
import { FollowUp } from '@/types/followUp';

export const followUpService = {
  async fetchFollowUps(userId: string): Promise<FollowUp[]> {
    try {
      const { data, error } = await supabase
        .from('follow_ups')
        .select(`
          *,
          leads!left(nome)
        `)
        .eq('user_id', userId)
        .eq('status', 'pendente')
        .gte('data_agendada', new Date().toISOString());

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        lead_id: item.lead_id,
        tipo: item.tipo as 'ligacao' | 'mensagem' | 'reuniao' | 'aniversario',
        data_agendada: new Date(item.data_agendada),
        descricao: item.descricao,
        status: item.status as 'pendente' | 'concluido' | 'cancelado',
        observacoes: item.observacoes,
        assunto: item.assunto,
        conteudo_mensagem: item.conteudo_mensagem,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
        lead_nome: item.leads?.nome
      }));
    } catch (error) {
      console.error('Erro ao buscar follow ups:', error);
      return [];
    }
  },

  async createNotification(userId: string, notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    action_url?: string;
  }) {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          action_url: notification.action_url
        });
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  }
};
