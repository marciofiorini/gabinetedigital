
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Clock, Users, Activity, Eye, Mail, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityAlert {
  id: string;
  type: 'failed_login_burst' | 'unusual_location' | 'concurrent_sessions' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  details: string;
  userId?: string;
  ip?: string;
  location?: string;
  resolved: boolean;
}

interface SessionInfo {
  id: string;
  userId: string;
  ip: string;
  userAgent: string;
  location: string;
  lastActivity: Date;
  isCurrentSession: boolean;
}

export const EnhancedSecurityMonitor = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [activeSessions, setActiveSessions] = useState<SessionInfo[]>([]);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [anomalyDetectionEnabled, setAnomalyDetectionEnabled] = useState(true);

  // Simulate security monitoring data
  useEffect(() => {
    if (!user) return;

    const mockAlerts: SecurityAlert[] = [
      {
        id: '1',
        type: 'failed_login_burst',
        severity: 'high',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        details: '5 tentativas de login falharam em 2 minutos do IP 192.168.1.100',
        ip: '192.168.1.100',
        location: 'São Paulo, SP',
        resolved: false
      },
      {
        id: '2',
        type: 'unusual_location',
        severity: 'medium',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        details: 'Login realizado de localização não usual: Rio de Janeiro, RJ',
        userId: user.id,
        ip: '10.0.0.50',
        location: 'Rio de Janeiro, RJ',
        resolved: false
      }
    ];

    const mockSessions: SessionInfo[] = [
      {
        id: 'session-1',
        userId: user.id,
        ip: '192.168.1.101',
        userAgent: 'Chrome 120.0.0.0',
        location: 'São Paulo, SP',
        lastActivity: new Date(),
        isCurrentSession: true
      },
      {
        id: 'session-2',
        userId: user.id,
        ip: '10.0.0.25',
        userAgent: 'Firefox 119.0',
        location: 'Brasília, DF',
        lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
        isCurrentSession: false
      }
    ];

    setAlerts(mockAlerts);
    setActiveSessions(mockSessions);
  }, [user]);

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const terminateSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    // In real implementation, would call API to terminate session
    console.log(`Session ${sessionId} terminated`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'failed_login_burst': return <Shield className="w-4 h-4" />;
      case 'unusual_location': return <MapPin className="w-4 h-4" />;
      case 'concurrent_sessions': return <Users className="w-4 h-4" />;
      case 'suspicious_activity': return <AlertTriangle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.severity === 'critical');

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Alerta Crítico:</strong> {criticalAlerts.length} evento(s) crítico(s) detectado(s). 
            Ação imediata necessária.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Configurações de Segurança
          </CardTitle>
          <CardDescription>
            Configure alertas automáticos e detecção de anomalias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Alertas por Email</span>
              </div>
              <Button
                variant={emailAlertsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setEmailAlertsEnabled(!emailAlertsEnabled)}
              >
                {emailAlertsEnabled ? 'Ativado' : 'Desativado'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Detecção de Anomalias</span>
              </div>
              <Button
                variant={anomalyDetectionEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setAnomalyDetectionEnabled(!anomalyDetectionEnabled)}
              >
                {anomalyDetectionEnabled ? 'Ativado' : 'Desativado'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertas de Segurança ({unresolvedAlerts.length})
          </CardTitle>
          <CardDescription>
            Eventos de segurança que requerem atenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {unresolvedAlerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum alerta pendente</p>
            ) : (
              unresolvedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-gray-600 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <p className="font-medium mb-1">{alert.details}</p>
                      {alert.ip && (
                        <p className="text-sm text-gray-600">IP: {alert.ip}</p>
                      )}
                      {alert.location && (
                        <p className="text-sm text-gray-600">Local: {alert.location}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolver
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Sessões Ativas ({activeSessions.length})
          </CardTitle>
          <CardDescription>
            Gerencie sessões ativas da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-white"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{session.userAgent}</span>
                    {session.isCurrentSession && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Sessão Atual
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.location}
                    </div>
                    <div>IP: {session.ip}</div>
                    <div>Última atividade: {session.lastActivity.toLocaleString('pt-BR')}</div>
                  </div>
                </div>
                {!session.isCurrentSession && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => terminateSession(session.id)}
                  >
                    Encerrar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
