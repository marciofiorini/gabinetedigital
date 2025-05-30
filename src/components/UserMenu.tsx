
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell, User, LogOut, Settings, CheckCheck, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const UserMenu = () => {
  const { user, profile, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useRealTimeNotifications();

  if (!user) return null;

  const displayName = profile?.name || user.email?.split('@')[0] || 'Usuário';

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="flex items-center gap-3 h-8">
      {/* Notificações */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0 flex items-center justify-center">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Notificações</h4>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Nenhuma notificação</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {notifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      notif.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm">{getNotificationIcon(notif.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{notif.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notif.created_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Menu do usuário */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 max-w-xs h-8 px-2">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium truncate max-w-[120px]">
              {displayName}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div>
              <p className="font-medium truncate">{displayName}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/configuracoes" className="flex items-center w-full">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/planos" className="flex items-center w-full">
              <Crown className="w-4 h-4 mr-2" />
              Planos
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
