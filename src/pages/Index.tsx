
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Bem-vindo ao seu painel político
          </p>
        </div>
        <NotificationBell />
      </div>

      {/* Gráficos principais */}
      <DashboardCharts />

      {/* Grid com as seções principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna Esquerda */}
        <div className="space-y-6">
          <MetricasEngajamento />
          <FollowUpNotifications />
        </div>

        {/* Coluna Direita */}
        <div className="space-y-6">
          <ProximosEventos />
          <AniversariantesSection />
        </div>
      </div>

      {/* Atividades Recentes - largura completa */}
      <AtividadesRecentes />

      <NotificationToasts />
    </div>
  );
};

export default Index;
