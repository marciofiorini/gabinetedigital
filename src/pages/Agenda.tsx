
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Plus, Calendar, Clock, MapPin, Users, Video, Phone } from "lucide-react";

const Agenda = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const eventos = [
    {
      id: 1,
      titulo: "Audiência Pública - Mobilidade Urbana",
      data: "2024-05-28",
      hora: "14:00",
      duracao: "2 horas",
      local: "Assembleia Legislativa - Plenário 1",
      tipo: "Presencial",
      participantes: 45,
      status: "Confirmado",
      categoria: "Audiência"
    },
    {
      id: 2,
      titulo: "Reunião com Prefeitos da Região",
      data: "2024-05-29",
      hora: "09:00",
      duracao: "3 horas",
      local: "Sala de Reuniões - Gabinete",
      tipo: "Presencial",
      participantes: 12,
      status: "Confirmado",
      categoria: "Reunião"
    },
    {
      id: 3,
      titulo: "Live Instagram - Prestação de Contas",
      data: "2024-05-30",
      hora: "18:00",
      duracao: "1 hora",
      local: "Estúdio de Gravação",
      tipo: "Virtual",
      participantes: 0,
      status: "Agendado",
      categoria: "Live"
    },
    {
      id: 4,
      titulo: "Visita à Obra da Nova Escola",
      data: "2024-05-31",
      hora: "10:30",
      duracao: "1.5 horas",
      local: "Rua das Palmeiras, 500",
      tipo: "Presencial",
      participantes: 8,
      status: "Pendente",
      categoria: "Visita"
    }
  ];

  const hoje = new Date().toISOString().split('T')[0];
  const eventosHoje = eventos.filter(evento => evento.data === hoje);
  const proximosEventos = eventos.filter(evento => evento.data > hoje);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Virtual": return Video;
      case "Presencial": return MapPin;
      default: return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado": return "bg-green-100 text-green-800 border-green-200";
      case "Agendado": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "Audiência": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Reunião": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Live": return "bg-pink-100 text-pink-800 border-pink-200";
      case "Visita": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Agenda Interativa
                </h1>
                <p className="text-gray-600">
                  Gerencie eventos presenciais e virtuais
                </p>
              </div>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Eventos do Mês", valor: "23", icone: Calendar, cor: "from-indigo-500 to-indigo-600" },
              { label: "Hoje", valor: eventosHoje.length.toString(), icone: Clock, cor: "from-blue-500 to-blue-600" },
              { label: "Próximos", valor: proximosEventos.length.toString(), icone: Calendar, cor: "from-purple-500 to-purple-600" },
              { label: "Confirmados", valor: eventos.filter(e => e.status === 'Confirmado').length.toString(), icone: Users, cor: "from-green-500 to-green-600" }
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

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Eventos de Hoje */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Hoje
                </CardTitle>
                <CardDescription>
                  Eventos programados para hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                {eventosHoje.length > 0 ? (
                  <div className="space-y-3">
                    {eventosHoje.map((evento) => {
                      const TipoIcon = getTipoIcon(evento.tipo);
                      return (
                        <Card key={evento.id} className="border border-blue-100 shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm text-gray-900">{evento.titulo}</h4>
                              <TipoIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{evento.hora} - {evento.duracao}</p>
                            <p className="text-xs text-gray-600 mb-3 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {evento.local}
                            </p>
                            <Badge className={getStatusColor(evento.status)}>
                              {evento.status}
                            </Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum evento hoje</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Próximos Eventos */}
            <Card className="xl:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Próximos Eventos
                </CardTitle>
                <CardDescription>
                  Agenda dos próximos dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proximosEventos.map((evento) => {
                    const TipoIcon = getTipoIcon(evento.tipo);
                    return (
                      <Card key={evento.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getCategoriaColor(evento.categoria)}>
                                  {evento.categoria}
                                </Badge>
                                <Badge className={getStatusColor(evento.status)}>
                                  {evento.status}
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-2">{evento.titulo}</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {new Date(evento.data).toLocaleDateString('pt-BR')}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {evento.hora} ({evento.duracao})
                                </div>
                                <div className="flex items-center col-span-2">
                                  <TipoIcon className="w-4 h-4 mr-2" />
                                  {evento.local}
                                </div>
                              </div>
                              {evento.participantes > 0 && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Users className="w-4 h-4 mr-2" />
                                  {evento.participantes} participantes confirmados
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              Ver Detalhes
                            </Button>
                            <Button size="sm" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                              Editar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Gerencie sua agenda de forma eficiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-indigo-50 hover:border-indigo-300">
                  <Video className="w-6 h-6" />
                  Agendar Live
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300">
                  <Users className="w-6 h-6" />
                  Reunião Presencial
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300">
                  <Phone className="w-6 h-6" />
                  Videoconferência
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Agenda;
