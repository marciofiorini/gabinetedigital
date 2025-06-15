
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
      
      // Check if session is still valid
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      // Call our security validation function
      const { data: isValid, error } = await supabase.rpc('validate_session_security', {
        p_user_id: user.id,
        p_max_idle_minutes: 30
      });

      if (error) {
        console.error('Session validation error:', error);
        return false;
      }

      return isValid || false;
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

    // Basic XSS protection
    if (/<script|javascript:|on\w+=/i.test(input)) {
      errors.push('Input contém conteúdo potencialmente perigoso');
    }

    // SQL injection basic checks
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
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['";]/g, '') // Remove potential SQL injection chars
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
