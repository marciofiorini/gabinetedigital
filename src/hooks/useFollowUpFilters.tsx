
import { useMemo } from 'react';
import { FollowUp } from '@/types/followUp';
import { differenceInHours, isPast, isToday } from 'date-fns';

export const useFollowUpFilters = (followUps: FollowUp[], horasAntecedencia: number) => {
  const filters = useMemo(() => {
    const agora = new Date();

    const vencidos = followUps.filter(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      return isPast(dataAgendada) && followUp.status === 'pendente';
    });

    const hoje = followUps.filter(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      return isToday(dataAgendada) && followUp.status === 'pendente';
    });

    const proximosVencimentos = followUps.filter(followUp => {
      const dataAgendada = new Date(followUp.data_agendada);
      const horasRestantes = differenceInHours(dataAgendada, agora);
      return horasRestantes <= horasAntecedencia && horasRestantes > 0;
    });

    return {
      vencidos,
      hoje,
      proximosVencimentos
    };
  }, [followUps, horasAntecedencia]);

  return filters;
};
