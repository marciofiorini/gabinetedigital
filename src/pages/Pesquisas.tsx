import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle, 
  Plus,
  Search,
  Share2,
  Download,
  Eye,
  TrendingUp,
  PieChart
} from "lucide-react";

const Pesquisas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const pesquisas = [
    {
      id: 1,
      titulo: "Avaliação da Gestão Municipal 2024",
      tipo: "Opinião Pública",
      status: "ativa",
      dataInicio: "2024-05-20",
      dataFim: "2024-06-20",
      respostas: 247,
      metaRespostas: 500,
      percentualCompleto: 49
    },
    {
      id: 2,
      titulo: "Prioridades para Investimento em Infraestrutura",
      tipo: "Consulta Popular",
      status: "concluida",
      dataInicio: "2024-04-15",
      dataFim: "2024-05-15",
      respostas: 892,
      metaRespostas: 800,
      percentualCompleto: 100
    },
    {
      id: 3,
      titulo: "Satisfação com Serviços de Saúde",
      tipo: "Avaliação de Serviços",
      status: "rascunho",
      dataInicio: "2024-06-01",
      dataFim: "2024-07-01",
      respostas: 0,
      metaRespostas: 300,
      percentualCompleto: 0
    }
  ];

  const resultadosExemplo = [
    { opcao: "Ótimo", votos: 156, percentual: 35 },
    { opcao: "Bom", votos: 134, percentual: 30 },
    { opcao: "Regular", votos: 89, percentual: 20 },
    { opcao: "Ruim", votos: 45, percentual: 10 },
    { opcao: "Péssimo", votos: 22, percentual: 5 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativa": return "bg-green-100 text-green-800";
      case "concluida": return "bg-blue-100 text-blue-800";
      case "rascunho": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativa": return <Clock className="w-4 h-4" />;
      case "concluida": return <CheckCircle className="w-4 h-4" />;
      case "rascunho": return <Search className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
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
              Sistema de Pesquisas
            </h1>
            <p className="text-gray-600">
              Criação e análise de pesquisas de opinião e consultas populares
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Pesquisas Ativas", valor: "3", icone: BarChart3, cor: "from-blue-500 to-blue-600" },
              { label: "Total de Respostas", valor: "1,139", icone: Users, cor: "from-green-500 to-green-600" },
              { label: "Concluídas", valor: "12", icone: CheckCircle, cor: "from-purple-500 to-purple-600" },
              { label: "Taxa de Participação", valor: "68%", icone: TrendingUp, cor: "from-orange-500 to-orange-600" }
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

          <Tabs defaultValue="pesquisas" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pesquisas">Minhas Pesquisas</TabsTrigger>
              <TabsTrigger value="nova">Criar Pesquisa</TabsTrigger>
              <TabsTrigger value="resultados">Resultados</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="pesquisas" className="space-y-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="search"
                    placeholder="Buscar pesquisas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Pesquisa
                </Button>
              </div>

              <div className="space-y-4">
                {pesquisas.map((pesquisa) => (
                  <Card key={pesquisa.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(pesquisa.status)}>
                            {getStatusIcon(pesquisa.status)}
                            <span className="ml-1">{pesquisa.status}</span>
                          </Badge>
                          <Badge variant="secondary">{pesquisa.tipo}</Badge>
                        </div>
                        <span className="text-sm text-gray-500">{pesquisa.dataInicio}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{pesquisa.titulo}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{pesquisa.respostas}</p>
                          <p className="text-sm text-gray-600">Respostas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{pesquisa.metaRespostas}</p>
                          <p className="text-sm text-gray-600">Meta</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{pesquisa.percentualCompleto}%</p>
                          <p className="text-sm text-gray-600">Completo</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progresso</span>
                          <span>{pesquisa.respostas}/{pesquisa.metaRespostas}</span>
                        </div>
                        <Progress value={pesquisa.percentualCompleto} className="h-2" />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Compartilhar
                        </Button>
                        <Button size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Resultados
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nova" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Criar Nova Pesquisa</CardTitle>
                  <CardDescription>
                    Configure uma nova pesquisa de opinião ou consulta popular
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título da Pesquisa</label>
                    <Input placeholder="Ex: Avaliação dos Serviços Municipais" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição/Objetivo</label>
                    <Textarea placeholder="Descreva o objetivo e contexto da pesquisa..." rows={3} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tipo de Pesquisa</label>
                      <Input placeholder="Opinião Pública, Consulta Popular, etc." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Meta de Respostas</label>
                      <Input type="number" placeholder="500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Data de Início</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Data de Encerramento</label>
                      <Input type="date" />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Perguntas da Pesquisa</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Pergunta 1</label>
                        <Input placeholder="Como você avalia a gestão municipal?" />
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <Input placeholder="Opção 1" />
                          <Input placeholder="Opção 2" />
                        </div>
                      </div>
                      <Button variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Pergunta
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Pesquisa
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resultados" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Resultados das Pesquisas</CardTitle>
                  <CardDescription>
                    Análise detalhada dos resultados coletados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Como você avalia a gestão municipal?</h4>
                      <div className="space-y-3">
                        {resultadosExemplo.map((resultado, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-20 text-sm font-medium">{resultado.opcao}</div>
                            <div className="flex-1">
                              <Progress value={resultado.percentual} className="h-3" />
                            </div>
                            <div className="w-16 text-sm text-gray-600 text-right">
                              {resultado.votos} ({resultado.percentual}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Exportar Dados
                      </Button>
                      <Button variant="outline" size="sm">
                        <PieChart className="w-4 h-4 mr-1" />
                        Gráficos Detalhados
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Analytics e Insights</CardTitle>
                  <CardDescription>
                    Análise avançada dos dados coletados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Analytics avançados serão exibidos aqui</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Gráficos, tendências e insights dos dados coletados
                    </p>
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

export default Pesquisas;
