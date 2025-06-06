
import { useAuth } from '@/contexts/AuthContext';

export const useUpdateProfile = () => {
  const { updateProfile, updatePassword, loading } = useAuth();

  return {
    updateProfile: async (name: string, username?: string, phone?: string, location?: string, bio?: string) => {
      return await updateProfile({
        name,
        username,
        phone,
        location,
        bio
      });
    },
    updatePassword,
    loading
  };
};
