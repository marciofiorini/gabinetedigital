
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { LoginForm } from '@/components/LoginForm';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

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
import Configuracoes from '@/pages/Configuracoes';
import Integracoes from '@/pages/Integracoes';
import AgendaCompleta from '@/pages/AgendaCompleta';
import AnalyticsAvancado from '@/pages/AnalyticsAvancado';
import AssistenteIA from '@/pages/AssistenteIA';
import CommunicacaoIntegrada from '@/pages/ComunicacaoIntegrada';
import CrmAvancado from '@/pages/CrmAvancado';
import CrmCompleto from '@/pages/CrmCompleto';
import DemandasCompleta from '@/pages/DemandasCompleta';
import Equipe from '@/pages/Equipe';
import EquipeCompleta from '@/pages/EquipeCompleta';
import GestaoFinanceira from '@/pages/GestaoFinanceira';
import MapaInfluencia from '@/pages/MapaInfluencia';
import OrcamentoPublico from '@/pages/OrcamentoPublico';
import PrestacaoContas from '@/pages/PrestacaoContas';
import ProjetosFinanceiro from '@/pages/ProjetosFinanceiro';
import SistemaVotacoes from '@/pages/SistemaVotacoes';
import GaleriaFotos from '@/pages/GaleriaFotos';
import Ajuda from '@/pages/Ajuda';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('App.tsx: Componente App renderizado');
  
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
                <Route path="agenda-completa" element={<AgendaCompleta />} />
                <Route path="contatos" element={<Contatos />} />
                <Route path="crm" element={<CrmKanban />} />
                <Route path="crm-avancado" element={<CrmAvancado />} />
                <Route path="crm-completo" element={<CrmCompleto />} />
                <Route path="lideres" element={<Lideres />} />
                <Route path="whatsapp" element={<WhatsApp />} />
                <Route path="instagram" element={<Instagram />} />
                <Route path="email" element={<Email />} />
                <Route path="demandas" element={<Demandas />} />
                <Route path="demandas-completa" element={<DemandasCompleta />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="analytics-avancado" element={<AnalyticsAvancado />} />
                <Route path="dashboard-comparativo" element={<DashboardComparativo />} />
                <Route path="monitor-redes" element={<MonitorRedes />} />
                <Route path="comunicacao" element={<Comunicacao />} />
                <Route path="comunicacao-integrada" element={<CommunicacaoIntegrada />} />
                <Route path="banco-midia" element={<BancoMidia />} />
                <Route path="portal-cidadao" element={<PortalCidadao />} />
                <Route path="projetos-lei" element={<ProjetosLei />} />
                <Route path="pesquisas" element={<Pesquisas />} />
                <Route path="planos" element={<Planos />} />
                <Route path="administracao" element={<Administracao />} />
                <Route path="configuracoes" element={<Configuracoes />} />
                <Route path="integracoes" element={<Integracoes />} />
                <Route path="equipe" element={<Equipe />} />
                <Route path="equipe-completa" element={<EquipeCompleta />} />
                <Route path="gestao-financeira" element={<GestaoFinanceira />} />
                <Route path="orcamento-publico" element={<OrcamentoPublico />} />
                <Route path="prestacao-contas" element={<PrestacaoContas />} />
                <Route path="projetos-financeiro" element={<ProjetosFinanceiro />} />
                <Route path="mapa-influencia" element={<MapaInfluencia />} />
                <Route path="sistema-votacoes" element={<SistemaVotacoes />} />
                <Route path="galeria-fotos" element={<GaleriaFotos />} />
                <Route path="assistente-ia" element={<AssistenteIA />} />
                <Route path="ajuda" element={<Ajuda />} />
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
