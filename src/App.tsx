
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import Index from './pages/Index';
import Agenda from './pages/Agenda';
import AgendaCompleta from './pages/AgendaCompleta';
import CrmKanban from './pages/CrmKanban';
import CrmCompleto from './pages/CrmCompleto';
import Demandas from './pages/Demandas';
import Email from './pages/Email';
import Instagram from './pages/Instagram';
import Lideres from './pages/Lideres';
import NotFound from './pages/NotFound';
import Planos from './pages/Planos';
import Contatos from './pages/Contatos';
import WhatsApp from './pages/WhatsApp';
import Configuracoes from './pages/Configuracoes';
import Analytics from './pages/Analytics';
import MonitorRedes from './pages/MonitorRedes';
import ComunicacaoIntegrada from './pages/ComunicacaoIntegrada';
import BancoMidia from './pages/BancoMidia';
import PortalCidadao from './pages/PortalCidadao';
import ProjetosLei from './pages/ProjetosLei';
import Pesquisas from './pages/Pesquisas';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/30 transition-colors">
            <ProtectedLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/agenda-completa" element={<AgendaCompleta />} />
                <Route path="/crm" element={<CrmKanban />} />
                <Route path="/crm-completo" element={<CrmCompleto />} />
                <Route path="/demandas" element={<Demandas />} />
                <Route path="/email" element={<Email />} />
                <Route path="/instagram" element={<Instagram />} />
                <Route path="/lideres" element={<Lideres />} />
                <Route path="/planos" element={<Planos />} />
                <Route path="/contatos" element={<Contatos />} />
                <Route path="/whatsapp" element={<WhatsApp />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/monitor-redes" element={<MonitorRedes />} />
                <Route path="/comunicacao" element={<ComunicacaoIntegrada />} />
                <Route path="/banco-midia" element={<BancoMidia />} />
                <Route path="/portal-cidadao" element={<PortalCidadao />} />
                <Route path="/projetos-lei" element={<ProjetosLei />} />
                <Route path="/pesquisas" element={<Pesquisas />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedLayout>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
