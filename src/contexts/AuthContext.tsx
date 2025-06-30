import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityUtils } from '@/utils/security';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface Profile {
  id: string;
  name: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

interface UserSettings {
  language: string;
  timezone: string;
  keyboard_shortcuts_enabled: boolean;
  theme: string;
  dark_mode: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  settings: UserSettings | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (profileData: any) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Session timeout management
  const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    // Check initial session
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        if (event === 'SIGNED_IN' && session) {
          await handleSignIn(session);
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        }
        
        setLoading(false);
      }
    );

    // Set up activity tracking
    const trackActivity = () => {
      setLastActivity(Date.now());
    };

    // Track user activity
    window.addEventListener('mousedown', trackActivity);
    window.addEventListener('keydown', trackActivity);
    window.addEventListener('scroll', trackActivity);
    window.addEventListener('touchstart', trackActivity);

    // Check session timeout periodically
    const timeoutCheck = setInterval(() => {
      if (user && Date.now() - lastActivity > SESSION_TIMEOUT) {
        toast({
          title: 'Sessão Expirada',
          description: 'Sua sessão expirou por inatividade. Faça login novamente.',
          variant: 'destructive',
        });
        signOut();
      }
    }, 60000); // Check every minute

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('mousedown', trackActivity);
      window.removeEventListener('keydown', trackActivity);
      window.removeEventListener('scroll', trackActivity);
      window.removeEventListener('touchstart', trackActivity);
      clearInterval(timeoutCheck);
    };
  }, [user, lastActivity]);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }

      if (session) {
        await handleSignIn(session);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (session: any) => {
    try {
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Get user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching settings:', settingsError);
      }

      const userData: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: profileData?.name || session.user.user_metadata?.name || '',
        avatar_url: profileData?.avatar_url || session.user.user_metadata?.avatar_url || '',
      };

      const userProfile: Profile | null = profileData ? {
        id: profileData.id,
        name: profileData.name || '',
        username: profileData.username,
        email: session.user.email,
        avatar_url: profileData.avatar_url,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
      } : null;

      const userSettings: UserSettings | null = settingsData ? {
        language: settingsData.language || 'pt-BR',
        timezone: settingsData.timezone || 'America/Sao_Paulo',
        keyboard_shortcuts_enabled: settingsData.keyboard_shortcuts_enabled ?? true,
        theme: settingsData.theme || 'light',
        dark_mode: settingsData.dark_mode ?? false,
        email_notifications: settingsData.email_notifications ?? true,
        push_notifications: settingsData.push_notifications ?? true,
      } : null;

      setUser(userData);
      setProfile(userProfile);
      setSettings(userSettings);
      setLastActivity(Date.now());

      // Log successful login
      await logSecurityEvent('login', {
        user_id: userData.id,
        email: userData.email,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Error handling sign in:', error);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setProfile(null);
    setSettings(null);
    setLastActivity(0);
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar perfil',
          variant: 'destructive',
        });
        return false;
      }

      // Refresh profile data
      if (user) {
        const { data: session } = await supabase.auth.getSession();
        if (session.session) {
          await handleSignIn(session.session);
        }
      }

      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso',
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const updatePassword = async (newPassword: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Sucesso',
        description: 'Senha atualizada com sucesso',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar senha',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      
      toast({
        title: 'Sucesso',
        description: 'Configurações atualizadas com sucesso',
      });
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar configurações',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('check_username_availability', { check_username: username });

      if (error) {
        console.error('Error checking username:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  const uploadAvatar = async (file: File): Promise<void> => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      // In a real implementation, you would upload to Supabase Storage
      // For now, we'll simulate the upload and store locally
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // Store in localStorage temporarily
          const avatars = JSON.parse(localStorage.getItem('user_avatars') || '{}');
          avatars[user.id] = result;
          localStorage.setItem('user_avatars', JSON.stringify(avatars));
          
          // Update profile with avatar reference
          updateProfile({ avatar_url: `avatar_${user.id}` });
        }
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Sucesso',
        description: 'Avatar atualizado com sucesso',
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload do avatar',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Sanitize and validate inputs
      const sanitizedEmail = SecurityUtils.sanitizeInput(email);
      const emailValidation = SecurityUtils.validateInput(sanitizedEmail, 'email');
      const passwordValidation = SecurityUtils.validateInput(password, 'password');

      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.errors.join(', ') };
      }

      // Check rate limiting
      const rateLimitKey = `login_${sanitizedEmail}`;
      const rateLimit = SecurityUtils.rateLimit.check(rateLimitKey);
      
      if (!rateLimit.allowed) {
        const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString();
        return { 
          success: false, 
          error: `Muitas tentativas de login. Tente novamente às ${resetTime}` 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });

      if (error) {
        // Log failed login attempt
        await logSecurityEvent('failed_login', {
          email: sanitizedEmail,
          error: error.message,
          timestamp: new Date().toISOString(),
        });

        return { success: false, error: 'Email ou senha incorretos' };
      }

      // Reset rate limit on successful login
      SecurityUtils.rateLimit.reset(rateLimitKey);

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Erro interno. Tente novamente.' };
    }
  };

  const signUp = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Sanitize and validate inputs
      const sanitizedEmail = SecurityUtils.sanitizeInput(email);
      const sanitizedName = name ? SecurityUtils.sanitizeInput(name) : '';
      
      const emailValidation = SecurityUtils.validateInput(sanitizedEmail, 'email');
      const passwordValidation = SecurityUtils.validateInput(password, 'password');

      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.errors.join(', ') };
      }

      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors.join(', ') };
      }

      // Check rate limiting
      const rateLimitKey = `signup_${sanitizedEmail}`;
      const rateLimit = SecurityUtils.rateLimit.check(rateLimitKey);
      
      if (!rateLimit.allowed) {
        const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString();
        return { 
          success: false, 
          error: `Muitas tentativas de cadastro. Tente novamente às ${resetTime}` 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          data: {
            name: sanitizedName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Reset rate limit on successful signup
      SecurityUtils.rateLimit.reset(rateLimitKey);

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Erro interno. Tente novamente.' };
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await logSecurityEvent('logout', {
          user_id: user.id,
          timestamp: new Date().toISOString(),
        });
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const sanitizedEmail = SecurityUtils.sanitizeInput(email);
      const emailValidation = SecurityUtils.validateInput(sanitizedEmail, 'email');

      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.errors.join(', ') };
      }

      // Check rate limiting for password reset
      const rateLimitKey = `reset_${sanitizedEmail}`;
      const rateLimit = SecurityUtils.rateLimit.check(rateLimitKey);
      
      if (!rateLimit.allowed) {
        const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString();
        return { 
          success: false, 
          error: `Muitas tentativas de reset. Tente novamente às ${resetTime}` 
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Log password reset attempt
      await logSecurityEvent('password_reset_requested', {
        email: sanitizedEmail,
        timestamp: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Erro interno. Tente novamente.' };
    }
  };

  const logSecurityEvent = async (action: string, details: any) => {
    try {
      await supabase.from('access_logs').insert({
        user_id: details.user_id || null,
        action,
        module: 'auth',
        entity_type: 'security_event',
        changes: details,
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      // Silently fail - logging shouldn't break the flow
      console.warn('Failed to log security event:', error);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    settings,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
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
