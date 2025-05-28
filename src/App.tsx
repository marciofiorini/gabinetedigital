
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Demandas from "./pages/Demandas";
import Lideres from "./pages/Lideres";
import Contatos from "./pages/Contatos";
import CrmKanban from "./pages/CrmKanban";
import WhatsApp from "./pages/WhatsApp";
import Instagram from "./pages/Instagram";
import Email from "./pages/Email";
import Agenda from "./pages/Agenda";
import Planos from "./pages/Planos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demandas" element={<Demandas />} />
          <Route path="/lideres" element={<Lideres />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/crm" element={<CrmKanban />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
          <Route path="/instagram" element={<Instagram />} />
          <Route path="/email" element={<Email />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/planos" element={<Planos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
