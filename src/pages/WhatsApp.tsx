
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  MessageCircle, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  Users, 
  Clock, 
  CheckCircle, 
  Phone,
  BarChart3,
  Zap
} from "lucide-react";

const WhatsApp = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const campanhas = [
    {
      id: 1,
      titulo: "Convite Audiência Pública",
      mensagem: "Olá! Você está convidado para nossa audiência pública sobre mobilidade urbana...",
      status: "Enviada",
      destinatarios: 850,
      enviadoEm: "2024-05-27 14:30",
      entregues: 820,
      lidas: 645,
      respondidas: 89
    },
    {
      id: 2,
      titulo: "Newsletter Semanal",
      mensagem: "Confira as principais atividades da semana e nossas próximas agendas...",
      status: "Agendada",
      destinatarios: 1200,
      enviadoEm: "2024-05-28 10:00",
      entregues: 0,
      lidas: 0,
      respondidas: 0
    },
    {
      id: 3,
      titulo: "Pesquisa de Opinião",
      mensagem: "Sua opinião é importante! Responda nossa pesquisa sobre as prioridades do bairro...",
      status: "Rascunho",
      destinatarios: 0,
      enviadoEm: "-",
      entregues: 0,
      lidas: 0,
      respondidas: 0
    }
  ];

  const conversas = [
    {
      id: 1,
      contato: "Ana Silva",
      telefone: "(21) 99999-1111",
      ultimaMensagem: "Obrigada pelas informações sobre a audiência!",
      horario: "14:45",
      status: "Não lida",
      tipo: "Individual"
    },
    {
      id: 2,
      contato: "João Santos",
      telefone: "(21) 99999-2222",
      ultimaMensagem: "Quando será a próxima reunião da comunidade?",
      horario: "13:20",
      status: "Lida",
      tipo: "Individual"
    },
    {
      id: 3,
      contato: "Grupo Moradores ZS",
      telefone: "Grupo - 45 membros",
      ultimaMensagem: "Carlos: Precisamos discutir o problema da iluminação",
      horario: "12:15",
      status: "Não lida",
      tipo: "Grupo"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviada": return "bg-green-100 text-green-800 border-green-200";
      case "Agendada": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Rascunho": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Enviada": return <CheckCircle className="w-4 h-4" />;
      case "Agendada": return <Clock className="w-4 h-4" />;
      case "Rascunho": return <MessageCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            WhatsApp
          </h1>
          <p className="text-gray-600">
            Gerencie conversas e campanhas via WhatsApp
          </p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <Tabs defaultValue="conversas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conversas">Conversas</TabsTrigger>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="nova-campanha">Nova Campanha</TabsTrigger>
        </TabsList>

        <TabsContent value="conversas" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Conversas Ativas", valor: "47", cor: "from-green-500 to-green-600", icon: MessageCircle },
              { label: "Não Lidas", valor: "12", cor: "from-red-500 to-red-600", icon: Zap },
              { label: "Grupos", valor: "8", cor: "from-blue-500 to-blue-600", icon: Users },
              { label: "Taxa Resposta", valor: "89%", cor: "from-purple-500 to-purple-600", icon: BarChart3 }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                      <stat.icon className="text-white w-6 h-6" />
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

          {/* Filtros */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-green-500 transition-colors"
                  />
                </div>
                <Button variant="outline" className="hover:bg-green-50 hover:border-green-300 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Conversas */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Conversas Recentes
              </CardTitle>
              <CardDescription>
                Acompanhe suas conversas mais recentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversas.map((conversa) => (
                  <div 
                    key={conversa.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-green-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        {conversa.tipo === "Grupo" ? (
                          <Users className="w-6 h-6 text-white" />
                        ) : (
                          <span className="text-white font-semibold">
                            {conversa.contato.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{conversa.contato}</h4>
                          {conversa.status === "Não lida" && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{conversa.telefone}</p>
                        <p className="text-sm text-gray-700 truncate max-w-md">{conversa.ultimaMensagem}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{conversa.horario}</p>
                      <Badge className={conversa.tipo === "Grupo" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                        {conversa.tipo}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campanhas" className="space-y-6">
          {/* Lista de Campanhas */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Campanhas WhatsApp
              </CardTitle>
              <CardDescription>
                Acompanhe o desempenho das suas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Entregues</TableHead>
                    <TableHead>Lidas</TableHead>
                    <TableHead>Respondidas</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campanhas.map((campanha) => (
                    <TableRow key={campanha.id} className="hover:bg-green-50/50">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">{campanha.titulo}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">{campanha.mensagem}</p>
                          <p className="text-xs text-gray-500">{campanha.enviadoEm}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(campanha.status)} border flex items-center gap-1 w-fit`}>
                          {getStatusIcon(campanha.status)}
                          {campanha.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="font-semibold">{campanha.destinatarios}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-600">{campanha.entregues}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">{campanha.lidas}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-purple-600">{campanha.respondidas}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="hover:bg-green-50">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Relatório
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráficos de analytics serão implementados aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nova-campanha" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Nova Campanha WhatsApp
              </CardTitle>
              <CardDescription>
                Crie uma nova campanha de mensagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Título da Campanha</label>
                <Input placeholder="Ex: Convite Audiência Pública" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Mensagem</label>
                <Textarea 
                  placeholder="Digite sua mensagem aqui..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Data de Envio</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Horário</label>
                  <Input type="time" />
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Agora
                </Button>
                <Button variant="outline">
                  Agendar
                </Button>
                <Button variant="outline">
                  Salvar Rascunho
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsApp;
