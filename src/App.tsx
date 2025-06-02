
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import Index from '@/pages/Index';
import Analytics from '@/pages/Analytics';
import CrmKanban from '@/pages/CrmKanban';
import DashboardComparativo from '@/pages/DashboardComparativo';
import Agenda from '@/pages/Agenda';
import Contatos from '@/pages/Contatos';
import Lideres from '@/pages/Lideres';
import WhatsApp from '@/pages/WhatsApp';
import Instagram from '@/pages/Instagram';
import Email from '@/pages/Email';
import Demandas from '@/pages/Demandas';
import DemandasCompleta from '@/pages/DemandasCompleta';
import MonitorRedes from '@/pages/MonitorRedes';
import ComunicacaoIntegrada from '@/pages/ComunicacaoIntegrada';
import BancoMidia from '@/pages/BancoMidia';
import PortalCidadao from '@/pages/PortalCidadao';
import ProjetosLei from '@/pages/ProjetosLei';
import Pesquisas from '@/pages/Pesquisas';
import Planos from '@/pages/Planos';
import Configuracoes from '@/pages/Configuracoes';
import Administracao from '@/pages/Administracao';
import NotFound from '@/pages/NotFound';
import CrmCompleto from '@/pages/CrmCompleto';
import AgendaCompleta from '@/pages/AgendaCompleta';
import MapaInfluencia from '@/pages/MapaInfluencia';
import SistemaVotacoes from '@/pages/SistemaVotacoes';
import Comunicacao from '@/pages/Comunicacao';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Routes>
              <Route path="/" element={<ProtectedLayout><Index /></ProtectedLayout>} />
              <Route path="/contatos" element={<ProtectedLayout><Contatos /></ProtectedLayout>} />
              <Route path="/lideres" element={<ProtectedLayout><Lideres /></ProtectedLayout>} />
              <Route path="/demandas" element={<ProtectedLayout><Demandas /></ProtectedLayout>} />
              <Route path="/demandas-completa" element={<ProtectedLayout><DemandasCompleta /></ProtectedLayout>} />
              <Route path="/crm" element={<ProtectedLayout><CrmKanban /></ProtectedLayout>} />
              <Route path="/crm-completo" element={<ProtectedLayout><CrmCompleto /></ProtectedLayout>} />
              <Route path="/agenda" element={<ProtectedLayout><Agenda /></ProtectedLayout>} />
              <Route path="/agenda-completa" element={<ProtectedLayout><AgendaCompleta /></ProtectedLayout>} />
              <Route path="/projetos-lei" element={<ProtectedLayout><ProjetosLei /></ProtectedLayout>} />
              <Route path="/planos" element={<ProtectedLayout><Planos /></ProtectedLayout>} />
              <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
              <Route path="/monitor-redes" element={<ProtectedLayout><MonitorRedes /></ProtectedLayout>} />
              <Route path="/mapa-influencia" element={<ProtectedLayout><MapaInfluencia /></ProtectedLayout>} />
              <Route path="/pesquisas" element={<ProtectedLayout><Pesquisas /></ProtectedLayout>} />
              <Route path="/portal-cidadao" element={<ProtectedLayout><PortalCidadao /></ProtectedLayout>} />
              <Route path="/sistema-votacoes" element={<ProtectedLayout><SistemaVotacoes /></ProtectedLayout>} />
              <Route path="/banco-midia" element={<ProtectedLayout><BancoMidia /></ProtectedLayout>} />
              <Route path="/dashboard-comparativo" element={<ProtectedLayout><DashboardComparativo /></ProtectedLayout>} />
              <Route path="/comunicacao-integrada" element={<ProtectedLayout><ComunicacaoIntegrada /></ProtectedLayout>} />
              <Route path="/administracao" element={<ProtectedLayout><Administracao /></ProtectedLayout>} />
              <Route path="/configuracoes" element={<ProtectedLayout><Configuracoes /></ProtectedLayout>} />
              <Route path="/comunicacao" element={<ProtectedLayout><Comunicacao /></ProtectedLayout>} />
              <Route path="/email" element={<ProtectedLayout><Email /></ProtectedLayout>} />
              <Route path="/whatsapp" element={<ProtectedLayout><WhatsApp /></ProtectedLayout>} />
              <Route path="/instagram" element={<ProtectedLayout><Instagram /></ProtectedLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
