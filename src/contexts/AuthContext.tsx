
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

  useEffect(() => {
    // Configure authentication state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer profile fetch to prevent callback deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
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
      toast.error(STANDARD_ERROR_MESSAGES.GENERAL_ERROR);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (!email || !password) {
        throw new Error(STANDARD_ERROR_MESSAGES.REQUIRED_FIELDS);
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(STANDARD_ERROR_MESSAGES.INVALID_EMAIL);
      }

      if (password.length < 8) {
        throw new Error(STANDARD_ERROR_MESSAGES.WEAK_PASSWORD);
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) throw error;

      toast.success(STANDARD_ERROR_MESSAGES.LOGIN_SUCCESS);
    } catch (error: any) {
      let errorMessage = STANDARD_ERROR_MESSAGES.GENERAL_ERROR;
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = STANDARD_ERROR_MESSAGES.INVALID_CREDENTIALS;
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = STANDARD_ERROR_MESSAGES.EMAIL_NOT_CONFIRMED;
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = STANDARD_ERROR_MESSAGES.RATE_LIMITED;
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
      
      if (!email || !password || !name) {
        throw new Error(STANDARD_ERROR_MESSAGES.REQUIRED_FIELDS);
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(STANDARD_ERROR_MESSAGES.INVALID_EMAIL);
      }
      
      if (password.length < 8) {
        throw new Error(STANDARD_ERROR_MESSAGES.WEAK_PASSWORD);
      }
      
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error(STANDARD_ERROR_MESSAGES.WEAK_PASSWORD);
      }
      
      if (name.trim().length < 2) {
        throw new Error(STANDARD_ERROR_MESSAGES.NAME_TOO_SHORT);
      }

      const redirectUrl = window.location.origin;

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
                 error.message === STANDARD_ERROR_MESSAGES.NAME_TOO_SHORT) {
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
