
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useUserRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserRoles = async () => {
    if (!user) {
      console.log('useUserRoles - No user found');
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('useUserRoles - Fetching roles for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('useUserRoles - Error fetching roles:', error);
        throw error;
      }

      console.log('useUserRoles - Raw data from database:', data);
      const userRoles = data?.map(item => item.role as UserRole) || [];
      console.log('useUserRoles - Processed roles:', userRoles);
      
      setRoles(userRoles);
    } catch (error) {
      console.error('Erro ao buscar papéis do usuário:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    const result = roles.includes(role);
    console.log(`useUserRoles - hasRole(${role}):`, result, 'roles:', roles);
    return result;
  };

  const isAdmin = (): boolean => {
    const result = hasRole('admin');
    console.log('useUserRoles - isAdmin():', result);
    return result;
  };
  
  const isModerator = (): boolean => hasRole('moderator');
  const isUser = (): boolean => hasRole('user');

  useEffect(() => {
    console.log('useUserRoles - useEffect triggered, user:', user?.id);
    fetchUserRoles();
  }, [user]);

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isModerator,
    isUser,
    refetch: fetchUserRoles
  };
};
