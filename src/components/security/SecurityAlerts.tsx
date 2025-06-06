
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Clock, Eye, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SecurityAlert {
  id: string;
  type: 'failed_login_attempts' | 'session_anomaly' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  message: string;
  resolved: boolean;
  details?: any;
}

export const SecurityAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch security logs
  const fetchSecurityLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('access_logs')
        .select('*')
        .eq('module', 'security')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      setSecurityLogs(data || []);
      
      // Generate alerts based on security logs
      const recentLogs = data?.filter(log => 
        new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      ) || [];
      
      const generatedAlerts = generateAlerts(recentLogs);
      setAlerts(generatedAlerts);
      
    } catch (error) {
      console.error('Error fetching security logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = (logs: any[]): SecurityAlert[] => {
    const alerts: SecurityAlert[] = [];
    
    // Check for failed login attempts
    const failedLogins = logs.filter(log => log.action === 'failed_login');
    if (failedLogins.length >= 3) {
      alerts.push({
        id: `failed_login_${Date.now()}`,
        type: 'failed_login_attempts',
        severity: failedLogins.length >= 5 ? 'high' : 'medium',
        timestamp: new Date(),
        message: `${failedLogins.length} tentativas de login falharam nas últimas 24 horas`,
        resolved: false,
        details: { count: failedLogins.length }
      });
    }
    
    // Check for suspicious activity patterns
    const userAgents = new Set(logs.map(log => log.user_agent).filter(Boolean));
    if (userAgents.size > 3) {
      alerts.push({
        id: `suspicious_activity_${Date.now()}`,
        type: 'suspicious_activity',
        severity: 'high',
        timestamp: new Date(),
        message: `Atividade de ${userAgents.size} dispositivos/navegadores diferentes detectada`,
        resolved: false,
        details: { user_agents: Array.from(userAgents) }
      });
    }

    return alerts;
  };

  useEffect(() => {
    fetchSecurityLogs();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('security-logs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'access_logs',
          filter: 'module=eq.security'
        },
        () => {
          fetchSecurityLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const resolveAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
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
      case 'failed_login_attempts': return <Shield className="w-4 h-4" />;
      case 'session_anomaly': return <Clock className="w-4 h-4" />;
      case 'suspicious_activity': return <Eye className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');

  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Alerta Crítico de Segurança:</strong> {criticalAlerts.length} evento(s) crítico(s) detectado(s). 
            Ação imediata necessária.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Status de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Activity className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <p className="text-sm text-green-800 font-medium">Monitoramento</p>
              <p className="text-xs text-green-600">{securityLogs.length} eventos</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-blue-800 font-medium">Validação Ativa</p>
              <p className="text-xs text-blue-600">Sistema ativo</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Eye className="w-6 h-6 mx-auto text-purple-600 mb-2" />
              <p className="text-sm text-purple-800 font-medium">Alertas</p>
              <p className="text-xs text-purple-600">{activeAlerts.length} ativos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Segurança ({activeAlerts.length})
            </CardTitle>
            <CardDescription>
              Eventos que requerem atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.slice(0, 5).map((alert) => (
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
                        <h4 className="font-medium">{alert.message}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(alert.timestamp, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </div>
                      </div>
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
