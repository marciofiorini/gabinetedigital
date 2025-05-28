
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { 
  FileText, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Plus,
  Search
} from "lucide-react";

const PortalCidadao = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const solicitacoes = [
    {
      id: 1,
      protocolo: "SOL-2024-001",
      tipo: "Infraestrutura",
      titulo: "Reparo de calçada na Rua das Flores",
      cidadao: "Maria Silva",
      data: "2024-05-28",
      status: "em_andamento",
      prioridade: "media"
    },
    {
      id: 2,
      protocolo: "SOL-2024-002", 
      tipo: "Saúde",
      titulo: "Solicitação de posto de saúde no bairro",
      cidadao: "João Santos",
      data: "2024-05-27",
      status: "pendente",
      prioridade: "alta"
    },
    {
      id: 3,
      protocolo: "SOL-2024-003",
      tipo: "Educação",
      titulo: "Melhoria na iluminação da escola",
      cidadao: "Ana Costa",
      data: "2024-05-26",
      status: "concluida",
      prioridade: "baixa"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em_andamento": return "bg-blue-100 text-blue-800";
      case "concluida": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente": return <Clock className="w-4 h-4" />;
      case "em_andamento": return <AlertTriangle className="w-4 h-4" />;
      case "concluida": return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Portal do Cidadão
            </h1>
            <p className="text-gray-600">
              Interface pública para solicitações e acompanhamento de demandas
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total de Solicitações", valor: "156", icone: FileText, cor: "from-blue-500 to-blue-600" },
              { label: "Em Andamento", valor: "42", icone: AlertTriangle, cor: "from-yellow-500 to-yellow-600" },
              { label: "Concluídas", valor: "98", icone: CheckCircle, cor: "from-green-500 to-green-600" },
              { label: "Pendentes", valor: "16", icone: Clock, cor: "from-red-500 to-red-600" }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                        <stat.icone className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="solicitacoes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
              <TabsTrigger value="nova">Nova Solicitação</TabsTrigger>
              <TabsTrigger value="acompanhar">Acompanhar</TabsTrigger>
            </TabsList>

            <TabsContent value="solicitacoes" className="space-y-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="search"
                    placeholder="Buscar solicitações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Solicitação
                </Button>
              </div>

              <div className="space-y-4">
                {solicitacoes.map((solicitacao) => (
                  <Card key={solicitacao.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{solicitacao.protocolo}</Badge>
                          <Badge className={getStatusColor(solicitacao.status)}>
                            {getStatusIcon(solicitacao.status)}
                            <span className="ml-1">{solicitacao.status.replace('_', ' ')}</span>
                          </Badge>
                          <Badge className={getPrioridadeColor(solicitacao.prioridade)}>
                            {solicitacao.prioridade}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{solicitacao.data}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{solicitacao.titulo}</h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{solicitacao.cidadao}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{solicitacao.tipo}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                        <Button size="sm">Atualizar Status</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nova" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Nova Solicitação do Cidadão</CardTitle>
                  <CardDescription>
                    Registre uma nova demanda ou solicitação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome do Cidadão</label>
                      <Input placeholder="Digite o nome completo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone/Email</label>
                      <Input placeholder="Contato para retorno" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Solicitação</label>
                    <Input placeholder="Ex: Infraestrutura, Saúde, Educação..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Título da Solicitação</label>
                    <Input placeholder="Resumo da demanda" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição Detalhada</label>
                    <Textarea placeholder="Descreva a solicitação em detalhes..." rows={4} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Localização</label>
                      <Input placeholder="Endereço ou referência" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Prioridade</label>
                      <Input placeholder="Alta, Média, Baixa" />
                    </div>
                  </div>
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Solicitação
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="acompanhar" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Acompanhar Solicitação</CardTitle>
                  <CardDescription>
                    Digite o número do protocolo para acompanhar sua solicitação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Input placeholder="Digite o número do protocolo (ex: SOL-2024-001)" className="flex-1" />
                    <Button>Consultar</Button>
                  </div>
                  
                  <div className="mt-8 p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-2">Como usar o Portal</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Registre sua solicitação na aba "Nova Solicitação"</li>
                      <li>• Anote o número do protocolo fornecido</li>
                      <li>• Use este espaço para acompanhar o andamento</li>
                      <li>• Você receberá atualizações por email/SMS</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default PortalCidadao;
