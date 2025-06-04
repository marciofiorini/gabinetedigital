
import React from 'react';
import { DashboardCharts } from '@/components/DashboardCharts';
import { NotificationBell } from '@/components/NotificationBell';
import { NotificationToasts } from '@/components/NotificationToasts';
import { FollowUpNotifications } from '@/components/FollowUpNotifications';
import { AniversariantesSection } from '@/components/AniversariantesSection';

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

      {/* Coluna Única Principal */}
      <div className="space-y-6">
        <DashboardCharts />
        <FollowUpNotifications />
        <AniversariantesSection />
      </div>

      <NotificationToasts />
    </div>
  );
};

export default Index;
