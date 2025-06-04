import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeNotificationSystem } from './useRealTimeNotificationSystem';

export const useRealTimeData = () => {
  const [realTimeData, setRealTimeData] = useState({
    leads: [],
    contatos: [],
    demandas: [],
    eventos: []
  });

  useEffect(() => {
    // Set up real-time subscriptions for different tables
    const leadsChannel = supabase
      .channel('leads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, 
        payload => {
          console.log('Leads change:', payload);
          // Handle leads updates
        })
      .subscribe();

    const contatosChannel = supabase
      .channel('contatos_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contatos' }, 
        payload => {
          console.log('Contatos change:', payload);
          // Handle contatos updates
        })
      .subscribe();

    const demandasChannel = supabase
      .channel('demandas_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'demandas' }, 
        payload => {
          console.log('Demandas change:', payload);
          // Handle demandas updates
        })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(contatosChannel);
      supabase.removeChannel(demandasChannel);
    };
  }, []);

  return {
    realTimeData
  };
};

// Export the notification system hook
export { useRealTimeNotificationSystem };
