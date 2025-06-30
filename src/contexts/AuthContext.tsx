import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityUtils } from '@/utils/security';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { useSecurityLogging } from '@/hooks/useSecurityLogging';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';
import { useProfileManagement } from '@/hooks/useProfileManagement';
import type { User, Profile, UserSettings, AuthContextType } from '@/types/auth';

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
  const { validateSignIn, validateSignUp, validatePasswordReset } = useAuthValidation();
  const { logSecurityEvent, getClientIP } = useSecurityLogging();
  const { updateProfile, checkUsernameAvailability, uploadAvatar } = useProfileManagement(user);
  
  const signOut = async () => {
    try {
      if (user) {
        await logSecurityEvent('logout', {
          user_id: user.id,
          timestamp: new Date().toISOString(),
        }, user.id);
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const { isLocked, handleFailedAttempt, resetFailedAttempts } = useSessionSecurity(
    user,
    signOut
  );

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        if (event === 'SIGNED_IN' && session) {
          await handleSignIn(session);
          resetFailedAttempts();
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        await logSecurityEvent('session_check_error', { error: error.message });
        setLoading(false);
        return;
      }

      if (session) {
        const isValidSession = await validateSessionIntegrity(session);
        if (isValidSession) {
          await handleSignIn(session);
        } else {
          await signOut();
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
      await logSecurityEvent('session_check_failed', { error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const validateSessionIntegrity = async (session: any): Promise<boolean> => {
    try {
      if (session.expires_at && session.expires_at * 1000 < Date.now()) {
        return false;
      }

      const { data: userCheck } = await supabase.auth.getUser();
      return !!userCheck.user && userCheck.user.id === session.user.id;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  };

  const handleSignIn = async (session: any) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        await logSecurityEvent('profile_fetch_error', { 
          user_id: session.user.id, 
          error: profileError.message 
        });
      }

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
        email: SecurityUtils.sanitizeInput(session.user.email || ''),
        name: SecurityUtils.sanitizeInput(profileData?.name || session.user.user_metadata?.name || ''),
        avatar_url: SecurityUtils.sanitizeInput(profileData?.avatar_url || session.user.user_metadata?.avatar_url || ''),
      };

      // Safely access properties that may not exist in the database type
      const userProfile: Profile | null = profileData ? {
        id: profileData.id,
        name: SecurityUtils.sanitizeInput(profileData.name || ''),
        username: (profileData as any).username ? SecurityUtils.sanitizeInput((profileData as any).username) : undefined,
        email: SecurityUtils.sanitizeInput(session.user.email || ''),
        avatar_url: profileData.avatar_url ? SecurityUtils.sanitizeInput(profileData.avatar_url) : undefined,
        phone: (profileData as any).phone ? SecurityUtils.sanitizeInput((profileData as any).phone) : undefined,
        location: (profileData as any).location ? SecurityUtils.sanitizeInput((profileData as any).location) : undefined,
        bio: (profileData as any).bio ? SecurityUtils.sanitizeInput((profileData as any).bio) : undefined,
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

      await logSecurityEvent('successful_login', {
        user_id: userData.id,
        email: userData.email,
        timestamp: new Date().toISOString(),
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
      });

    } catch (error) {
      console.error('Error handling sign in:', error);
      await logSecurityEvent('signin_error', { error: String(error) });
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setProfile(null);
    setSettings(null);
    resetFailedAttempts();
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isLocked) {
        return { 
          success: false, 
          error: 'Conta temporariamente bloqueada. Tente novamente mais tarde.' 
        };
      }

      const validation = validateSignIn(email, password);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const rateLimitKey = `login_${validation.sanitizedEmail}`;
      const rateLimit = SecurityUtils.rateLimit.check(rateLimitKey);
      
      if (!rateLimit.allowed) {
        const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString();
        await logSecurityEvent('rate_limit_exceeded', { 
          email: validation.sanitizedEmail, 
          reset_time: resetTime 
        });
        return { 
          success: false, 
          error: `Muitas tentativas de login. Tente novamente às ${resetTime}` 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validation.sanitizedEmail,
        password: password,
      });

      if (error) {
        await handleFailedAttempt(validation.sanitizedEmail);
        
        await logSecurityEvent('failed_login', {
          email: validation.sanitizedEmail,
          error: error.message,
          timestamp: new Date().toISOString(),
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent,
        });

        return { success: false, error: 'Email ou senha incorretos' };
      }

      SecurityUtils.rateLimit.reset(rateLimitKey);
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      await logSecurityEvent('signin_exception', { error: String(error) });
      return { success: false, error: 'Erro interno. Tente novamente.' };
    }
  };

  const signUp = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const validation = validateSignUp(email, password, name);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const rateLimitKey = `signup_${validation.sanitizedEmail}`;
      const rateLimit = SecurityUtils.rateLimit.check(rateLimitKey);
      
      if (!rateLimit.allowed) {
        const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString();
        return { 
          success: false, 
          error: `Muitas tentativas de cadastro. Tente novamente às ${resetTime}` 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: validation.sanitizedEmail,
        password: password,
        options: {
          data: {
            name: validation.sanitizedName,
          },
        },
      });

      if (error) {
        await logSecurityEvent('signup_failed', {
          email: validation.sanitizedEmail,
          error: error.message,
        });
        return { success: false, error: error.message };
      }

      SecurityUtils.rateLimit.reset(rateLimitKey);
      await logSecurityEvent('signup_success', { email: validation.sanitizedEmail });
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Erro interno. Tente novamente.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const validation = validatePasswordReset(email);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const rateLimitKey = `reset_${validation.sanitizedEmail}`;
      const rateLimit = SecurityUtils.rateLimit.check(rateLimitKey);
      
      if (!rateLimit.allowed) {
        const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString();
        return { 
          success: false, 
          error: `Muitas tentativas de reset. Tente novamente às ${resetTime}` 
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(validation.sanitizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      await logSecurityEvent('password_reset_requested', {
        email: validation.sanitizedEmail,
        timestamp: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Erro interno. Tente novamente.' };
    }
  };

  const updatePassword = async (newPassword: string): Promise<void> => {
    try {
      const passwordValidation = SecurityUtils.validateInput(newPassword, 'password');
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      await logSecurityEvent('password_updated', { user_id: user?.id });

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
      
      await logSecurityEvent('settings_updated', { 
        user_id: user?.id, 
        updated_settings: Object.keys(newSettings) 
      });
      
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
