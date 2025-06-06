
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';
import { LayoutMain } from '@/components/LayoutMain';
import { Outlet } from 'react-router-dom';

export const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  // Only log essential information in development
  if (process.env.NODE_ENV === 'development') {
    console.log('ProtectedLayout - Estado:', { 
      user: !!user, 
      loading, 
      userId: user?.id 
    });
  }

  if (loading) {
    if (process.env.NODE_ENV === 'development') {
      console.log('ProtectedLayout - Loading state active');
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('ProtectedLayout - User not authenticated, showing login form');
    }
    return <LoginForm />;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('ProtectedLayout - User authenticated, rendering main layout');
  }
  return (
    <LayoutMain>
      <Outlet />
    </LayoutMain>
  );
};
