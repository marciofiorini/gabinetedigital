
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRealTimeData = (table: string, onUpdate?: () => void) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    console.log(`Setting up real-time connection for ${table}`);
    
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log(`Real-time update for ${table}:`, payload);
          if (onUpdate) {
            onUpdate();
          }
        }
      )
      .subscribe((status) => {
        console.log(`Real-time status for ${table}:`, status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      console.log(`Cleaning up real-time connection for ${table}`);
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [table, user, onUpdate]);

  return { isConnected };
};

export const useRealTimeNotificationSystem = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Simular notificações em tempo real para demonstração
    const simulateNotifications = () => {
      const eventTypes = [
        { type: 'novo_contato', message: 'Novo contato adicionado', color: 'blue' },
        { type: 'lead_atualizado', message: 'Lead atualizado no CRM', color: 'green' },
        { type: 'demanda_urgente', message: 'Nova demanda urgente', color: 'red' },
        { type: 'evento_proximo', message: 'Evento próximo na agenda', color: 'orange' }
      ];

      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      const newNotification = {
        id: Date.now(),
        ...randomEvent,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    };

    // Simular notificações a cada 30 segundos
    const interval = setInterval(simulateNotifications, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAsRead,
    clearAll,
    unreadCount: notifications.filter(n => !n.read).length
  };
};
