
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';
import { LayoutMain } from '@/components/LayoutMain';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { user, loading } = useAuth();

  console.log('ProtectedLayout: user =', !!user, 'loading =', loading);

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
    console.log('ProtectedLayout: Usuário não autenticado, mostrando LoginForm');
    return <LoginForm />;
  }

  console.log('ProtectedLayout: Usuário autenticado, mostrando conteúdo');
  return (
    <LayoutMain>
      {children}
    </LayoutMain>
  );
};
