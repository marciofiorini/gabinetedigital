
import { useAuth } from '@/contexts/AuthContext';

export const useUpdateProfile = () => {
  const { updateProfile, updatePassword, loading } = useAuth();

  return {
    updateProfile: async (
      name: string, 
      username?: string, 
      phone?: string, 
      location?: string, 
      bio?: string
    ) => {
      console.log('useUpdateProfile called with:', { name, username, phone, location, bio });
      
      const profileData: any = {};
      
      if (name && name.trim()) profileData.name = name.trim();
      if (username && username.trim()) profileData.username = username.trim();
      if (phone && phone.trim()) profileData.phone = phone.trim();
      if (location && location.trim()) profileData.location = location.trim();
      if (bio && bio.trim()) profileData.bio = bio.trim();
      
      console.log('Processed profile data:', profileData);
      
      return await updateProfile(profileData);
    },
    updatePassword,
    loading
  };
};
