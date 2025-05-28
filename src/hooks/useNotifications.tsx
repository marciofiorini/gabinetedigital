
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simular notificações do sistema
    const interval = setInterval(() => {
      const mockNotifications: Notification[] = [
        {
          id: Math.random().toString(),
          title: 'Nova demanda recebida',
          message: 'Uma nova demanda foi registrada na Zona Norte',
          type: 'info',
          timestamp: new Date(),
          read: false
        }
      ];

      // Adicionar notificação aleatoriamente
      if (Math.random() > 0.9) {
        const newNotification = mockNotifications[0];
        setNotifications(prev => [newNotification, ...prev]);
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }, 10000); // A cada 10 segundos

    return () => clearInterval(interval);
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead
  };
};
