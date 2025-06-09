
import React from 'react';
import { DashboardCharts } from '@/components/DashboardCharts';
import { NotificationBell } from '@/components/NotificationBell';
import { NotificationToasts } from '@/components/NotificationToasts';
import { FollowUpNotifications } from '@/components/FollowUpNotifications';
import { AniversariantesSection } from '@/components/AniversariantesSection';
import { MetricasEngajamento } from '@/components/MetricasEngajamento';
import { ProximosEventos } from '@/components/ProximosEventos';
import { AtividadesRecentes } from '@/components/AtividadesRecentes';

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

      {/* Grid com as seções principais */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Coluna Esquerda */}
        <div className="space-y-4 lg:space-y-6">
          <MetricasEngajamento />
          <FollowUpNotifications />
        </div>

        {/* Coluna Direita */}
        <div className="space-y-4 lg:space-y-6">
          <ProximosEventos />
          <AniversariantesSection />
        </div>
      </div>

      {/* Atividades Recentes - largura completa */}
      <div className="w-full">
        <AtividadesRecentes />
      </div>

      <NotificationToasts />
    </div>
  );
};

export default Index;
