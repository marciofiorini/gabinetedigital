
import { useState } from 'react';
import { toast } from 'sonner';

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (name: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      toast.error('Erro ao alterar senha');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    updatePassword,
    loading
  };
};
