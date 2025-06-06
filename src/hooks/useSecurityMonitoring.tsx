
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityMetrics {
  totalSecurityEvents: number;
  criticalEvents: number;
  sessionValidations: number;
  failedLogins: number;
  lastSecurityEvent: Date | null;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  user_id?: string;
  details: any;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalSecurityEvents: 0,
    criticalEvents: 0,
    sessionValidations: 0,
    failedLogins: 0,
    lastSecurityEvent: null,
    threatLevel: 'low'
  });
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateThreatLevel = useCallback((events: SecurityEvent[]): 'low' | 'medium' | 'high' | 'critical' => {
    const recentCritical = events.filter(e => 
      e.severity === 'critical' && 
      new Date(e.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    ).length;
    
    const recentHigh = events.filter(e => 
      e.severity === 'high' && 
      new Date(e.timestamp) > new Date(Date.now() - 60 * 60 * 1000)
    ).length;

    if (recentCritical > 0) return 'critical';
    if (recentHigh >= 3) return 'high';
    if (recentHigh >= 1) return 'medium';
    return 'low';
  }, []);

  const fetchSecurityMetrics = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch security events from access_logs
      const { data: securityLogs, error } = await supabase
        .from('access_logs')
        .select('*')
        .eq('module', 'security')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const events: SecurityEvent[] = securityLogs?.map(log => ({
        id: log.id,
        event_type: log.action,
        severity: determineSeverity(log.action),
        timestamp: new Date(log.created_at),
        user_id: log.user_id,
        details: log.changes ? JSON.parse(log.changes) : {}
      })) || [];

      setRecentEvents(events.slice(0, 20));

      const now = Date.now();
      const last24Hours = now - (24 * 60 * 60 * 1000);
      const recentEvents = events.filter(e => new Date(e.timestamp).getTime() > last24Hours);

      const newMetrics: SecurityMetrics = {
        totalSecurityEvents: events.length,
        criticalEvents: recentEvents.filter(e => e.severity === 'critical').length,
        sessionValidations: recentEvents.filter(e => e.event_type.includes('session')).length,
        failedLogins: recentEvents.filter(e => e.event_type === 'failed_login').length,
        lastSecurityEvent: events.length > 0 ? events[0].timestamp : null,
        threatLevel: calculateThreatLevel(recentEvents)
      };

      setMetrics(newMetrics);

    } catch (error) {
      console.error('Error fetching security metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [user, calculateThreatLevel]);

  const logSecurityEvent = useCallback(async (eventType: string, details?: any) => {
    if (!user) return;

    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_user_id: user.id,
        p_ip_address: null,
        p_user_agent: navigator.userAgent,
        p_details: details
      });
      
      // Refresh metrics after logging
      await fetchSecurityMetrics();
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }, [user, fetchSecurityMetrics]);

  const determineSeverity = (eventType: string): 'low' | 'medium' | 'high' | 'critical' => {
    switch (eventType) {
      case 'failed_login':
      case 'session_validation_failed':
      case 'brute_force_attempt':
        return 'high';
      case 'session_timeout':
      case 'session_extended':
      case 'suspicious_activity':
        return 'medium';
      case 'user_login':
      case 'user_logout':
      case 'session_extended_manually':
        return 'low';
      case 'system_breach':
      case 'unauthorized_access':
        return 'critical';
      default:
        return 'medium';
    }
  };

  // Set up real-time monitoring
  useEffect(() => {
    fetchSecurityMetrics();

    if (!user) return;

    const channel = supabase
      .channel('security-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'access_logs',
          filter: 'module=eq.security'
        },
        () => {
          fetchSecurityMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchSecurityMetrics]);

  return {
    metrics,
    recentEvents,
    loading,
    logSecurityEvent,
    refreshMetrics: fetchSecurityMetrics
  };
};
