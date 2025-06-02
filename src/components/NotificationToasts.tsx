
import React, { useEffect } from 'react';
import { useToastEnhanced } from '@/hooks/useToastEnhanced';
import { useRealTimeNotificationSystem } from '@/hooks/useRealTimeData';

export const NotificationToasts: React.FC = () => {
  const { notifications } = useRealTimeNotificationSystem();
  const { showInfo, showSuccess, showWarning, showError } = useToastEnhanced();

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      
      if (!latestNotification.read) {
        switch (latestNotification.type) {
          case 'novo_contato':
            showSuccess('Novo Contato', latestNotification.message);
            break;
          case 'lead_atualizado':
            showInfo('Lead Atualizado', latestNotification.message);
            break;
          case 'demanda_urgente':
            showError('Demanda Urgente', latestNotification.message);
            break;
          case 'evento_proximo':
            showWarning('Evento Próximo', latestNotification.message);
            break;
          default:
            showInfo('Notificação', latestNotification.message);
        }
      }
    }
  }, [notifications, showInfo, showSuccess, showWarning, showError]);

  return null; // Este componente só gerencia toasts
};
