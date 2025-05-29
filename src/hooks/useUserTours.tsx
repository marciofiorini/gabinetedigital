
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserTours = () => {
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [showTour, setShowTour] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadTours = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('user_tours')
        .select('tour_name')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (data) {
        const completed = data.map(t => t.tour_name);
        setCompletedTours(completed);
        
        // Show welcome tour if not completed
        if (!completed.includes('welcome')) {
          setShowTour(true);
        }
      } else {
        // First time user
        setShowTour(true);
      }
    };

    loadTours();
  }, [user]);

  const completeTour = async (tourName: string) => {
    if (!user) return;

    await supabase
      .from('user_tours')
      .upsert({
        user_id: user.id,
        tour_name: tourName,
        completed: true,
        completed_at: new Date().toISOString()
      });

    setCompletedTours(prev => [...prev, tourName]);
    setShowTour(false);
  };

  const startTour = (tourName: string) => {
    setShowTour(true);
  };

  return { completedTours, showTour, completeTour, startTour, setShowTour };
};
