
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  Eye,
  Edit,
  Trash2,
  Video,
  Phone
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
  tipo: string;
  local: string;
  participantes: string[];
  status: string;
  cor: string;
  lembrete: boolean;
}

const Agenda = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [eventos, setEventos] = useState<Evento[]>([
    {
      id: 1,
      titulo: "Reunião com Líderes Comunitários",
      descricao: "Discussão sobre as demandas da região central",
      data: new Date(),
      horaInicio: "09:00",
      horaFim: "11:00",
      tipo: "reuniao",
      local: "Centro Comunitário Central",
      participantes: ["José Silva", "Maria Santos", "Carlos Oliveira"],
      status: "confirmado",
      cor: "bg-blue-500",
      lembrete: true
    },
    {
      id: 2,
      titulo: "Audiência Pública - Saúde",
      descricao: "Apresentação dos projetos para melhoria da saúde pública",
      data: new Date(Date.now() + 86400000), // amanhã
      horaInicio: "14:00",
      horaFim: "17:00",
      tipo: "audiencia",
      local: "Câmara Municipal",
      participantes: ["Secretário de Saúde", "Dr. Antonio", "Dra. Lucia"],
      status: "pendente",
      cor: "bg-green-500",
      lembrete: true
    },
    {
      id: 3,
      titulo: "Visita às Obras da Praça",
      descricao: "Acompanhamento do andamento das obras de revitalização",
      data: new Date(Date.now() + 172800000), // depois de amanhã
      horaInicio: "16:00",
      horaFim: "18:00",
      tipo: "visita",
      local: "Praça Central",
      participantes: ["Engenheiro Responsável", "Empreiteiro"],
      status: "confirmado",
      cor: "bg-purple-500",
      lembrete: false
    }
  ]);

  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    descricao: "",
    data: new Date(),
    horaInicio: "",
    horaFim: "",
    tipo: "",
    local: "",
    participantes: "",
    lembrete: true
  });

  const eventosDoSia = eventos.filter(evento => 
    selectedDate && isSameDay(evento.data, selectedDate)
  );

  const proximosEventos = eventos
    .filter(evento => evento.data >= new Date())
    .sort((a, b) => a.data.getTime() - b.data.getTime())
    .slice(0, 5);

  const diasComEventos = eventos.map(evento => evento.data);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "reuniao": return "bg-blue-100 text-blue-800 border-blue-200";
      case "audiencia": return "bg-green-100 text-green-800 border-green-200";
      case "evento": return "bg-purple-100 text-purple-800 border-purple-200";
      case "visita": return "bg-orange-100 text-orange-800 border-orange-200";
      case "videoconferencia": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800 border-green-200";
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelado": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSalvarEvento = () => {
    if (isEditMode && selectedEvent) {
      setEventos(prev => prev.map(evento => 
        evento.id === selectedEvent.id 
          ? {
              ...evento,
              ...novoEvento,
              participantes: novoEvento.participantes.split(',').map(p => p.trim()).filter(p => p)
            }
          : evento
      ));
    } else {
      const evento: Evento = {
        id: Date.now(),
        ...novoEvento,
        participantes: novoEvento.participantes.split(',').map(p => p.trim()).filter(p => p),
        status: "confirmado",
        cor: "bg-blue-500"
      };
      setEventos(prev => [...prev, evento]);
    }
    
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedEvent(null);
    setNovoEvento({
      titulo: "",
      descricao: "",
      data: new Date(),
      horaInicio: "",
      horaFim: "",
      tipo: "",
      local: "",
      participantes: "",
      lembrete: true
    });
  };

  const handleEditarEvento = (evento: Evento) => {
    setSelectedEvent(evento);
    setNovoEvento({
      titulo: evento.titulo,
      descricao: evento.descricao,
      data: evento.data,
      horaInicio: evento.horaInicio,
      horaFim: evento.horaFim,
      tipo: evento.tipo,
      local: evento.local,
      participantes: evento.participantes.join(', '),
      lembrete: evento.lembrete
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleExcluirEvento = (eventoId: number) => {
    setEventos(prev => prev.filter(evento => evento.id !== eventoId));
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
                  Agenda Política
                </h1>
                <p className="text-gray-600">
                  Gerencie compromissos, reuniões e eventos da sua agenda
                </p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Eventos Hoje", valor: eventosDoSia.length.toString(), cor: "from-blue-500 to-blue-600", icon: CalendarIcon },
              { label: "Esta Semana", valor: "12", cor: "from-green-500 to-green-600", icon: Clock },
              { label: "Confirmados", valor: eventos.filter(e => e.status === 'confirmado').length.toString(), cor: "from-purple-500 to-purple-600", icon: Users },
              { label: "Lembretes", valor: eventos.filter(e => e.lembrete).length.toString(), cor: "from-orange-500 to-orange-600", icon: Bell }
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendário */}
            <Card className="lg:col-span-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    booked: diasComEventos
                  }}
                  modifiersStyles={{
                    booked: { 
                      backgroundColor: '#3b82f6', 
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Eventos do Dia Selecionado */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Eventos de {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </CardTitle>
                <CardDescription>
                  {eventosDoSia.length} evento(s) programado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {eventosDoSia.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum evento programado para este dia</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventosDoSia.map((evento) => (
                      <Card key={evento.id} className="border border-gray-200 hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{evento.titulo}</h4>
                                <Badge className={getTipoColor(evento.tipo)}>
                                  {evento.tipo}
                                </Badge>
                                <Badge className={getStatusColor(evento.status)}>
                                  {evento.status}
                                </Badge>
                                {evento.lembrete && <Bell className="w-4 h-4 text-orange-500" />}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{evento.descricao}</p>
                              
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {evento.horaInicio} - {evento.horaFim}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {evento.local}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {evento.participantes.length} participante(s)
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-1 ml-4">
                              <Button size="sm" variant="outline" onClick={() => handleEditarEvento(evento)}>
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleExcluirEvento(evento.id)}>
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Próximos Eventos */}
          <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proximosEventos.map((evento) => (
                  <Card key={evento.id} className="border border-gray-200 hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{evento.titulo}</h4>
                        <Badge className={getTipoColor(evento.tipo)} size="sm">
                          {evento.tipo}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {format(evento.data, "dd/MM/yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {evento.horaInicio}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {evento.local}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modal de Evento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edite as informações do evento" : "Cadastre um novo evento na sua agenda"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={novoEvento.titulo}
                  onChange={(e) => setNovoEvento(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Título do evento"
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de Evento *</Label>
                <Select value={novoEvento.tipo} onValueChange={(value) => setNovoEvento(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="audiencia">Audiência Pública</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="visita">Visita</SelectItem>
                    <SelectItem value="videoconferencia">Videoconferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="horaInicio">Hora Início *</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={novoEvento.horaInicio}
                    onChange={(e) => setNovoEvento(prev => ({ ...prev, horaInicio: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="horaFim">Hora Fim *</Label>
                  <Input
                    id="horaFim"
                    type="time"
                    value={novoEvento.horaFim}
                    onChange={(e) => setNovoEvento(prev => ({ ...prev, horaFim: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="local">Local *</Label>
                <Input
                  id="local"
                  value={novoEvento.local}
                  onChange={(e) => setNovoEvento(prev => ({ ...prev, local: e.target.value }))}
                  placeholder="Local do evento"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novoEvento.descricao}
                  onChange={(e) => setNovoEvento(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descrição do evento"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="participantes">Participantes</Label>
                <Textarea
                  id="participantes"
                  value={novoEvento.participantes}
                  onChange={(e) => setNovoEvento(prev => ({ ...prev, participantes: e.target.value }))}
                  placeholder="Nome dos participantes (separados por vírgula)"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lembrete">Configurar lembrete</Label>
                <input
                  id="lembrete"
                  type="checkbox"
                  checked={novoEvento.lembrete}
                  onChange={(e) => setNovoEvento(prev => ({ ...prev, lembrete: e.target.checked }))}
                  className="rounded"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarEvento}>
              {isEditMode ? "Salvar Alterações" : "Criar Evento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Agenda;
