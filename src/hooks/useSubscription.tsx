
import { useState, useEffect } from 'react';

// Hook simplificado sem instância extra do Supabase
export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      // Implementação futura - por agora retorna dados mock
      setSubscription(null);
    } catch (error) {
      console.error('Erro ao verificar subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return {
    subscription,
    loading,
    checkSubscription
  };
};
