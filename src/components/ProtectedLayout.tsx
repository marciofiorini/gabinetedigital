
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';
import { LayoutMain } from '@/components/LayoutMain';
import { SecurityAlerts } from '@/components/security/SecurityAlerts';
import { SessionTimeout } from '@/components/security/SessionTimeout';
import { Outlet } from 'react-router-dom';

export const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
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
    return <LoginForm />;
  }

  return (
    <LayoutMain>
      <SecurityAlerts />
      <SessionTimeout timeoutMinutes={30} warningMinutes={5} />
      <Outlet />
    </LayoutMain>
  );
};
