
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Activity, Server, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  details: any;
  user_id?: string;
  ip_address?: string;
}

export const RealTimeSecurityMonitor = () => {
  const { user } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [activeThreats, setActiveThreats] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Real-time subscription for security events
    const channel = supabase
      .channel('security-monitor')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'access_logs',
          filter: 'module=eq.security'
        },
        (payload) => {
          const event: SecurityEvent = {
            id: payload.new?.id || payload.old?.id,
            event_type: payload.new?.action || payload.old?.action,
            severity: determineSeverity(payload.new?.action),
            timestamp: new Date(payload.new?.created_at || payload.old?.created_at),
            details: payload.new?.changes ? JSON.parse(payload.new.changes) : {},
            user_id: payload.new?.user_id,
            ip_address: payload.new?.ip_address
          };

          setSecurityEvents(prev => [event, ...prev.slice(0, 49)]);
          
          if (event.severity === 'critical' || event.severity === 'high') {
            setActiveThreats(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const determineSeverity = (eventType: string): 'low' | 'medium' | 'high' | 'critical' => {
    switch (eventType) {
      case 'failed_login':
      case 'session_validation_failed':
        return 'high';
      case 'session_timeout':
      case 'session_extended':
        return 'medium';
      case 'user_login':
      case 'user_logout':
        return 'low';
      default:
        return 'medium';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Monitor de Segurança em Tempo Real
          {activeThreats > 0 && (
            <Badge className="bg-red-600 text-white">
              {activeThreats} ameaças ativas
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeThreats > 0 && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Alerta de Segurança:</strong> {activeThreats} evento(s) de alta prioridade detectado(s).
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {securityEvents.slice(0, 10).map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{event.event_type}</span>
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {event.timestamp.toLocaleString('pt-BR')}
                    {event.ip_address && ` • IP: ${event.ip_address}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
