
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Plus,
  Search,
  FileText,
  Calendar
} from "lucide-react";

const Pesquisas = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const pesquisas = [
    {
      id: 1,
      titulo: "Intenção de Voto - Maio 2024",
      data: "2024-05-28",
      status: "Ativa",
      participantes: 1250,
      tipo: "Eleitoral"
    },
    {
      id: 2,
      titulo: "Avaliação da Gestão Municipal",
      data: "2024-05-25",
      status: "Concluída",
      participantes: 980,
      tipo: "Aprovação"
    },
    {
      id: 3,
      titulo: "Prioridades para a Cidade",
      data: "2024-05-20",
      status: "Em Análise",
      participantes: 756,
      tipo: "Temática"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa": return "bg-green-100 text-green-800";
      case "Concluída": return "bg-blue-100 text-blue-800";
      case "Em Análise": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Pesquisas
          </h1>
          <p className="text-gray-600">
            Gerencie pesquisas de opinião e intenção de voto
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Nova Pesquisa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Pesquisas Ativas", valor: "3", icone: BarChart3, cor: "from-blue-500 to-blue-600" },
          { label: "Total Participantes", valor: "2.9k", icone: Users, cor: "from-green-500 to-green-600" },
          { label: "Taxa de Resposta", valor: "78%", icone: Target, cor: "from-purple-500 to-purple-600" },
          { label: "Pesquisas Concluídas", valor: "12", icone: FileText, cor: "from-orange-500 to-orange-600" }
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pesquisas">Pesquisas</TabsTrigger>
          <TabsTrigger value="nova">Nova Pesquisa</TabsTrigger>
          <TabsTrigger value="resultados">Resultados</TabsTrigger>
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
          </div>

          <div className="space-y-4">
            {pesquisas.map((pesquisa) => (
              <Card key={pesquisa.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{pesquisa.tipo}</Badge>
                      <Badge className={getStatusColor(pesquisa.status)}>
                        {pesquisa.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{pesquisa.data}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pesquisa.titulo}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{pesquisa.participantes} participantes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{pesquisa.data}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ver Resultados</Button>
                    <Button size="sm">Editar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nova" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Nova Pesquisa</CardTitle>
              <CardDescription>
                Configure uma nova pesquisa de opinião
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título da Pesquisa</label>
                <Input placeholder="Ex: Intenção de Voto - Junho 2024" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Pesquisa</label>
                <Input placeholder="Ex: Eleitoral, Aprovação, Temática" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data de Início</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data de Término</label>
                  <Input type="date" />
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
            <CardContent className="p-6">
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Gráficos de resultados serão implementados aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pesquisas;
