
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LoginAttempt {
  timestamp: Date;
  success: boolean;
  ip?: string;
  userAgent?: string;
}

export const SecurityMonitor = () => {
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Monitor for suspicious login patterns
    const checkSuspiciousActivity = () => {
      const recentAttempts = loginAttempts.filter(
        attempt => Date.now() - attempt.timestamp.getTime() < 15 * 60 * 1000 // 15 minutes
      );
      
      const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
      
      if (failedAttempts.length >= 5) {
        setSuspiciousActivity(true);
        // In a real implementation, this would trigger security measures
        console.warn('Suspicious login activity detected');
      }
    };

    checkSuspiciousActivity();
  }, [loginAttempts, user]);

  const logLoginAttempt = (success: boolean) => {
    const attempt: LoginAttempt = {
      timestamp: new Date(),
      success,
      userAgent: navigator.userAgent
    };
    
    setLoginAttempts(prev => [...prev.slice(-50), attempt]); // Keep last 50 attempts
  };

  // This would be called from the auth context on login attempts
  return null; // This is a background monitoring component
};
