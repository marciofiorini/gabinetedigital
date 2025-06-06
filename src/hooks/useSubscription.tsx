
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type UserPlan = 'basic' | 'premium' | 'enterprise';

interface SubscriptionData {
  subscription: any;
  loading: boolean;
  subscribed: boolean;
  subscription_tier: UserPlan;
  checkSubscription: () => Promise<void>;
  createCheckout: (priceId: string, planType: UserPlan) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  hasAccessToPlan: (plan: UserPlan) => boolean;
}

export const useSubscription = (): SubscriptionData => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<UserPlan>('basic');

  const checkSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Por enquanto retorna dados mock - implementação futura
      setSubscription(null);
      setSubscribed(false);
      setSubscriptionTier('basic');
    } catch (error) {
      console.error('Erro ao verificar subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (priceId: string, planType: UserPlan) => {
    if (!user) {
      toast.error('Você precisa estar logado para assinar um plano');
      return;
    }

    try {
      // Implementação futura do Stripe
      toast.info('Funcionalidade de checkout em desenvolvimento');
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast.error('Erro ao processar pagamento');
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para acessar o portal');
      return;
    }

    try {
      // Implementação futura do portal do cliente
      toast.info('Portal do cliente em desenvolvimento');
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      toast.error('Erro ao abrir portal do cliente');
    }
  };

  const hasAccessToPlan = (plan: UserPlan): boolean => {
    const planHierarchy = { basic: 1, premium: 2, enterprise: 3 };
    return planHierarchy[subscriptionTier] >= planHierarchy[plan];
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  return {
    subscription,
    loading,
    subscribed,
    subscription_tier: subscriptionTier,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    hasAccessToPlan
  };
};
