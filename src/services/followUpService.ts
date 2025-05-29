
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
        ...item,
        data_agendada: new Date(item.data_agendada),
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
