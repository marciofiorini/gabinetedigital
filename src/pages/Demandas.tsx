
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Plus, Search, Filter, MapPin, Camera, Mic, Clock, User } from "lucide-react";

const Demandas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const demandas = [
    {
      id: 1,
      titulo: "Iluminação Pública na Rua das Flores",
      descricao: "Moradores relatam falta de iluminação no trecho entre as quadras 10 e 15",
      status: "Em Andamento",
      prioridade: "Alta",
      endereco: "Rua das Flores, Centro",
      cidadao: "Maria Silva",
      data: "2024-05-27",
      hasPhoto: true,
      hasAudio: false,
      categoria: "Infraestrutura"
    },
    {
      id: 2,
      titulo: "Buraco na Avenida Principal",
      descricao: "Grande buraco causando acidentes e danos aos veículos",
      status: "Pendente",
      prioridade: "Crítica",
      endereco: "Av. Principal, 1500",
      cidadao: "João Santos",
      data: "2024-05-26",
      hasPhoto: true,
      hasAudio: true,
      categoria: "Infraestrutura"
    },
    {
      id: 3,
      titulo: "Falta de Medicamentos no Posto de Saúde",
      descricao: "Diversos medicamentos em falta há mais de 2 semanas",
      status: "Resolvida",
      prioridade: "Alta",
      endereco: "UBS Central",
      cidadao: "Ana Costa",
      data: "2024-05-25",
      hasPhoto: false,
      hasAudio: false,
      categoria: "Saúde"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Em Andamento": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolvida": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Crítica": return "bg-red-100 text-red-800 border-red-200";
      case "Alta": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Média": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          {/* Header */}
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
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Nova Demanda
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar demandas..."
                    className="pl-10 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                </div>
                <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total", valor: "47", cor: "from-blue-500 to-blue-600" },
              { label: "Pendentes", valor: "18", cor: "from-yellow-500 to-orange-500" },
              { label: "Em Andamento", valor: "23", cor: "from-blue-500 to-indigo-500" },
              { label: "Resolvidas", valor: "6", cor: "from-green-500 to-emerald-500" }
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

          {/* Lista de Demandas */}
          <div className="space-y-4">
            {demandas.map((demanda) => (
              <Card key={demanda.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white/90">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{demanda.titulo}</h3>
                          <p className="text-gray-600 text-sm mb-2">{demanda.descricao}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {demanda.hasPhoto && (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Camera className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                          {demanda.hasAudio && (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Mic className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={`${getStatusColor(demanda.status)} border`}>
                          {demanda.status}
                        </Badge>
                        <Badge className={`${getPrioridadeColor(demanda.prioridade)} border`}>
                          {demanda.prioridade}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {demanda.categoria}
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {demanda.endereco}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {demanda.cidadao}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {demanda.data}
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
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Demandas;
