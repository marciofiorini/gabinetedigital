
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UserSettings {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  timezone: string;
  dark_mode: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  keyboard_shortcuts_enabled: boolean;
  tour_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  settings: UserSettings | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signInWithUsername: (username: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateSettings: (data: Partial<UserSettings>) => Promise<boolean>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserData(session.user.id);
      } else {
        setProfile(null);
        setSettings(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error loading settings:', settingsError);
      } else if (settingsData) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Erro no login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    return signIn(email, password);
  };

  const signInWithUsername = async (username: string, password: string): Promise<boolean> => {
    try {
      // First, find the email associated with the username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        toast.error('Usuário não encontrado');
        return false;
      }

      return signIn(profileData.email, password);
    } catch (error) {
      console.error('Sign in with username error:', error);
      toast.error('Erro no login com username');
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Conta criada com sucesso! Verifique seu email.');
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Erro ao criar conta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string): Promise<boolean> => {
    return signUp(email, password, name);
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Erro no login com Google');
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logout realizado com sucesso!');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Erro no logout');
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Email de recuperação enviado!');
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Erro ao enviar email de recuperação');
      return false;
    }
  };

  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      // Reload profile
      await loadUserData(user.id);
      toast.success('Perfil atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Erro ao atualizar perfil');
      return false;
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Senha atualizada com sucesso!');
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('Erro ao atualizar senha');
      return false;
    }
  };

  const updateSettings = async (data: Partial<UserSettings>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(data)
        .eq('user_id', user.id);
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      // Reload settings
      await loadUserData(user.id);
      toast.success('Configurações atualizadas!');
      return true;
    } catch (error) {
      console.error('Update settings error:', error);
      toast.error('Erro ao atualizar configurações');
      return false;
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('check_username_availability', { check_username: username });
      
      if (error) {
        console.error('Username check error:', error);
        return false;
      }
      
      return data;
    } catch (error) {
      console.error('Username availability error:', error);
      return false;
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // For now, we'll store avatars locally since we don't have storage buckets
      const reader = new FileReader();
      reader.onload = () => {
        const avatars = JSON.parse(localStorage.getItem('user_avatars') || '{}');
        avatars[user.id] = reader.result;
        localStorage.setItem('user_avatars', JSON.stringify(avatars));
        
        // Update profile with avatar URL reference
        updateProfile({ avatar_url: `local_${user.id}` });
      };
      reader.readAsDataURL(file);
      
      toast.success('Avatar atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Upload avatar error:', error);
      toast.error('Erro ao fazer upload do avatar');
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    settings,
    loading,
    signIn,
    signInWithEmail,
    signInWithUsername,
    signUp,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
    updateSettings,
    checkUsernameAvailability,
    uploadAvatar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
