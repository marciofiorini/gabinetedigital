
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AlertaProativo {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'meta' | 'prazo' | 'oportunidade';
  severidade: 'critica' | 'alta' | 'media' | 'baixa';
  valor_atual: string;
  valor_limite?: string;
}

export const useAlertasProativos = () => {
  const [alertasAtivos, setAlertasAtivos] = useState<AlertaProativo[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(true);
      // Simulando dados de alertas
      setTimeout(() => {
        setAlertasAtivos([
          {
            id: '1',
            titulo: 'Meta de contatos mensais',
            descricao: 'Você está próximo de atingir a meta de novos contatos',
            tipo: 'meta',
            severidade: 'media',
            valor_atual: '85',
            valor_limite: '100'
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  return { alertasAtivos, loading };
};
