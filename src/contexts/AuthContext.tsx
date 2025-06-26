import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

console.log('AuthContext.tsx: Módulo carregado');

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  username?: string;
  phone?: string;
  location?: string;
  bio?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserSettings {
  id?: string;
  user_id?: string;
  language?: string;
  timezone?: string;
  keyboard_shortcuts_enabled?: boolean;
  theme?: string;
  dark_mode?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  tour_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  settings: UserSettings | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};

// Rate limiting for authentication attempts
let failedAttempts: Map<string, number> = new Map();
let lastAttemptTime: Map<string, number> = new Map();

const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const attempts = failedAttempts.get(email) || 0;
  const lastTime = lastAttemptTime.get(email) || 0;
  
  // Reset counter if more than 15 minutes have passed
  if (now - lastTime > 15 * 60 * 1000) {
    failedAttempts.set(email, 0);
    return false;
  }
  
  return attempts >= 5;
};

const recordFailedAttempt = (email: string) => {
  const current = failedAttempts.get(email) || 0;
  failedAttempts.set(email, current + 1);
  lastAttemptTime.set(email, Date.now());
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('AuthProvider: Componente iniciado');
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('AuthProvider: Buscando perfil para usuário:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('AuthProvider: Erro ao buscar perfil:', error);
        return;
      }
      
      if (data) {
        setProfile(data);
        console.log('AuthProvider: Perfil carregado:', data);
      }
    } catch (error) {
      console.error('AuthProvider: Erro ao buscar perfil:', error);
    }
  };

  const fetchSettings = async (userId: string) => {
    try {
      console.log('AuthProvider: Buscando configurações para usuário:', userId);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('AuthProvider: Erro ao buscar configurações:', error);
        return;
      }
      
      if (data) {
        setSettings(data);
        console.log('AuthProvider: Configurações carregadas:', data);
      }
    } catch (error) {
      console.error('AuthProvider: Erro ao buscar configurações:', error);
    }
  };

  const logSecurityEvent = async (action: string, details?: any) => {
    try {
      await supabase.from('access_logs').insert({
        user_id: user?.id || null,
        changed_by: user?.id || null,
        action,
        module: 'authentication',
        changes: details ? JSON.stringify(details) : null,
        ip_address: null, // Would need additional setup to get real IP
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: useEffect iniciado');
    
    const getSession = async () => {
      try {
        console.log('AuthProvider: Verificando sessão existente');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: Sessão obtida:', !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
          await fetchSettings(session.user.id);
          await logSecurityEvent('session_validated');
        }
        
        setLoading(false);
        console.log('AuthProvider: Inicialização concluída');
      } catch (error) {
        console.error('AuthProvider: Erro na inicialização:', error);
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchSettings(session.user.id);
          }, 0);
          
          await logSecurityEvent('auth_state_change', { event });
        } else {
          setProfile(null);
          setSettings(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      console.log('AuthProvider: Tentando criar conta para:', email);
      
      if (!validateEmail(email)) {
        throw new Error('Email inválido');
      }
      
      if (!validatePassword(password)) {
        throw new Error('Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número');
      }

      const sanitizedEmail = sanitizeInput(email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: userData,
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) throw error;
      
      await logSecurityEvent('sign_up_attempt', { email: sanitizedEmail });
      toast.success('Conta criada com sucesso! Verifique seu email.');
      return { error: null };
    } catch (error: any) {
      console.error('AuthProvider: Erro ao criar conta:', error);
      await logSecurityEvent('sign_up_failed', { email, error: error.message });
      toast.error(error.message || 'Erro ao criar conta');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Tentando fazer login para:', email);
      
      if (!validateEmail(email)) {
        throw new Error('Email inválido');
      }

      const sanitizedEmail = sanitizeInput(email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      
      if (error) {
        await logSecurityEvent('login_failed', { email: sanitizedEmail, error: error.message });
        throw error;
      }
      
      console.log('AuthProvider: Login realizado com sucesso');
      await logSecurityEvent('login_success', { email: sanitizedEmail });
      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('AuthProvider: Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthProvider: Fazendo logout');
      await logSecurityEvent('logout');
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('AuthProvider: Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return false;

    try {
      const sanitizedUpdates = {
        ...updates,
        name: updates.name ? sanitizeInput(updates.name) : updates.name,
        bio: updates.bio ? sanitizeInput(updates.bio) : updates.bio,
        location: updates.location ? sanitizeInput(updates.location) : updates.location,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile(user.id);
      await logSecurityEvent('profile_updated', { updates: Object.keys(updates) });
      toast.success('Perfil atualizado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      await logSecurityEvent('profile_update_failed', { error: error.message });
      toast.error('Erro ao atualizar perfil');
      return false;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      if (!validatePassword(newPassword)) {
        throw new Error('Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      await logSecurityEvent('password_updated');
      toast.success('Senha atualizada com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error updating password:', error);
      await logSecurityEvent('password_update_failed', { error: error.message });
      toast.error(error.message || 'Erro ao atualizar senha');
      return false;
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchSettings(user.id);
      await logSecurityEvent('settings_updated', { updates: Object.keys(updates) });
      toast.success('Configurações atualizadas com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error updating settings:', error);
      await logSecurityEvent('settings_update_failed', { error: error.message });
      toast.error('Erro ao atualizar configurações');
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!validateEmail(email)) {
        throw new Error('Email inválido');
      }

      const sanitizedEmail = sanitizeInput(email);
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: redirectUrl
      });
      
      if (error) throw error;
      
      await logSecurityEvent('password_reset_requested', { email: sanitizedEmail });
      toast.success('Email de recuperação enviado!');
      return { error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      await logSecurityEvent('password_reset_failed', { email, error: error.message });
      toast.error(error.message || 'Erro ao enviar email de recuperação');
      return { error };
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const sanitizedUsername = sanitizeInput(username);
      const { data, error } = await supabase.rpc('check_username_availability', {
        check_username: sanitizedUsername
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    if (!user) return false;

    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Formato de arquivo não suportado. Use JPEG, PNG ou WebP.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo 5MB.');
      }

      const reader = new FileReader();
      reader.onload = () => {
        const avatars = JSON.parse(localStorage.getItem('user_avatars') || '{}');
        avatars[user.id] = reader.result;
        localStorage.setItem('user_avatars', JSON.stringify(avatars));
      };
      reader.readAsDataURL(file);

      await updateProfile({ avatar_url: `local_${user.id}` });
      await logSecurityEvent('avatar_uploaded', { fileSize: file.size, fileType: file.type });
      toast.success('Avatar atualizado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      await logSecurityEvent('avatar_upload_failed', { error: error.message });
      toast.error(error.message || 'Erro ao fazer upload do avatar');
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    settings,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePassword,
    updateSettings,
    resetPassword,
    checkUsernameAvailability,
    uploadAvatar
  };

  console.log('AuthProvider: Renderizando provider com valor:', { user: !!user, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
