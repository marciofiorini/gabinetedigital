
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from '@/components/Dashboard';
import { DashboardMobile } from '@/components/DashboardMobile';
import { AuthPage } from '@/components/AuthPage';
import { useMediaQuery } from '@/hooks/use-media-query';

const Index = () => {
  const { user, loading } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return isMobile ? <DashboardMobile /> : <Dashboard />;
};

export default Index;
