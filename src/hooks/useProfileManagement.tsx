
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityUtils } from '@/utils/security';
import { useSecurityLogging } from './useSecurityLogging';
import type { Profile, User } from '@/types/auth';

export const useProfileManagement = (user: User | null) => {
  const { toast } = useToast();
  const { logSecurityEvent } = useSecurityLogging();

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Enhanced input validation and sanitization
      const sanitizedData: any = {};
      
      Object.keys(profileData).forEach(key => {
        if (profileData[key] && typeof profileData[key] === 'string') {
          const validation = SecurityUtils.validateInput(profileData[key], 'text');
          if (validation.isValid) {
            sanitizedData[key] = SecurityUtils.sanitizeInput(profileData[key]);
          } else {
            throw new Error(`Invalid ${key}: ${validation.errors.join(', ')}`);
          }
        } else if (profileData[key] !== undefined) {
          sanitizedData[key] = profileData[key];
        }
      });

      const { error } = await supabase
        .from('profiles')
        .update({
          ...sanitizedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        await logSecurityEvent('profile_update_error', { 
          user_id: user.id, 
          error: error.message 
        });
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar perfil',
          variant: 'destructive',
        });
        return false;
      }

      await logSecurityEvent('profile_updated', { 
        user_id: user.id, 
        updated_fields: Object.keys(sanitizedData) 
      });

      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso',
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      await logSecurityEvent('profile_update_exception', { 
        user_id: user?.id, 
        error: String(error) 
      });
      return false;
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const sanitizedUsername = SecurityUtils.sanitizeInput(username);
      const { data, error } = await supabase
        .rpc('check_username_availability', { check_username: sanitizedUsername });

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

      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP.');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 5MB.');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const avatars = JSON.parse(localStorage.getItem('user_avatars') || '{}');
          avatars[user.id] = result;
          localStorage.setItem('user_avatars', JSON.stringify(avatars));
          
          updateProfile({ avatar_url: `avatar_${user.id}` });
        }
      };
      reader.readAsDataURL(file);

      await logSecurityEvent('avatar_uploaded', { 
        user_id: user.id, 
        file_size: file.size, 
        file_type: file.type 
      });

      toast({
        title: 'Sucesso',
        description: 'Avatar atualizado com sucesso',
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao fazer upload do avatar',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    updateProfile,
    checkUsernameAvailability,
    uploadAvatar
  };
};
