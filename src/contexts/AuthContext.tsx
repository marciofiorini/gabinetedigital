import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced security: Standard error messages to prevent information disclosure
const STANDARD_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  EMAIL_NOT_CONFIRMED: 'Email não confirmado. Verifique sua caixa de entrada.',
  RATE_LIMITED: 'Muitas tentativas. Tente novamente em alguns minutos.',
  WEAK_PASSWORD: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número',
  EMAIL_IN_USE: 'Este email já está em uso',
  INVALID_EMAIL: 'Email inválido',
  REQUIRED_FIELDS: 'Todos os campos são obrigatórios',
  NAME_TOO_SHORT: 'Nome deve ter pelo menos 2 caracteres',
  GENERAL_ERROR: 'Erro no sistema. Tente novamente.',
  UNAUTHORIZED_REDIRECT: 'Redirect URL não autorizada',
  PASSWORD_RESET_SENT: 'Email de redefinição de senha enviado! Verifique sua caixa de entrada.',
  PASSWORD_UPDATED: 'Senha atualizada com sucesso!',
  ACCOUNT_CREATED: 'Conta criada com sucesso! Verifique seu email para confirmar a conta.',
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Enhanced security: Log security events
  const logSecurityEvent = async (eventType: string, details?: any) => {
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_user_id: user?.id,
        p_ip_address: null, // Client-side can't reliably get IP
        p_user_agent: navigator.userAgent,
        p_details: details
      });
    } catch (error) {
      // Silent fail for security logging to not affect user experience
      console.debug('Security logging failed:', error);
    }
  };

  // Enhanced security: Track failed login attempts
  const trackFailedLogin = async (email: string) => {
    try {
      await supabase.rpc('track_failed_login', {
        p_email: email,
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.debug('Failed login tracking failed:', error);
    }
  };

  useEffect(() => {
    // Configure authentication state listener with enhanced security monitoring
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Enhanced security: Log authentication events
        if (event === 'SIGNED_IN' && session?.user) {
          await logSecurityEvent('user_login', {
            user_id: session.user.id,
            method: 'email_password',
            timestamp: new Date().toISOString()
          });
          
          // Security: Defer profile fetch to prevent auth callback deadlock
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          await logSecurityEvent('user_logout', {
            timestamp: new Date().toISOString()
          });
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED') {
          await logSecurityEvent('token_refreshed', {
            timestamp: new Date().toISOString()
          });
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      // Enhanced security: Structured error logging without exposing details
      await logSecurityEvent('profile_fetch_error', {
        error_type: 'database_error',
        user_id: userId,
        timestamp: new Date().toISOString()
      });
      console.debug('Profile fetch error - user may need to complete setup');
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error: any) {
      await logSecurityEvent('google_signin_failed', {
        error_type: error.name || 'unknown',
        timestamp: new Date().toISOString()
      });
      toast.error(STANDARD_ERROR_MESSAGES.GENERAL_ERROR);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Enhanced security: Input validation
      if (!email || !password) {
        throw new Error(STANDARD_ERROR_MESSAGES.REQUIRED_FIELDS);
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(STANDARD_ERROR_MESSAGES.INVALID_EMAIL);
      }

      // Enhanced security: Minimum password length check
      if (password.length < 8) {
        throw new Error(STANDARD_ERROR_MESSAGES.WEAK_PASSWORD);
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        // Enhanced security: Track failed login attempt
        await trackFailedLogin(email);
        throw error;
      }

      toast.success(STANDARD_ERROR_MESSAGES.LOGIN_SUCCESS);
    } catch (error: any) {
      // Enhanced security: Standardized error messages to prevent information disclosure
      let errorMessage = STANDARD_ERROR_MESSAGES.GENERAL_ERROR;
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = STANDARD_ERROR_MESSAGES.INVALID_CREDENTIALS;
        await logSecurityEvent('invalid_credentials_attempt', {
          email: email.trim().toLowerCase(),
          timestamp: new Date().toISOString()
        });
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = STANDARD_ERROR_MESSAGES.EMAIL_NOT_CONFIRMED;
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = STANDARD_ERROR_MESSAGES.RATE_LIMITED;
        await logSecurityEvent('rate_limit_exceeded', {
          email: email.trim().toLowerCase(),
          timestamp: new Date().toISOString()
        });
      } else if (error.message === STANDARD_ERROR_MESSAGES.WEAK_PASSWORD ||
                 error.message === STANDARD_ERROR_MESSAGES.REQUIRED_FIELDS ||
                 error.message === STANDARD_ERROR_MESSAGES.INVALID_EMAIL) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Security: Enhanced input validation
      if (!email || !password || !name) {
        throw new Error(STANDARD_ERROR_MESSAGES.REQUIRED_FIELDS);
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(STANDARD_ERROR_MESSAGES.INVALID_EMAIL);
      }
      
      // Security: Strong password requirements
      if (password.length < 8) {
        throw new Error(STANDARD_ERROR_MESSAGES.WEAK_PASSWORD);
      }
      
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error(STANDARD_ERROR_MESSAGES.WEAK_PASSWORD);
      }
      
      if (name.trim().length < 2) {
        throw new Error(STANDARD_ERROR_MESSAGES.NAME_TOO_SHORT);
      }

      // Security: Validate redirect URL to prevent open redirects
      const allowedDomains = [window.location.origin];
      const redirectUrl = window.location.origin;
      
      if (!allowedDomains.includes(redirectUrl)) {
        throw new Error(STANDARD_ERROR_MESSAGES.UNAUTHORIZED_REDIRECT);
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim()
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      toast.success(STANDARD_ERROR_MESSAGES.ACCOUNT_CREATED);
    } catch (error: any) {
      let errorMessage = STANDARD_ERROR_MESSAGES.GENERAL_ERROR;
      
      if (error.message?.includes('already registered')) {
        errorMessage = STANDARD_ERROR_MESSAGES.EMAIL_IN_USE;
      } else if (error.message === STANDARD_ERROR_MESSAGES.WEAK_PASSWORD ||
                 error.message === STANDARD_ERROR_MESSAGES.REQUIRED_FIELDS ||
                 error.message === STANDARD_ERROR_MESSAGES.INVALID_EMAIL ||
                 error.message === STANDARD_ERROR_MESSAGES.NAME_TOO_SHORT ||
                 error.message === STANDARD_ERROR_MESSAGES.UNAUTHORIZED_REDIRECT) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(STANDARD_ERROR_MESSAGES.INVALID_EMAIL);
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast.success(STANDARD_ERROR_MESSAGES.PASSWORD_RESET_SENT);
    } catch (error: any) {
      const errorMessage = error.message === STANDARD_ERROR_MESSAGES.INVALID_EMAIL 
        ? error.message 
        : STANDARD_ERROR_MESSAGES.GENERAL_ERROR;
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      
      // Security: Strong password requirements
      if (password.length < 8) {
        throw new Error(STANDARD_ERROR_MESSAGES.WEAK_PASSWORD);
      }
      
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error(STANDARD_ERROR_MESSAGES.WEAK_PASSWORD);
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success(STANDARD_ERROR_MESSAGES.PASSWORD_UPDATED);
    } catch (error: any) {
      const errorMessage = error.message === STANDARD_ERROR_MESSAGES.WEAK_PASSWORD 
        ? error.message 
        : STANDARD_ERROR_MESSAGES.GENERAL_ERROR;
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);

      toast.success(STANDARD_ERROR_MESSAGES.LOGOUT_SUCCESS);
    } catch (error: any) {
      await logSecurityEvent('logout_error', {
        error_type: error.name || 'unknown',
        timestamp: new Date().toISOString()
      });
      toast.error(STANDARD_ERROR_MESSAGES.GENERAL_ERROR);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      loading, 
      signInWithGoogle, 
      signInWithEmail, 
      signUpWithEmail, 
      resetPassword,
      updatePassword,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
