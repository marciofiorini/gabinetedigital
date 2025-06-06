
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Clock, Users, Activity, Eye, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'session_timeout' | 'rate_limit_exceeded';
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  details: string;
}

interface SecurityMetrics {
  totalEvents: number;
  highSeverityEvents: number;
  activeSessions: number;
  uniqueIPs: number;
  lastActivity: Date;
}

export const SecurityMonitoringDashboard = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    highSeverityEvents: 0,
    activeSessions: 0,
    uniqueIPs: 0,
    lastActivity: new Date()
  });
  const [loading, setLoading] = useState(false);

  // Simulate security events for demonstration
  useEffect(() => {
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'failed_login',
        severity: 'medium',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        ip: '192.168.1.100',
        userAgent: 'Chrome 120',
        details: 'Falha no login após 3 tentativas'
      },
      {
        id: '2',
        type: 'suspicious_activity',
        severity: 'high',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        ip: '10.0.0.50',
        userAgent: 'Unknown',
        details: 'Múltiplas tentativas de acesso de IP não reconhecido'
      },
      {
        id: '3',
        type: 'session_timeout',
        severity: 'low',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        details: 'Sessão expirou por inatividade'
      }
    ];

    setEvents(mockEvents);
    setMetrics({
      totalEvents: mockEvents.length,
      highSeverityEvents: mockEvents.filter(e => e.severity === 'high').length,
      activeSessions: 12,
      uniqueIPs: 8,
      lastActivity: new Date()
    });
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return <Shield className="w-4 h-4" />;
      case 'suspicious_activity': return <AlertTriangle className="w-4 h-4" />;
      case 'session_timeout': return <Clock className="w-4 h-4" />;
      case 'rate_limit_exceeded': return <Activity className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMetrics(prev => ({ ...prev, lastActivity: new Date() }));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monitoramento de Segurança</h2>
          <p className="text-gray-600">Dashboard de eventos e métricas de segurança</p>
        </div>
        <Button onClick={refreshData} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Eventos</p>
                <p className="text-2xl font-bold">{metrics.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alta Severidade</p>
                <p className="text-2xl font-bold text-red-600">{metrics.highSeverityEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sessões Ativas</p>
                <p className="text-2xl font-bold">{metrics.activeSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">IPs Únicos</p>
                <p className="text-2xl font-bold">{metrics.uniqueIPs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Alerts */}
      {metrics.highSeverityEvents > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenção:</strong> {metrics.highSeverityEvents} evento(s) de alta severidade detectado(s). 
            Revise os logs abaixo e tome as ações necessárias.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Eventos de Segurança Recentes
          </CardTitle>
          <CardDescription>
            Últimos eventos registrados pelo sistema de monitoramento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum evento registrado</p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-gray-600 mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{event.details}</h4>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {event.ip && (
                          <div>IP: {event.ip}</div>
                        )}
                        {event.userAgent && (
                          <div>User Agent: {event.userAgent}</div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(event.timestamp, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações de Segurança</CardTitle>
          <CardDescription>
            Ações recomendadas para manter a segurança do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Configurar alertas automáticos</p>
                <p className="text-sm text-blue-700">
                  Configure notificações por email para eventos de alta severidade
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Revisar sessões ativas</p>
                <p className="text-sm text-yellow-700">
                  Verifique sessões suspeitas e implemente timeout automático
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Activity className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Monitoramento contínuo</p>
                <p className="text-sm text-green-700">
                  Sistema de monitoramento ativo e funcionando corretamente
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
