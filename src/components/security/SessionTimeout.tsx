
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, AlertTriangle } from 'lucide-react';

interface SessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export const SessionTimeout = ({ 
  timeoutMinutes = 30, 
  warningMinutes = 5 
}: SessionTimeoutProps) => {
  const { signOut, user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60);
  const [isActive, setIsActive] = useState(true);

  const resetTimer = useCallback(() => {
    setTimeLeft(timeoutMinutes * 60);
    setShowWarning(false);
    setIsActive(true);
  }, [timeoutMinutes]);

  const handleLogout = useCallback(async () => {
    setShowWarning(false);
    await signOut();
  }, [signOut]);

  const extendSession = useCallback(() => {
    resetTimer();
    // Log security event
    console.log('Session extended by user:', {
      userId: user?.id,
      timestamp: new Date().toISOString(),
      action: 'session_extended'
    });
  }, [resetTimer, user?.id]);

  // Activity detection
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimerOnActivity = () => {
      if (isActive) {
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
  }, [resetTimer, isActive]);

  // Countdown timer
  useEffect(() => {
    if (!user || !isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1;
        
        // Show warning when time is low
        if (newTimeLeft <= warningMinutes * 60 && !showWarning) {
          setShowWarning(true);
        }
        
        // Auto logout when time runs out
        if (newTimeLeft <= 0) {
          console.log('Session timeout - auto logout:', {
            userId: user.id,
            timestamp: new Date().toISOString(),
            reason: 'session_timeout'
          });
          handleLogout();
          return 0;
        }
        
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user, isActive, warningMinutes, showWarning, handleLogout]);

  // Don't render if user is not logged in
  if (!user) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const warningTimeLeft = warningMinutes * 60;
  const progress = ((warningTimeLeft - timeLeft) / warningTimeLeft) * 100;

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Sessão Expirando
          </DialogTitle>
          <DialogDescription>
            Sua sessão expirará em breve por motivos de segurança
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
              Tempo restante para fazer logout automático
            </p>
          </div>
          
          <Progress value={Math.max(0, progress)} className="w-full" />
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={extendSession}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continuar Sessão
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
            Por segurança, sessões inativas são automaticamente encerradas após {timeoutMinutes} minutos
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
