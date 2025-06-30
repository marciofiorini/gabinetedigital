
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSecurityLogging } from './useSecurityLogging';

interface SessionSecurityConfig {
  sessionTimeout: number;
  activityCheckInterval: number;
  maxFailedAttempts: number;
  lockoutDuration: number;
}

export const useSessionSecurity = (
  user: any,
  signOut: () => Promise<void>,
  config?: Partial<SessionSecurityConfig>
) => {
  const { toast } = useToast();
  const { logSecurityEvent } = useSecurityLogging();
  
  const defaultConfig: SessionSecurityConfig = {
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    activityCheckInterval: 60000, // 1 minute
    maxFailedAttempts: 5,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
  };

  const finalConfig = { ...defaultConfig, ...config };
  
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const trackActivity = useCallback(() => {
    setLastActivity(Date.now());
    logSecurityEvent('user_activity', { timestamp: new Date().toISOString() }, user?.id);
  }, [user?.id, logSecurityEvent]);

  const handleFailedAttempt = useCallback(async (email: string) => {
    const newFailedAttempts = failedAttempts + 1;
    setFailedAttempts(newFailedAttempts);
    
    if (newFailedAttempts >= finalConfig.maxFailedAttempts) {
      setIsLocked(true);
      setTimeout(() => setIsLocked(false), finalConfig.lockoutDuration);
      
      await logSecurityEvent('account_locked', {
        email,
        failed_attempts: newFailedAttempts,
        lockout_duration: finalConfig.lockoutDuration,
      });
    }
    
    return newFailedAttempts;
  }, [failedAttempts, finalConfig, logSecurityEvent]);

  const resetFailedAttempts = useCallback(() => {
    setFailedAttempts(0);
    setIsLocked(false);
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, trackActivity, { passive: true });
    });

    const timeoutCheck = setInterval(() => {
      if (user && Date.now() - lastActivity > finalConfig.sessionTimeout) {
        toast({
          title: 'Sessão Expirada',
          description: 'Sua sessão expirou por inatividade. Faça login novamente.',
          variant: 'destructive',
        });
        logSecurityEvent('session_timeout', { user_id: user.id });
        signOut();
      }
    }, finalConfig.activityCheckInterval);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, trackActivity);
      });
      clearInterval(timeoutCheck);
    };
  }, [user, lastActivity, finalConfig, toast, trackActivity, signOut, logSecurityEvent]);

  return {
    lastActivity,
    failedAttempts,
    isLocked,
    handleFailedAttempt,
    resetFailedAttempts,
    trackActivity
  };
};
