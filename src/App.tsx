
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import Index from "./pages/Index";
import Contatos from "./pages/Contatos";
import Lideres from "./pages/Lideres";
import CrmKanban from "./pages/CrmKanban";
import CrmCompleto from "./pages/CrmCompleto";
import Demandas from "./pages/Demandas";
import DemandasCompleta from "./pages/DemandasCompleta";
import ProjetosLei from "./pages/ProjetosLei";
import Comunicacao from "./pages/Comunicacao";
import ComunicacaoIntegrada from "./pages/ComunicacaoIntegrada";
import WhatsApp from "./pages/WhatsApp";
import Instagram from "./pages/Instagram";
import Email from "./pages/Email";
import Analytics from "./pages/Analytics";
import AnalyticsAvancado from "./pages/AnalyticsAvancado";
import MonitorRedes from "./pages/MonitorRedes";
import Pesquisas from "./pages/Pesquisas";
import PortalCidadao from "./pages/PortalCidadao";
import MapaInfluencia from "./pages/MapaInfluencia";
import SistemaVotacoes from "./pages/SistemaVotacoes";
import Equipe from "./pages/Equipe";
import EquipeCompleta from "./pages/EquipeCompleta";
import OrcamentoPublico from "./pages/OrcamentoPublico";
import PrestacaoContas from "./pages/PrestacaoContas";
import ProjetosFinanceiro from "./pages/ProjetosFinanceiro";
import Configuracoes from "./pages/Configuracoes";
import Planos from "./pages/Planos";
import Ajuda from "./pages/Ajuda";
import Administracao from "./pages/Administracao";
import Agenda from "./pages/Agenda";
import AgendaCompleta from "./pages/AgendaCompleta";
import DashboardComparativo from "./pages/DashboardComparativo";
import BancoMidia from "./pages/BancoMidia";
import Integracoes from "./pages/Integracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedLayout />}>
              <Route index element={<Index />} />
              <Route path="contatos" element={<Contatos />} />
              <Route path="lideres" element={<Lideres />} />
              <Route path="crm" element={<CrmKanban />} />
              <Route path="crm-completo" element={<CrmCompleto />} />
              <Route path="demandas" element={<Demandas />} />
              <Route path="demandas-completa" element={<DemandasCompleta />} />
              <Route path="projetos-lei" element={<ProjetosLei />} />
              <Route path="comunicacao" element={<Comunicacao />} />
              <Route path="comunicacao-integrada" element={<ComunicacaoIntegrada />} />
              <Route path="whatsapp" element={<WhatsApp />} />
              <Route path="instagram" element={<Instagram />} />
              <Route path="email" element={<Email />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="analytics-avancado" element={<AnalyticsAvancado />} />
              <Route path="monitor-redes" element={<MonitorRedes />} />
              <Route path="pesquisas" element={<Pesquisas />} />
              <Route path="portal-cidadao" element={<PortalCidadao />} />
              <Route path="mapa-influencia" element={<MapaInfluencia />} />
              <Route path="sistema-votacoes" element={<SistemaVotacoes />} />
              <Route path="equipe" element={<Equipe />} />
              <Route path="equipe-completa" element={<EquipeCompleta />} />
              <Route path="orcamento-publico" element={<OrcamentoPublico />} />
              <Route path="prestacao-contas" element={<PrestacaoContas />} />
              <Route path="projetos-financeiro" element={<ProjetosFinanceiro />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="planos" element={<Planos />} />
              <Route path="ajuda" element={<Ajuda />} />
              <Route path="administracao" element={<Administracao />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="agenda-completa" element={<AgendaCompleta />} />
              <Route path="dashboard-comparativo" element={<DashboardComparativo />} />
              <Route path="banco-midia" element={<BancoMidia />} />
              <Route path="integracoes" element={<Integracoes />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
