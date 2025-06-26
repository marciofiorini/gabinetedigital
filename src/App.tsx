
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Contatos from "./pages/Contatos";
import Lideres from "./pages/Lideres";
import Demandas from "./pages/Demandas";
import Analytics from "./pages/Analytics";
import Configuracoes from "./pages/Configuracoes";
import Agenda from "./pages/Agenda";
import CrmKanban from "./pages/CrmKanban";
import CrmCompleto from "./pages/CrmCompleto";
import CrmAvancado from "./pages/CrmAvancado";
import AssistenteIA from "./pages/AssistenteIA";
import DashboardAvancado from "./pages/DashboardAvancado";
import { ProtectedLayout } from "./components/ProtectedLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ProtectedLayout><Index /></ProtectedLayout>} />
              <Route path="/contatos" element={<ProtectedLayout><Contatos /></ProtectedLayout>} />
              <Route path="/lideres" element={<ProtectedLayout><Lideres /></ProtectedLayout>} />
              <Route path="/demandas" element={<ProtectedLayout><Demandas /></ProtectedLayout>} />
              <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
              <Route path="/configuracoes" element={<ProtectedLayout><Configuracoes /></ProtectedLayout>} />
              <Route path="/agenda" element={<ProtectedLayout><Agenda /></ProtectedLayout>} />
              <Route path="/crm-kanban" element={<ProtectedLayout><CrmKanban /></ProtectedLayout>} />
              <Route path="/crm-completo" element={<ProtectedLayout><CrmCompleto /></ProtectedLayout>} />
              <Route path="/crm-avancado" element={<ProtectedLayout><CrmAvancado /></ProtectedLayout>} />
              <Route path="/assistente-ia" element={<ProtectedLayout><AssistenteIA /></ProtectedLayout>} />
              <Route path="/dashboard-avancado" element={<ProtectedLayout><DashboardAvancado /></ProtectedLayout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
