
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de usuário logado
    // Aqui seria integrado com Supabase Auth
    const checkUser = async () => {
      // Simular delay de carregamento
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    checkUser();
  }, []);

  const signInWithGoogle = async () => {
    console.log('Iniciando login com Google...');
    // Aqui seria implementado o login real com Supabase
    // const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    
    // Simulando usuário logado
    setUser({
      id: '1',
      email: 'usuario@exemplo.com',
      name: 'Usuário Exemplo',
      avatar: 'https://via.placeholder.com/40'
    });
  };

  const signOut = async () => {
    console.log('Fazendo logout...');
    // Aqui seria implementado o logout real com Supabase
    // await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
