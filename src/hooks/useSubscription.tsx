
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://xhuazohviheoxibwkozf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodWF6b2h2aWhlb3hpYndrb3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Njc0MDMsImV4cCI6MjA2NDA0MzQwM30.6xj4N4Aed6agKEpUkjP6xDyQXNqxy4ws6iqrp8VbnHc"
);

export type UserPlan = 'basic' | 'premium' | 'enterprise';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: UserPlan | null;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const checkSubscription = async () => {
    if (!user) {
      setSubscriptionData({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: functionError } = await supabase.functions.invoke('check-subscription');
      
      if (functionError) {
        throw functionError;
      }
      
      setSubscriptionData(data);
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Set default values on error
      setSubscriptionData({
        subscribed: false,
        subscription_tier: 'basic',
        subscription_end: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (priceId: string, planType: UserPlan) => {
    if (!user) {
      throw new Error('User must be logged in to subscribe');
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, planType }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Error creating checkout:', err);
      throw err;
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      throw new Error('User must be logged in to manage subscription');
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Error opening customer portal:', err);
      throw err;
    }
  };

  const hasAccessToPlan = (requiredPlan: UserPlan): boolean => {
    if (!subscriptionData.subscribed) return requiredPlan === 'basic';
    
    const planLevels: Record<UserPlan, number> = {
      basic: 1,
      premium: 2,
      enterprise: 3
    };
    
    const userLevel = planLevels[subscriptionData.subscription_tier || 'basic'];
    const requiredLevel = planLevels[requiredPlan];
    
    return userLevel >= requiredLevel;
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  return {
    ...subscriptionData,
    loading,
    error,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    hasAccessToPlan,
  };
};
