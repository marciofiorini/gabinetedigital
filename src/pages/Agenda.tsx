import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Calendar } from "@/components/ui/calendar"
import { Plus, Calendar as CalendarIcon, Clock, X } from "lucide-react";

const Agenda = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [eventos, setEventos] = useState([
    {
      id: 1,
      titulo: "Reunião com a equipe",
      dataHora: "2024-05-30T10:00",
      tipo: "reuniao",
      descricao: "Discussão sobre o planejamento estratégico"
    },
    {
      id: 2,
      titulo: "Evento de lançamento",
      dataHora: "2024-06-05T19:00",
      tipo: "evento",
      descricao: "Lançamento do novo projeto"
    },
    {
      id: 3,
      titulo: "Ligação para o cliente",
      dataHora: "2024-05-31T14:30",
      tipo: "ligacao",
      descricao: "Apresentação da proposta"
    }
  ]);

  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    dataHora: "",
    tipo: "reuniao",
    descricao: ""
  });

  const adicionarEvento = () => {
    const novoId = eventos.length > 0 ? eventos[eventos.length - 1].id + 1 : 1;
    const novoEventoCompleto = { ...novoEvento, id: novoId };
    setEventos([...eventos, novoEventoCompleto]);
    setNovoEvento({ titulo: "", dataHora: "", tipo: "reuniao", descricao: "" });
  };

  const removerEvento = (id: number) => {
    setEventos(eventos.filter(evento => evento.id !== id));
  };

  const eventosHoje = eventos.filter(evento => {
    const dataEvento = new Date(evento.dataHora).toLocaleDateString();
    const dataSelecionada = selectedDate?.toLocaleDateString();
    return dataEvento === dataSelecionada;
  });

  const eventosProximos = eventos.filter(evento => {
    const dataEvento = new Date(evento.dataHora);
    const hoje = new Date();
    return dataEvento >= hoje;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-yellow-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Agenda
                </h1>
                <p className="text-gray-600">
                  Gerencie seus compromissos e eventos
                </p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </div>
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Calendário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Events Panel */}
            <div className="space-y-6">
              {/* Add Event */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Evento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Título do evento"
                    value={novoEvento.titulo}
                    onChange={(e) => setNovoEvento({...novoEvento, titulo: e.target.value})}
                  />
                  <Input
                    type="datetime-local"
                    value={novoEvento.dataHora}
                    onChange={(e) => setNovoEvento({...novoEvento, dataHora: e.target.value})}
                  />
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={novoEvento.tipo}
                    onChange={(e) => setNovoEvento({...novoEvento, tipo: e.target.value})}
                  >
                    <option value="reuniao">Reunião</option>
                    <option value="evento">Evento</option>
                    <option value="ligacao">Ligação</option>
                    <option value="visita">Visita</option>
                  </select>
                  <textarea
                    placeholder="Descrição..."
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={novoEvento.descricao}
                    onChange={(e) => setNovoEvento({...novoEvento, descricao: e.target.value})}
                  />
                  <Button 
                    onClick={adicionarEvento}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Adicionar Evento
                  </Button>
                </CardContent>
              </Card>

              {/* Today's Events */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-600 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Eventos de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eventosHoje.map((evento) => (
                      <div key={evento.id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">{evento.titulo}</h4>
                            <p className="text-xs text-gray-600">{evento.dataHora}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {evento.tipo}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {eventosHoje.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">
                        Nenhum evento para hoje
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Events */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventosProximos.map((evento) => (
                  <div key={evento.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{evento.titulo}</h4>
                      <Button
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removerEvento(evento.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{evento.descricao}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {evento.dataHora}
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        {evento.tipo}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {eventosProximos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum evento agendado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Agenda;
