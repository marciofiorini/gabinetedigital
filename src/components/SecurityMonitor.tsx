
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecurityAlert {
  id: string;
  type: 'suspicious_activity' | 'failed_login' | 'session_expired' | 'data_breach';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  dismissed: boolean;
}

export const SecurityMonitor: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    checkSecurityAlerts();
    
    // Check for security alerts every 5 minutes
    const interval = setInterval(checkSecurityAlerts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  const checkSecurityAlerts = async () => {
    if (!user) return;

    try {
      // Check for failed login attempts
      const { data: failedLogins, error } = await supabase
        .from('access_logs')
        .select('*')
        .eq('action', 'failed_login')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error checking security alerts:', error);
        return;
      }

      const newAlerts: SecurityAlert[] = [];

      // Check for multiple failed login attempts
      if (failedLogins && failedLogins.length >= 3) {
        const recentAttempts = failedLogins.filter(log => 
          new Date(log.created_at).getTime() > Date.now() - 60 * 60 * 1000 // Last hour
        );

        if (recentAttempts.length >= 3) {
          newAlerts.push({
            id: `failed_login_${Date.now()}`,
            type: 'failed_login',
            message: `${recentAttempts.length} tentativas de login falharam na última hora`,
            severity: 'high',
            timestamp: new Date().toISOString(),
            dismissed: false,
          });
        }
      }

      // Check for suspicious activity patterns
      const suspiciousPatterns = await checkSuspiciousPatterns();
      newAlerts.push(...suspiciousPatterns);

      if (newAlerts.length > 0) {
        setAlerts(prev => [...prev, ...newAlerts]);
        setIsVisible(true);
        
        // Show toast for critical alerts
        const criticalAlerts = newAlerts.filter(alert => alert.severity === 'critical');
        if (criticalAlerts.length > 0) {
          toast({
            title: 'Alerta de Segurança Crítico',
            description: criticalAlerts[0].message,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Security monitoring error:', error);
    }
  };

  const checkSuspiciousPatterns = async (): Promise<SecurityAlert[]> => {
    const alerts: SecurityAlert[] = [];
    
    try {
      // Check for unusual login times
      const { data: recentLogins } = await supabase
        .from('access_logs')
        .select('*')
        .eq('user_id', user?.id)
        .eq('action', 'login')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (recentLogins) {
        const nightLogins = recentLogins.filter(log => {
          const hour = new Date(log.created_at).getHours();
          return hour >= 0 && hour <= 5; // Between midnight and 5 AM
        });

        if (nightLogins.length >= 3) {
          alerts.push({
            id: `unusual_hours_${Date.now()}`,
            type: 'suspicious_activity',
            message: 'Detectados logins em horários incomuns (madrugada)',
            severity: 'medium',
            timestamp: new Date().toISOString(),
            dismissed: false,
          });
        }
      }

      // Check for rapid successive logins
      if (recentLogins && recentLogins.length >= 2) {
        const sortedLogins = recentLogins.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        for (let i = 0; i < sortedLogins.length - 1; i++) {
          const timeDiff = new Date(sortedLogins[i].created_at).getTime() - 
                          new Date(sortedLogins[i + 1].created_at).getTime();
          
          if (timeDiff < 5 * 60 * 1000) { // Less than 5 minutes apart
            alerts.push({
              id: `rapid_login_${Date.now()}`,
              type: 'suspicious_activity',
              message: 'Detectados logins muito próximos no tempo',
              severity: 'medium',
              timestamp: new Date().toISOString(),
              dismissed: false,
            });
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error checking suspicious patterns:', error);
    }

    return alerts;
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const dismissAll = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, dismissed: true })));
    setIsVisible(false);
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  if (!isVisible || activeAlerts.length === 0) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
      {activeAlerts.map((alert) => (
        <Alert key={alert.id} className={`${getSeverityColor(alert.severity)} shadow-lg`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              {alert.severity === 'critical' || alert.severity === 'high' ? (
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <AlertDescription className="text-sm font-medium">
                  {alert.message}
                </AlertDescription>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(alert.id)}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </Alert>
      ))}
      
      {activeAlerts.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={dismissAll}
          className="w-full text-xs"
        >
          Dispensar Todos
        </Button>
      )}
    </div>
  );
};
