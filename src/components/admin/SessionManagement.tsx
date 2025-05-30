
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToastEnhanced } from '@/hooks/useToastEnhanced';
import { Monitor, Smartphone, Tablet, MapPin, Clock, Wifi, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Session {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: Date;
  current: boolean;
}

export const SessionManagement = () => {
  const { showSuccess, showError } = useToastEnhanced();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [allowMultipleSessions, setAllowMultipleSessions] = useState(true);
  const [maxSessions, setMaxSessions] = useState(5);
  const [loading, setLoading] = useState(false);

  // Simulação de dados de sessão
  useEffect(() => {
    setSessions([
      {
        id: '1',
        deviceType: 'desktop',
        browser: 'Chrome 120',
        os: 'Windows 11',
        location: 'São Paulo, Brasil',
        ip: '192.168.1.100',
        lastActive: new Date(),
        current: true
      },
      {
        id: '2',
        deviceType: 'mobile',
        browser: 'Safari',
        os: 'iOS 17',
        location: 'São Paulo, Brasil',
        ip: '192.168.1.101',
        lastActive: new Date(Date.now() - 3600000), // 1 hora atrás
        current: false
      },
      {
        id: '3',
        deviceType: 'tablet',
        browser: 'Chrome',
        os: 'Android 14',
        location: 'Rio de Janeiro, Brasil',
        ip: '10.0.0.50',
        lastActive: new Date(Date.now() - 86400000), // 1 dia atrás
        current: false
      }
    ]);
  }, []);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return <Monitor className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const terminateSession = async (sessionId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      showSuccess('Sessão terminada com sucesso');
    } catch (error) {
      showError('Erro ao terminar sessão');
    } finally {
      setLoading(false);
    }
  };

  const terminateAllOtherSessions = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessions(prev => prev.filter(s => s.current));
      showSuccess('Todas as outras sessões foram terminadas');
    } catch (error) {
      showError('Erro ao terminar sessões');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Gerenciamento de Sessões
          </CardTitle>
          <CardDescription>
            Monitore e controle as sessões ativas dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configurações */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Configurações de Sessão</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="multipleSessions">Permitir múltiplas sessões</Label>
              <Switch
                id="multipleSessions"
                checked={allowMultipleSessions}
                onCheckedChange={setAllowMultipleSessions}
              />
            </div>
            
            {allowMultipleSessions && (
              <div className="space-y-2">
                <Label>Máximo de sessões simultâneas: {maxSessions}</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxSessions}
                  onChange={(e) => setMaxSessions(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
              <p className="text-sm text-gray-600">Sessões Ativas</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {sessions.filter(s => s.deviceType === 'desktop').length}
              </p>
              <p className="text-sm text-gray-600">Desktop</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {sessions.filter(s => s.deviceType === 'mobile').length}
              </p>
              <p className="text-sm text-gray-600">Mobile</p>
            </div>
          </div>

          {/* Lista de Sessões */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Sessões Ativas</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={terminateAllOtherSessions}
                disabled={loading || sessions.filter(s => !s.current).length === 0}
              >
                Terminar Outras Sessões
              </Button>
            </div>
            
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-gray-600 mt-1">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{session.browser}</h4>
                        {session.current && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Sessão Atual
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          {session.os}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.location} ({session.ip})
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Última atividade: {formatDistanceToNow(session.lastActive, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!session.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => terminateSession(session.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
