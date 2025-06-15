
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare, Check, X, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
  action_url?: string;
}

export const NotificationSystemAdvanced = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    whatsapp: false,
    sms: false
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Mapear os dados para garantir que os tipos estão corretos
      const mappedNotifications = (data || []).map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: (['info', 'warning', 'error', 'success'].includes(notification.type) 
          ? notification.type 
          : 'info') as 'info' | 'warning' | 'error' | 'success',
        read: notification.read,
        created_at: notification.created_at,
        action_url: notification.action_url
      }));
      
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = {
            id: payload.new.id,
            title: payload.new.title,
            message: payload.new.message,
            type: (['info', 'warning', 'error', 'success'].includes(payload.new.type) 
              ? payload.new.type 
              : 'info') as 'info' | 'warning' | 'error' | 'success',
            read: payload.new.read,
            created_at: payload.new.created_at,
            action_url: payload.new.action_url
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast notification
          toast.success(newNotification.title, {
            description: newNotification.message
          });

          // Send push notification if enabled
          if (settings.push && 'Notification' in window) {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/icon-192.png'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      toast.success('Todas as notificações marcadas como lidas');
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, push: true }));
        toast.success('Notificações push ativadas!');
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Central de Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button size="sm" variant="outline" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Gerencie suas notificações em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Configurações de Notificação */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-3">Canais de Notificação</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Email</span>
              <Badge variant={settings.email ? "default" : "secondary"}>
                {settings.email ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="text-sm">Push</span>
              <Badge variant={settings.push ? "default" : "secondary"}>
                {settings.push ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">WhatsApp</span>
              <Badge variant={settings.whatsapp ? "default" : "secondary"}>
                {settings.whatsapp ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <Button size="sm" onClick={requestPushPermission}>
              Ativar Push
            </Button>
          </div>
        </div>

        {/* Lista de Notificações */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma notificação encontrada
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    <div>
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
