
import { useState } from 'react';

interface SecurityEvent {
  id: string;
  action: string;
  module?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  old_value?: string;
}

export const useSecurityMonitoring = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSecurityEvents = async () => {
    console.log('Mock: fetchSecurityEvents');
    setSecurityEvents([]);
  };

  const checkSessionValidity = async () => {
    console.log('Mock: checkSessionValidity');
    return true;
  };

  const getFailedLoginAttempts = (email?: string) => {
    console.log('Mock: getFailedLoginAttempts', email);
    return [];
  };

  const getRecentLogins = () => {
    console.log('Mock: getRecentLogins');
    return [];
  };

  const logSecurityAction = async (action: string, details?: any) => {
    console.log('Mock: logSecurityAction', action, details);
  };

  return {
    securityEvents,
    loading,
    fetchSecurityEvents,
    checkSessionValidity,
    getFailedLoginAttempts,
    getRecentLogins,
    logSecurityAction
  };
};
