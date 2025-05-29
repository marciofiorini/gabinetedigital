
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { differenceInHours } from 'date-fns';
import { FollowUp, NotificationSettings } from '@/types/followUp';
import { followUpService } from '@/services/followUpService';
import { useFollowUpFilters } from '@/hooks/useFollowUpFilters';

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

  const { vencidos, hoje, proximosVencimentos } = useFollowUpFilters(followUps, settings.horas_antecedencia);

  const fetchFollowUps = async () => {
    if (!user) return;

    try {
      const data = await followUpService.fetchFollowUps(user.id);
      setFollowUps(data);
    } catch (error) {
      console.error('Erro ao buscar follow ups:', error);
    }
  };

  const checkVencidos = () => {
    if (!settings.alertas_follow_up) return;

    const agora = new Date();

    // Notificar follow ups vencidos
    vencidos.forEach(followUp => {
      toast({
        title: '⚠️ Follow Up Vencido',
        description: `${followUp.descricao} - ${followUp.lead_nome || 'Lead'}`,
        variant: 'destructive',
      });

      // Criar notificação no banco
      followUpService.createNotification(user!.id, {
        title: 'Follow Up Vencido',
        message: `${followUp.descricao} para ${followUp.lead_nome || 'lead'} está vencido`,
        type: 'warning',
        action_url: `/leads/${followUp.lead_id}`
      });
    });

    // Notificar follow ups próximos do vencimento
    proximosVencimentos.forEach(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      const horasRestantes = differenceInHours(dataAgendada, agora);
      
      toast({
        title: '🔔 Follow Up Próximo',
        description: `${followUp.descricao} em ${horasRestantes}h - ${followUp.lead_nome || 'Lead'}`,
      });

      // Criar notificação no banco
      followUpService.createNotification(user!.id, {
        title: 'Follow Up Próximo',
        message: `${followUp.descricao} para ${followUp.lead_nome || 'lead'} em ${horasRestantes} horas`,
        type: 'info',
        action_url: `/leads/${followUp.lead_id}`
      });
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
    vencidos,
    hoje,
    proximosVencimentos,
    updateSettings,
    refetch: fetchFollowUps
  };
};
