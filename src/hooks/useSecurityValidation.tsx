
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const useSecurityValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const { user } = useAuth();

  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsValidating(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const now = new Date().getTime();
      const sessionExpiry = session.expires_at ? session.expires_at * 1000 : 0;
      
      if (sessionExpiry && now > sessionExpiry) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [user]);

  const validateInput = useCallback((input: string, type: 'email' | 'text' | 'password'): SecurityValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (/<script|javascript:|on\w+=/i.test(input)) {
      errors.push('Input contém conteúdo potencialmente perigoso');
    }

    if (/'|;|--|\/\*|\*\/|xp_|sp_/i.test(input)) {
      errors.push('Input contém caracteres não permitidos');
    }

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          errors.push('Formato de email inválido');
        }
        break;
      
      case 'password':
        if (input.length < 8) {
          errors.push('Senha deve ter pelo menos 8 caracteres');
        }
        if (!/(?=.*[a-z])/.test(input)) {
          errors.push('Senha deve conter pelo menos uma letra minúscula');
        }
        if (!/(?=.*[A-Z])/.test(input)) {
          errors.push('Senha deve conter pelo menos uma letra maiúscula');
        }
        if (!/(?=.*\d)/.test(input)) {
          errors.push('Senha deve conter pelo menos um número');
        }
        if (/(.)\1{2,}/.test(input)) {
          warnings.push('Evite sequências repetitivas na senha');
        }
        break;
      
      case 'text':
        if (input.length > 1000) {
          errors.push('Texto muito longo (máximo 1000 caracteres)');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, []);

  const sanitizeInput = useCallback((input: string): string => {
    return input
      .replace(/[<>]/g, '')
      .replace(/['";]/g, '')
      .trim();
  }, []);

  const logSecurityEvent = useCallback(async (action: string, details?: any) => {
    if (!user) return;

    try {
      await supabase.from('access_logs').insert({
        user_id: user.id,
        changed_by: user.id,
        action,
        module: 'security',
        changes: details ? JSON.stringify(details) : null,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [user]);

  return {
    isValidating,
    validateSession,
    validateInput,
    sanitizeInput,
    logSecurityEvent
  };
};
