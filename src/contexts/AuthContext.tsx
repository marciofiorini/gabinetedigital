
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
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
  created_at?: string;
}

interface UserSettings {
  theme: string;
  language: string;
  notifications: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  dark_mode?: boolean;
  timezone?: string;
  keyboard_shortcuts_enabled?: boolean;
  tour_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  settings: UserSettings | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithUsername: (username: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, username?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setProfile(profileData);

          // Fetch settings
          const { data: settingsData } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (settingsData) {
            setSettings({
              theme: settingsData.theme || 'light',
              language: settingsData.language || 'pt-BR',
              notifications: settingsData.email_notifications ?? true,
              email_notifications: settingsData.email_notifications ?? true,
              push_notifications: settingsData.push_notifications ?? true,
              dark_mode: settingsData.dark_mode ?? false,
              timezone: settingsData.timezone || 'America/Sao_Paulo',
              keyboard_shortcuts_enabled: settingsData.keyboard_shortcuts_enabled ?? true,
              tour_completed: settingsData.tour_completed ?? false
            });
          } else {
            setSettings({
              theme: 'light',
              language: 'pt-BR',
              notifications: true,
              email_notifications: true,
              push_notifications: true,
              dark_mode: false,
              timezone: 'America/Sao_Paulo',
              keyboard_shortcuts_enabled: true,
              tour_completed: false
            });
          }
        } else {
          setProfile(null);
          setSettings(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithUsername = async (username: string, password: string) => {
    setLoading(true);
    try {
      // First, get the email associated with the username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        toast.error('Nome de usuário não encontrado');
        throw new Error('Username not found');
      }

      // Then sign in with the email
      await signInWithEmail(profileData.email, password);
    } catch (error) {
      console.error('Error signing in with username:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, username?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Conta criada com sucesso! Verifique seu email.');
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Email de redefinição enviado!');
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) {
        toast.error('Erro ao atualizar perfil');
        throw error;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      toast.success('Perfil atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      // Map UserSettings to database fields
      const dbSettings: Record<string, any> = {};
      
      if (newSettings.theme !== undefined) dbSettings.theme = newSettings.theme;
      if (newSettings.language !== undefined) dbSettings.language = newSettings.language;
      if (newSettings.notifications !== undefined) dbSettings.email_notifications = newSettings.notifications;
      if (newSettings.email_notifications !== undefined) dbSettings.email_notifications = newSettings.email_notifications;
      if (newSettings.push_notifications !== undefined) dbSettings.push_notifications = newSettings.push_notifications;
      if (newSettings.dark_mode !== undefined) dbSettings.dark_mode = newSettings.dark_mode;
      if (newSettings.timezone !== undefined) dbSettings.timezone = newSettings.timezone;
      if (newSettings.keyboard_shortcuts_enabled !== undefined) dbSettings.keyboard_shortcuts_enabled = newSettings.keyboard_shortcuts_enabled;
      if (newSettings.tour_completed !== undefined) dbSettings.tour_completed = newSettings.tour_completed;

      const { error } = await supabase
        .from('user_settings')
        .update(dbSettings)
        .eq('user_id', user?.id);

      if (error) {
        toast.error('Erro ao atualizar configurações');
        throw error;
      }

      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      toast.success('Configurações atualizadas!');
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    try {
      const { data } = await supabase.rpc('check_username_availability', {
        check_username: username,
      });

      return data;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // For now, we'll just store the avatar URL in local storage
      // In a real implementation, you'd upload to Supabase Storage
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        
        // Store in localStorage for demo purposes
        const avatars = JSON.parse(localStorage.getItem('user_avatars') || '{}');
        avatars[user.id] = dataUrl;
        localStorage.setItem('user_avatars', JSON.stringify(avatars));

        // Update profile
        await updateProfile({ avatar_url: fileName });
      };
      reader.readAsDataURL(file);

      toast.success('Avatar atualizado com sucesso!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Erro ao fazer upload do avatar');
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    settings,
    loading,
    signOut,
    signInWithEmail,
    signInWithUsername,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    updateProfile,
    updateSettings,
    checkUsernameAvailability,
    uploadAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
