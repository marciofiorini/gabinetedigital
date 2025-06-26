
import React from 'react';
import { DashboardCharts } from '@/components/DashboardCharts';
import { NotificationBell } from '@/components/NotificationBell';
import { MetricasEngajamento } from '@/components/MetricasEngajamento';

const Index = () => {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 lg:mt-2 text-sm lg:text-base">
            Bem-vindo ao seu painel político
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <NotificationBell />
        </div>
      </div>

      {/* Gráficos principais */}
      <div className="w-full overflow-hidden">
        <DashboardCharts />
      </div>

      {/* Métricas de Engajamento */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        <MetricasEngajamento />
      </div>
    </div>
  );
};

export default Index;
