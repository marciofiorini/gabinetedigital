
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { NovaDemandaModal } from "@/components/NovaDemandaModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Filter, MapPin, Camera, Mic, Clock, User } from "lucide-react";

interface Demanda {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  zona: string;
  solicitante: string;
  categoria: string;
  created_at: string;
}

const Demandas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDemandas();
    }
  }, [user]);

  const fetchDemandas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('demandas')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDemandas(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar demandas:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar demandas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "em_andamento": return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolvida": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "critica": return "bg-red-100 text-red-800 border-red-200";
      case "alta": return "bg-orange-100 text-orange-800 border-orange-200";
      case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "em_andamento": return "Em Andamento";
      case "resolvida": return "Resolvida";
      default: return status;
    }
  };

  const getPrioridadeLabel = (prioridade: string) => {
    switch (prioridade) {
      case "critica": return "Crítica";
      case "alta": return "Alta";
      case "media": return "Média";
      case "baixa": return "Baixa";
      default: return prioridade;
    }
  };

  const filteredDemandas = demandas.filter(demanda =>
    demanda.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.solicitante?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: demandas.length,
    pendentes: demandas.filter(d => d.status === 'pendente').length,
    em_andamento: demandas.filter(d => d.status === 'em_andamento').length,
    resolvidas: demandas.filter(d => d.status === 'resolvida').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando demandas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Demandas Populares
                </h1>
                <p className="text-gray-600">
                  Gerencie todas as demandas da sua base eleitoral
                </p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Demanda
              </Button>
            </div>
          </div>

          <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar demandas..."
                    className="pl-10 border-gray-200 focus:border-blue-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total", valor: stats.total.toString(), cor: "from-blue-500 to-blue-600" },
              { label: "Pendentes", valor: stats.pendentes.toString(), cor: "from-yellow-500 to-orange-500" },
              { label: "Em Andamento", valor: stats.em_andamento.toString(), cor: "from-blue-500 to-indigo-500" },
              { label: "Resolvidas", valor: stats.resolvidas.toString(), cor: "from-green-500 to-emerald-500" }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                      <span className="text-white font-bold text-lg">{stat.valor}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            {filteredDemandas.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'Nenhuma demanda encontrada com os termos pesquisados.' : 'Nenhuma demanda cadastrada ainda.'}
                  </p>
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar primeira demanda
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredDemandas.map((demanda) => (
                <Card key={demanda.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white/90">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">{demanda.titulo}</h3>
                            <p className="text-gray-600 text-sm mb-2">{demanda.descricao}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={`${getStatusColor(demanda.status)} border`}>
                            {getStatusLabel(demanda.status)}
                          </Badge>
                          <Badge className={`${getPrioridadeColor(demanda.prioridade)} border`}>
                            {getPrioridadeLabel(demanda.prioridade)}
                          </Badge>
                          {demanda.categoria && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {demanda.categoria}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-500">
                          {demanda.zona && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {demanda.zona}
                            </div>
                          )}
                          {demanda.solicitante && (
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {demanda.solicitante}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(demanda.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                          Ver Detalhes
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      <NovaDemandaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onDemandaCreated={fetchDemandas}
      />
    </div>
  );
};

export default Demandas;
