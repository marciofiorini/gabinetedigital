
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';
import { LayoutMain } from '@/components/LayoutMain';
import { Outlet } from 'react-router-dom';

export const ProtectedLayout = () => {
  console.log('ProtectedLayout: Componente renderizado');
  
  const { user, loading } = useAuth();

  console.log('ProtectedLayout: Estado atual - user:', !!user, 'loading:', loading);

  if (loading) {
    console.log('ProtectedLayout: Exibindo tela de carregamento');
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
    console.log('ProtectedLayout: Usuário não autenticado, exibindo LoginForm');
    return <LoginForm />;
  }

  console.log('ProtectedLayout: Usuário autenticado, exibindo LayoutMain');
  return (
    <LayoutMain>
      <Outlet />
    </LayoutMain>
  );
};
