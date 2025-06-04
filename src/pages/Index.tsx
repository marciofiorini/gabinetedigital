
import React from 'react';
import { DashboardCharts } from '@/components/DashboardCharts';
import { NotificationBell } from '@/components/NotificationBell';
import { NotificationToasts } from '@/components/NotificationToasts';
import { FollowUpNotifications } from '@/components/FollowUpNotifications';
import { AniversariantesSection } from '@/components/AniversariantesSection';
import { PrimeirosPassosCard } from '@/components/PrimeirosPassosCard';

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

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCharts />
          <FollowUpNotifications />
        </div>

        {/* Sidebar Direita - 1/3 */}
        <div className="space-y-6">
          <PrimeirosPassosCard />
          <AniversariantesSection />
        </div>
      </div>

      <NotificationToasts />
    </div>
  );
};

export default Index;
