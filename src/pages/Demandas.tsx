import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  MapPin,
  Calendar,
  FileText
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Demandas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

  const demandas = [
    {
      id: 1,
      titulo: "Reparo de Calçada na Rua das Flores",
      descricao: "Calçada com buracos prejudicando pedestres",
      solicitante: "Maria Silva",
      telefone: "(21) 99999-1111",
      endereco: "Rua das Flores, 123 - Zona Sul",
      status: "Pendente",
      prioridade: "Alta",
      categoria: "Infraestrutura",
      dataAbertura: "2024-05-25",
      prazoEstimado: "2024-06-10"
    },
    {
      id: 2,
      titulo: "Melhoria na Iluminação Pública",
      descricao: "Falta de postes de luz na praça central",
      solicitante: "João Santos",
      telefone: "(21) 99999-2222",
      endereco: "Praça Central - Centro",
      status: "Em Andamento",
      prioridade: "Média",
      categoria: "Segurança",
      dataAbertura: "2024-05-20",
      prazoEstimado: "2024-06-05"
    },
    {
      id: 3,
      titulo: "Limpeza de Terreno Abandonado",
      descricao: "Terreno com mato alto e lixo acumulado",
      solicitante: "Ana Costa",
      telefone: "(21) 99999-3333",
      endereco: "Rua do Progresso, 456 - Zona Norte",
      status: "Concluída",
      prioridade: "Baixa",
      categoria: "Limpeza",
      dataAbertura: "2024-05-15",
      prazoEstimado: "2024-05-30"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Em Andamento": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Concluída": return "bg-green-100 text-green-800 border-green-200";
      case "Cancelada": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta": return "bg-red-100 text-red-800 border-red-200";
      case "Média": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pendente": return <Clock className="w-4 h-4" />;
      case "Em Andamento": return <AlertCircle className="w-4 h-4" />;
      case "Concluída": return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Demandas
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Gerencie solicitações e demandas da comunidade
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nova Demanda
        </Button>
      </div>

      <Tabs defaultValue="lista" className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lista" className="text-xs lg:text-sm">Lista</TabsTrigger>
          <TabsTrigger value="mapa" className="text-xs lg:text-sm">Mapa</TabsTrigger>
          <TabsTrigger value="estatisticas" className="text-xs lg:text-sm">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4 lg:space-y-6">
          {/* Filtros */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar demandas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <Button variant="outline" className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {[
              { label: "Total", valor: "156", cor: "from-indigo-500 to-indigo-600", icon: FileText },
              { label: "Pendentes", valor: "45", cor: "from-yellow-500 to-yellow-600", icon: Clock },
              { label: "Em Andamento", valor: "38", cor: "from-blue-500 to-blue-600", icon: AlertCircle },
              { label: "Concluídas", valor: "73", cor: "from-green-500 to-green-600", icon: CheckCircle }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-3 lg:p-6">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-2 lg:mr-4`}>
                      <stat.icon className="text-white w-4 h-4 lg:w-6 lg:h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs lg:text-sm text-gray-600 truncate">{stat.label}</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{stat.valor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabela de Demandas - Mobile Cards ou Desktop Table */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 lg:pb-6">
              <CardTitle className="text-lg lg:text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lista de Demandas
              </CardTitle>
              <CardDescription className="text-sm">
                Acompanhe todas as demandas registradas
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 lg:p-6">
              {isMobile ? (
                /* Mobile Cards View */
                <div className="space-y-3 p-4">
                  {demandas.map((demanda) => (
                    <Card key={demanda.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-semibold text-sm text-gray-900 flex-1">{demanda.titulo}</h3>
                            <Badge className={`${getStatusColor(demanda.status)} border flex items-center gap-1 text-xs shrink-0`}>
                              {getStatusIcon(demanda.status)}
                              {demanda.status}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-gray-600 line-clamp-2">{demanda.descricao}</p>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{demanda.endereco}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">{demanda.solicitante}</p>
                              <p className="text-xs text-gray-600">{demanda.telefone}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge className={`${getPrioridadeColor(demanda.prioridade)} border text-xs`}>
                              {demanda.prioridade}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="w-3 h-3" />
                              {demanda.dataAbertura}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="hover:bg-indigo-50 flex-1 text-xs">
                              Ver
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex-1 text-xs">
                              Editar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* Desktop Table View */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Demanda</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data Abertura</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demandas.map((demanda) => (
                        <TableRow key={demanda.id} className="hover:bg-indigo-50/50">
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-900">{demanda.titulo}</p>
                              <p className="text-sm text-gray-600 truncate max-w-xs">{demanda.descricao}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {demanda.endereco}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{demanda.solicitante}</p>
                                <p className="text-sm text-gray-600">{demanda.telefone}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(demanda.status)} border flex items-center gap-1 w-fit`}>
                              {getStatusIcon(demanda.status)}
                              {demanda.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getPrioridadeColor(demanda.prioridade)} border`}>
                              {demanda.prioridade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">{demanda.categoria}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              {demanda.dataAbertura}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="hover:bg-indigo-50">
                                Ver
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                                Editar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapa">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="h-64 lg:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm lg:text-base">Mapa de demandas será implementado aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="h-64 lg:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm lg:text-base">Gráficos de estatísticas serão implementados aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Demandas;
