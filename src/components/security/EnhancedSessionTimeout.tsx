
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Clock, AlertTriangle, Shield } from 'lucide-react';

interface EnhancedSessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export const EnhancedSessionTimeout = ({ 
  timeoutMinutes = 30, 
  warningMinutes = 5 
}: EnhancedSessionTimeoutProps) => {
  const { signOut, user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60);
  const [isActive, setIsActive] = useState(true);
  const [sessionValid, setSessionValid] = useState(true);

  const validateSessionServerSide = useCallback(async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('validate_user_session', {
        p_user_id: user.id,
        p_session_timeout_minutes: timeoutMinutes
      });

      if (error) {
        console.error('Session validation error:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }, [user, timeoutMinutes]);

  const logSecurityEvent = useCallback(async (eventType: string, details?: any) => {
    if (!user) return;

    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_user_id: user.id,
        p_ip_address: null, // Client-side can't reliably get IP
        p_user_agent: navigator.userAgent,
        p_details: details
      });
    } catch (error) {
      console.error('Security event logging failed:', error);
    }
  }, [user]);

  const resetTimer = useCallback(() => {
    setTimeLeft(timeoutMinutes * 60);
    setShowWarning(false);
    setIsActive(true);
    logSecurityEvent('session_extended');
  }, [timeoutMinutes, logSecurityEvent]);

  const handleLogout = useCallback(async () => {
    setShowWarning(false);
    await logSecurityEvent('session_timeout');
    await signOut();
  }, [signOut, logSecurityEvent]);

  const extendSession = useCallback(async () => {
    // Validate session server-side before extending
    const isValid = await validateSessionServerSide();
    if (!isValid) {
      await logSecurityEvent('session_extension_failed', { reason: 'server_validation_failed' });
      await handleLogout();
      return;
    }
    
    resetTimer();
    await logSecurityEvent('session_extended_manually');
  }, [validateSessionServerSide, resetTimer, logSecurityEvent, handleLogout]);

  // Enhanced activity detection with security logging
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimerOnActivity = async () => {
      if (isActive) {
        // Validate session periodically during activity
        if (Math.random() < 0.1) { // 10% chance to validate on activity
          const isValid = await validateSessionServerSide();
          if (!isValid) {
            setSessionValid(false);
            await handleLogout();
            return;
          }
        }
        resetTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimerOnActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimerOnActivity, true);
      });
    };
  }, [resetTimer, isActive, validateSessionServerSide, handleLogout]);

  // Enhanced countdown timer with server-side validation
  useEffect(() => {
    if (!user || !isActive) return;

    const interval = setInterval(async () => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1;
        
        // Show warning when time is low
        if (newTimeLeft <= warningMinutes * 60 && !showWarning) {
          setShowWarning(true);
          logSecurityEvent('session_warning_shown', { time_left: newTimeLeft });
        }
        
        // Validate session server-side when approaching timeout
        if (newTimeLeft === 300) { // 5 minutes before timeout
          validateSessionServerSide().then(isValid => {
            if (!isValid) {
              setSessionValid(false);
              handleLogout();
            }
          });
        }
        
        // Auto logout when time runs out
        if (newTimeLeft <= 0) {
          logSecurityEvent('session_auto_timeout');
          handleLogout();
          return 0;
        }
        
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user, isActive, warningMinutes, showWarning, handleLogout, validateSessionServerSide, logSecurityEvent]);

  // Don't render if user is not logged in
  if (!user) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const warningTimeLeft = warningMinutes * 60;
  const progress = ((warningTimeLeft - timeLeft) / warningTimeLeft) * 100;

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Sessão Expirando
            {!sessionValid && (
              <Shield className="w-5 h-5 text-red-600" title="Sessão inválida detectada" />
            )}
          </DialogTitle>
          <DialogDescription>
            Sua sessão expirará em breve por motivos de segurança
            {!sessionValid && (
              <span className="block text-red-600 mt-1">
                Atividade suspeita detectada - logout necessário
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-2xl font-mono font-bold">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Tempo restante para logout automático
            </p>
          </div>
          
          <Progress value={Math.max(0, progress)} className="w-full" />
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={extendSession}
              disabled={!sessionValid}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {sessionValid ? 'Continuar Sessão' : 'Sessão Inválida'}
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Fazer Logout Agora
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <p>Por segurança, sessões inativas são automaticamente encerradas após {timeoutMinutes} minutos</p>
            <p className="mt-1">Sistema de validação de sessão ativo</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
