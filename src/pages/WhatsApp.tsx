
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Plus, Send, Clock, Users, MessageCircle, Calendar, TrendingUp, Eye } from "lucide-react";

const WhatsApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const grupos = [
    {
      id: 1,
      nome: "Líderes - Centro",
      membros: 45,
      ativos: 38,
      mensagensHoje: 12,
      ultimaAtividade: "2 min atrás",
      status: "Ativo",
      categoria: "Liderança"
    },
    {
      id: 2,
      nome: "Moradores - Zona Norte",
      membros: 128,
      ativos: 95,
      mensagensHoje: 28,
      ultimaAtividade: "5 min atrás",
      status: "Ativo",
      categoria: "Comunidade"
    },
    {
      id: 3,
      nome: "Comerciantes - Centro",
      membros: 67,
      ativos: 52,
      mensagensHoje: 8,
      ultimaAtividade: "1 hora atrás",
      status: "Moderado",
      categoria: "Comercial"
    }
  ];

  const campanhas = [
    {
      id: 1,
      titulo: "Aniversários do Mês",
      tipo: "Automática",
      agendamento: "Diário às 09:00",
      proximoEnvio: "Amanhã, 09:00",
      destinatarios: 15,
      status: "Ativa"
    },
    {
      id: 2,
      titulo: "Relatório Semanal",
      tipo: "Agendada",
      agendamento: "Sextas às 18:00",
      proximoEnvio: "Sexta, 18:00",
      destinatarios: 234,
      status: "Ativa"
    },
    {
      id: 3,
      titulo: "Convite Audiência Pública",
      tipo: "Única",
      agendamento: "Hoje às 14:00",
      proximoEnvio: "Hoje, 14:00",
      destinatarios: 189,
      status: "Pendente"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-teal-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Gestão WhatsApp
                </h1>
                <p className="text-gray-600">
                  Gerencie grupos, campanhas e mensagens automáticas
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="hover:bg-green-50 hover:border-green-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Mensagem
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Campanha
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Grupos Ativos", valor: "18", icone: Users, cor: "from-green-500 to-green-600" },
              { label: "Mensagens Hoje", valor: "156", icone: MessageCircle, cor: "from-blue-500 to-blue-600" },
              { label: "Taxa de Abertura", valor: "87%", icone: Eye, cor: "from-purple-500 to-purple-600" },
              { label: "Campanhas Ativas", valor: "8", icone: Send, cor: "from-orange-500 to-orange-600" }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                      <stat.icone className="text-white w-6 h-6" />
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Grupos */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Grupos WhatsApp
                </CardTitle>
                <CardDescription>
                  Monitore a atividade dos seus grupos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grupos.map((grupo) => (
                    <Card key={grupo.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{grupo.nome}</h4>
                            <p className="text-sm text-gray-600">{grupo.categoria}</p>
                          </div>
                          <Badge className={grupo.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {grupo.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">{grupo.membros}</p>
                            <p className="text-xs text-gray-500">Membros</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{grupo.ativos}</p>
                            <p className="text-xs text-gray-500">Ativos</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">{grupo.mensagensHoje}</p>
                            <p className="text-xs text-gray-500">Msgs Hoje</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Engajamento</span>
                            <span>{Math.round((grupo.ativos / grupo.membros) * 100)}%</span>
                          </div>
                          <Progress value={(grupo.ativos / grupo.membros) * 100} className="h-2" />
                        </div>

                        <p className="text-xs text-gray-500 mb-3">
                          Última atividade: {grupo.ultimaAtividade}
                        </p>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Análise
                          </Button>
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <Send className="w-3 h-3 mr-1" />
                            Enviar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campanhas */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  Campanhas e Agendamentos
                </CardTitle>
                <CardDescription>
                  Mensagens programadas e automáticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campanhas.map((campanha) => (
                    <Card key={campanha.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{campanha.titulo}</h4>
                            <p className="text-sm text-gray-600">{campanha.tipo}</p>
                          </div>
                          <Badge className={
                            campanha.status === 'Ativa' ? 'bg-green-100 text-green-800' :
                            campanha.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {campanha.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {campanha.agendamento}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {campanha.proximoEnvio}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {campanha.destinatarios} destinatários
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Editar
                          </Button>
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            {campanha.status === 'Pendente' ? 'Enviar Agora' : 'Ver Relatório'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WhatsApp;
