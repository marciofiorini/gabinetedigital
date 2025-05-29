
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
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
import MonitorRedes from '@/pages/MonitorRedes';
import ComunicacaoIntegrada from '@/pages/ComunicacaoIntegrada';
import BancoMidia from '@/pages/BancoMidia';
import PortalCidadao from '@/pages/PortalCidadao';
import ProjetosLei from '@/pages/ProjetosLei';
import Pesquisas from '@/pages/Pesquisas';
import Planos from '@/pages/Planos';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/crm" element={<CrmKanban />} />
            <Route path="/dashboard-comparativo" element={<DashboardComparativo />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/contatos" element={<Contatos />} />
            <Route path="/lideres" element={<Lideres />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/instagram" element={<Instagram />} />
            <Route path="/email" element={<Email />} />
            <Route path="/demandas" element={<Demandas />} />
            <Route path="/monitor-redes" element={<MonitorRedes />} />
            <Route path="/comunicacao" element={<ComunicacaoIntegrada />} />
            <Route path="/banco-midia" element={<BancoMidia />} />
            <Route path="/portal-cidadao" element={<PortalCidadao />} />
            <Route path="/projetos-lei" element={<ProjetosLei />} />
            <Route path="/pesquisas" element={<Pesquisas />} />
            <Route path="/planos" element={<Planos />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
