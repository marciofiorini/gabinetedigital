
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { differenceInHours, isPast, isToday, startOfDay } from 'date-fns';

interface FollowUp {
  id: string;
  tipo: 'ligacao' | 'mensagem' | 'reuniao' | 'aniversario';
  data_agendada: Date;
  descricao: string;
  status: 'pendente' | 'concluido' | 'cancelado';
  observacoes?: string;
  assunto?: string;
  conteudo_mensagem?: string;
  lead_id?: string;
  lead_nome?: string;
}

interface NotificationSettings {
  alertas_follow_up: boolean;
  horas_antecedencia: number;
  enviar_email: boolean;
  enviar_push: boolean;
}

export const useFollowUpNotifications = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    alertas_follow_up: true,
    horas_antecedencia: 24,
    enviar_email: false,
    enviar_push: true
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFollowUps = async () => {
    if (!user) return;

    try {
      // Buscar follow ups pendentes
      const { data, error } = await supabase
        .from('follow_ups')
        .select(`
          *,
          leads!inner(nome)
        `)
        .eq('user_id', user.id)
        .eq('status', 'pendente')
        .gte('data_agendada', new Date().toISOString());

      if (error) throw error;

      const followUpsWithLeadNames = (data || []).map(item => ({
        ...item,
        data_agendada: new Date(item.data_agendada),
        lead_nome: item.leads?.nome
      }));

      setFollowUps(followUpsWithLeadNames);
    } catch (error) {
      console.error('Erro ao buscar follow ups:', error);
    }
  };

  const checkVencidos = () => {
    if (!settings.alertas_follow_up) return;

    const agora = new Date();
    const vencidos = followUps.filter(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      return isPast(dataAgendada) && followUp.status === 'pendente';
    });

    const proximosVencimento = followUps.filter(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      const horasRestantes = differenceInHours(dataAgendada, agora);
      return horasRestantes <= settings.horas_antecedencia && horasRestantes > 0;
    });

    // Notificar follow ups vencidos
    vencidos.forEach(followUp => {
      toast({
        title: '⚠️ Follow Up Vencido',
        description: `${followUp.descricao} - ${followUp.lead_nome || 'Lead'}`,
        variant: 'destructive',
      });

      // Criar notificação no banco
      createNotification({
        title: 'Follow Up Vencido',
        message: `${followUp.descricao} para ${followUp.lead_nome || 'lead'} está vencido`,
        type: 'warning',
        action_url: `/leads/${followUp.lead_id}`
      });
    });

    // Notificar follow ups próximos do vencimento
    proximosVencimento.forEach(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      const horasRestantes = differenceInHours(dataAgendada, agora);
      
      toast({
        title: '🔔 Follow Up Próximo',
        description: `${followUp.descricao} em ${horasRestantes}h - ${followUp.lead_nome || 'Lead'}`,
      });

      // Criar notificação no banco
      createNotification({
        title: 'Follow Up Próximo',
        message: `${followUp.descricao} para ${followUp.lead_nome || 'lead'} em ${horasRestantes} horas`,
        type: 'info',
        action_url: `/leads/${followUp.lead_id}`
      });
    });
  };

  const createNotification = async (notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    action_url?: string;
  }) => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          action_url: notification.action_url
        });
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  };

  const getFollowUpsVencidos = () => {
    const agora = new Date();
    return followUps.filter(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      return isPast(dataAgendada) && followUp.status === 'pendente';
    });
  };

  const getFollowUpsHoje = () => {
    return followUps.filter(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      return isToday(dataAgendada) && followUp.status === 'pendente';
    });
  };

  const getProximosVencimentos = () => {
    const agora = new Date();
    return followUps.filter(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      const horasRestantes = differenceInHours(dataAgendada, agora);
      return horasRestantes <= settings.horas_antecedencia && horasRestantes > 0;
    });
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  useEffect(() => {
    if (user) {
      fetchFollowUps();
    }
  }, [user]);

  useEffect(() => {
    if (followUps.length > 0) {
      checkVencidos();
    }
  }, [followUps, settings]);

  // Verificar periodicamente (a cada 30 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFollowUps();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  return {
    followUps,
    settings,
    vencidos: getFollowUpsVencidos(),
    hoje: getFollowUpsHoje(),
    proximosVencimentos: getProximosVencimentos(),
    updateSettings,
    refetch: fetchFollowUps
  };
};
