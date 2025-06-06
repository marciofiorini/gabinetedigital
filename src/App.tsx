
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedLayout } from '@/components/ProtectedLayout';

// Pages
import Index from '@/pages/Index';
import Agenda from '@/pages/Agenda';
import Contatos from '@/pages/Contatos';
import CrmKanban from '@/pages/CrmKanban';
import Lideres from '@/pages/Lideres';
import WhatsApp from '@/pages/WhatsApp';
import Instagram from '@/pages/Instagram';
import Email from '@/pages/Email';
import Demandas from '@/pages/Demandas';
import Analytics from '@/pages/Analytics';
import DashboardComparativo from '@/pages/DashboardComparativo';
import MonitorRedes from '@/pages/MonitorRedes';
import Comunicacao from '@/pages/Comunicacao';
import BancoMidia from '@/pages/BancoMidia';
import PortalCidadao from '@/pages/PortalCidadao';
import ProjetosLei from '@/pages/ProjetosLei';
import Pesquisas from '@/pages/Pesquisas';
import Planos from '@/pages/Planos';
import Administracao from '@/pages/Administracao';
import { LoginForm } from '@/components/LoginForm';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route path="/*" element={<ProtectedLayout />}>
                <Route index element={<Index />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="contatos" element={<Contatos />} />
                <Route path="crm" element={<CrmKanban />} />
                <Route path="lideres" element={<Lideres />} />
                <Route path="whatsapp" element={<WhatsApp />} />
                <Route path="instagram" element={<Instagram />} />
                <Route path="email" element={<Email />} />
                <Route path="demandas" element={<Demandas />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="dashboard-comparativo" element={<DashboardComparativo />} />
                <Route path="monitor-redes" element={<MonitorRedes />} />
                <Route path="comunicacao" element={<Comunicacao />} />
                <Route path="banco-midia" element={<BancoMidia />} />
                <Route path="portal-cidadao" element={<PortalCidadao />} />
                <Route path="projetos-lei" element={<ProjetosLei />} />
                <Route path="pesquisas" element={<Pesquisas />} />
                <Route path="planos" element={<Planos />} />
                <Route path="administracao" element={<Administracao />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
