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

      if (error) throw error;
      setProfile(data);
      console.log('AuthProvider: Perfil carregado:', data);
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

      if (error) throw error;
      setSettings(data);
      console.log('AuthProvider: Configurações carregadas:', data);
    } catch (error) {
      console.error('AuthProvider: Erro ao buscar configurações:', error);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: useEffect iniciado');
    
    const getSession = async () => {
      try {
        console.log('AuthProvider: Verificando sessão existente');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: Sessão obtida:', session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
          await fetchSettings(session.user.id);
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
        console.log('AuthProvider: Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
          await fetchSettings(session.user.id);
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      toast.success('Conta criada com sucesso! Verifique seu email.');
      return { error: null };
    } catch (error: any) {
      console.error('AuthProvider: Erro ao criar conta:', error);
      toast.error(error.message || 'Erro ao criar conta');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Tentando fazer login para:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log('AuthProvider: Login realizado com sucesso');
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
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile(user.id);
      toast.success('Perfil atualizado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
      return false;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Senha atualizada com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error('Erro ao atualizar senha');
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
      toast.success('Configurações atualizadas com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error('Erro ao atualizar configurações');
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      toast.success('Email de recuperação enviado!');
      return { error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error('Erro ao enviar email de recuperação');
      return { error };
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_username_availability', {
        check_username: username
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
      // For demo purposes, we'll store the avatar in local storage
      // In production, you would upload to Supabase storage
      const reader = new FileReader();
      reader.onload = () => {
        const avatars = JSON.parse(localStorage.getItem('user_avatars') || '{}');
        avatars[user.id] = reader.result;
        localStorage.setItem('user_avatars', JSON.stringify(avatars));
      };
      reader.readAsDataURL(file);

      await updateProfile({ avatar_url: `local_${user.id}` });
      toast.success('Avatar atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Erro ao fazer upload do avatar');
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
