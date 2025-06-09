import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

interface UserSettings {
  id: string;
  user_id: string;
  language: string;
  timezone: string;
  keyboard_shortcuts_enabled: boolean;
  theme: string;
  dark_mode: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  tour_completed: boolean;
}

interface ProfileUpdateData {
  name?: string;
  username?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  settings: UserSettings | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithUsername: (username: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, username?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  updateSettings: (data: Partial<UserSettings>) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      return data as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const fetchSettings = async (userId: string) => {
    try {
      console.log('Fetching settings for user:', userId);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        return null;
      }

      console.log('Settings fetched successfully:', data);
      return data as UserSettings;
    } catch (error) {
      console.error('Error in fetchSettings:', error);
      return null;
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (!user) return;
    
    const profileData = await fetchProfile(user.id);
    const settingsData = await fetchSettings(user.id);
    
    setProfile(profileData);
    setSettings(settingsData);
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      console.log('Attempting Google sign in...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        if (error.message.includes('provider is not enabled')) {
          toast.error('Login com Google não está configurado. Entre em contato com o administrador.');
        } else {
          toast.error(error.message || 'Erro ao fazer login com Google');
        }
        throw error;
      }
      
      console.log('Google sign in initiated successfully');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('Email sign in error:', error);
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    }
  };

  const signInWithUsername = async (username: string, password: string): Promise<void> => {
    try {
      // First, find the email associated with this username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        throw new Error('Nome de usuário não encontrado');
      }

      // Then sign in with email and password
      await signInWithEmail(profileData.email, password);
    } catch (error: any) {
      console.error('Username sign in error:', error);
      toast.error(error.message || 'Erro ao fazer login com nome de usuário');
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, username?: string): Promise<void> => {
    try {
      // Check if username is available if provided
      if (username) {
        const isAvailable = await checkUsernameAvailability(username);
        if (!isAvailable) {
          throw new Error('Nome de usuário já está em uso');
        }
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            username
          }
        }
      });
      
      if (error) throw error;
      toast.success('Conta criada com sucesso! Verifique seu email.');
    } catch (error: any) {
      console.error('Email sign up error:', error);
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      toast.success('Email de recuperação enviado!');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Erro ao enviar email de recuperação');
      throw error;
    }
  };

  const updatePassword = async (password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      toast.success('Senha alterada com sucesso!');
    } catch (error: any) {
      console.error('Update password error:', error);
      toast.error(error.message || 'Erro ao alterar senha');
      throw error;
    }
  };

  const updateProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    try {
      console.log('Updating profile with data:', data);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Clean data - remove undefined values and empty strings
      const cleanData: { [key: string]: any } = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          // Para username, permitir string vazia para remover o username
          if (key === 'username') {
            cleanData[key] = value === '' ? null : value;
          } else if (value !== '') {
            cleanData[key] = value;
          }
        }
      }

      console.log('Clean data for update:', cleanData);

      if (Object.keys(cleanData).length === 0) {
        console.log('No data to update');
        return true;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...cleanData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully');
      
      // Refresh profile data
      await refreshProfile();
      toast.success('Perfil atualizado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Erro ao atualizar perfil');
      return false;
    }
  };

  const updateSettings = async (data: Partial<UserSettings>): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('user_settings')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setSettings(prev => prev ? { ...prev, ...data } : null);
      toast.success('Configurações salvas com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Update settings error:', error);
      toast.error(error.message || 'Erro ao salvar configurações');
      return false;
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      console.log('Checking username availability:', username);
      
      // Skip check if username is empty
      if (!username || username.trim() === '') {
        return true;
      }

      const trimmedUsername = username.trim();
      
      // Se o username for igual ao atual do usuário, consideramos disponível
      if (profile?.username === trimmedUsername) {
        return true;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmedUsername)
        .neq('id', user?.id || '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error('Username check error:', error);
        return false;
      }

      const isAvailable = !data || data.length === 0;
      console.log('Username availability result:', isAvailable);
      return isAvailable;
    } catch (error: any) {
      console.error('Check username error:', error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSettings(null);
      setSession(null);
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Erro ao fazer logout');
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile and settings after login
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            const settingsData = await fetchSettings(session.user.id);
            
            setProfile(profileData);
            setSettings(settingsData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setSettings(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        
        // Fetch profile and settings for existing session
        fetchProfile(session.user.id).then(setProfile);
        fetchSettings(session.user.id).then(setSettings);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const contextValue: AuthContextType = {
    user, 
    profile, 
    settings,
    session, 
    loading, 
    signInWithGoogle, 
    signInWithEmail, 
    signInWithUsername,
    signUpWithEmail, 
    resetPassword,
    updatePassword,
    updateProfile,
    updateSettings,
    checkUsernameAvailability,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
