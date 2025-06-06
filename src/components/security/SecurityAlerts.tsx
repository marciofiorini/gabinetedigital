
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Clock, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityAlert {
  id: string;
  type: 'failed_login_attempts' | 'session_anomaly' | 'rate_limit_exceeded' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  message: string;
  resolved: boolean;
}

export const SecurityAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<Date | null>(null);

  // Monitor for failed login attempts
  useEffect(() => {
    const checkFailedLogins = () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      // Reset counter if last attempt was more than 5 minutes ago
      if (lastAttemptTime && lastAttemptTime < fiveMinutesAgo) {
        setLoginAttempts(0);
        setLastAttemptTime(null);
      }

      // Create alert for multiple failed attempts
      if (loginAttempts >= 3) {
        const existingAlert = alerts.find(a => 
          a.type === 'failed_login_attempts' && !a.resolved
        );

        if (!existingAlert) {
          const newAlert: SecurityAlert = {
            id: `failed_login_${Date.now()}`,
            type: 'failed_login_attempts',
            severity: loginAttempts >= 5 ? 'high' : 'medium',
            timestamp: now,
            message: `${loginAttempts} tentativas de login falharam nos últimos 5 minutos`,
            resolved: false
          };

          setAlerts(prev => [newAlert, ...prev]);
        }
      }
    };

    checkFailedLogins();
  }, [loginAttempts, lastAttemptTime, alerts]);

  // Auto-resolve old alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      setAlerts(prev => prev.map(alert => 
        alert.timestamp < oneHourAgo ? { ...alert, resolved: true } : alert
      ));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const resolveAlert = (alertId: string) => {
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
      case 'rate_limit_exceeded': return <AlertTriangle className="w-4 h-4" />;
      case 'suspicious_activity': return <Eye className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
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
            <strong>Alerta Crítico:</strong> {criticalAlerts.length} evento(s) crítico(s) detectado(s). 
            Ação imediata necessária.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Alerts Card */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Segurança ({activeAlerts.length})
            </CardTitle>
            <CardDescription>
              Eventos de segurança que requerem atenção
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
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <p className="font-medium">{alert.message}</p>
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
