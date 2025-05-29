
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type UserPlan = 'basic' | 'premium' | 'enterprise';

export const useUserPlans = () => {
  const [userPlan, setUserPlan] = useState<UserPlan>('basic');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulação - em produção, isso viria de uma API
    const fetchUserPlan = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Por enquanto, retornando premium como padrão
        setUserPlan('premium');
      } catch (error) {
        console.error('Erro ao buscar plano do usuário:', error);
        setUserPlan('basic');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [user]);

  const hasAccessToPlan = (requiredPlan: UserPlan): boolean => {
    const planLevels: Record<UserPlan, number> = {
      basic: 1,
      premium: 2,
      enterprise: 3
    };
    
    const userLevel = planLevels[userPlan];
    const requiredLevel = planLevels[requiredPlan];
    
    return userLevel >= requiredLevel;
  };

  const getPlanFeatures = (plan: UserPlan) => {
    const features = {
      basic: [
        'Dashboard básico',
        'Agenda pessoal',
        'Contatos limitados',
        'E-mail básico'
      ],
      premium: [
        'Todos os recursos básicos',
        'CRM completo',
        'WhatsApp e Instagram',
        'Analytics avançado',
        'Gestão de líderes'
      ],
      enterprise: [
        'Todos os recursos premium',
        'Múltiplos usuários',
        'Portal do cidadão',
        'Projetos de lei',
        'Pesquisas avançadas',
        'Suporte prioritário'
      ]
    };
    
    return features[plan] || [];
  };

  return {
    userPlan,
    loading,
    hasAccessToPlan,
    getPlanFeatures,
    setUserPlan // Para testes/admin
  };
};
