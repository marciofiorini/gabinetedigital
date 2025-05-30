
import { useSubscription, UserPlan } from './useSubscription';

export { UserPlan } from './useSubscription';

export const useUserPlans = () => {
  const subscriptionData = useSubscription();
  
  return {
    userPlan: subscriptionData.subscription_tier || 'basic',
    loading: subscriptionData.loading,
    hasAccessToPlan: subscriptionData.hasAccessToPlan,
    getPlanFeatures: (plan: UserPlan) => {
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
    },
    // Mantido para compatibilidade
    setUserPlan: () => {
      console.warn('setUserPlan is deprecated. Use subscription management instead.');
    }
  };
};
