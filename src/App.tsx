
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import Index from './pages/Index';
import Agenda from './pages/Agenda';
import CrmKanban from './pages/CrmKanban';
import Demandas from './pages/Demandas';
import Email from './pages/Email';
import Instagram from './pages/Instagram';
import Lideres from './pages/Lideres';
import NotFound from './pages/NotFound';
import Planos from './pages/Planos';
import Contatos from './pages/Contatos';
import WhatsApp from './pages/WhatsApp';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ProtectedLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/crm" element={<CrmKanban />} />
              <Route path="/demandas" element={<Demandas />} />
              <Route path="/email" element={<Email />} />
              <Route path="/instagram" element={<Instagram />} />
              <Route path="/lideres" element={<Lideres />} />
              <Route path="/planos" element={<Planos />} />
              <Route path="/contatos" element={<Contatos />} />
              <Route path="/whatsapp" element={<WhatsApp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProtectedLayout>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
