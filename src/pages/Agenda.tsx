
import { Calendar, Clock, MapPin, Users, Plus, Filter, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Agenda = () => {
  const eventos = [
    {
      id: 1,
      titulo: "Reunião com Líderes Comunitários",
      data: "2024-05-28",
      hora: "14:00",
      local: "Centro Comunitário da Zona Sul",
      participantes: 15,
      tipo: "Reunião",
      status: "Confirmado"
    },
    {
      id: 2,
      titulo: "Visita ao Hospital Municipal",
      data: "2024-05-29",
      hora: "09:30",
      local: "Hospital Municipal São João",
      participantes: 8,
      tipo: "Visita",
      status: "Pendente"
    },
    {
      id: 3,
      titulo: "Audiência Pública - Mobilidade Urbana",
      data: "2024-05-30",
      hora: "19:00",
      local: "Câmara Municipal",
      participantes: 120,
      tipo: "Audiência",
      status: "Confirmado"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado": return "bg-green-100 text-green-800 border-green-200";
      case "Pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelado": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Reunião": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Visita": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Audiência": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Agenda
          </h1>
          <p className="text-gray-600">
            Gerencie seus compromissos e eventos políticos
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar eventos..."
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

      {/* Lista de Eventos */}
      <div className="grid gap-6">
        {eventos.map((evento) => (
          <Card key={evento.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{evento.titulo}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={`${getTipoColor(evento.tipo)} border`}>
                      {evento.tipo}
                    </Badge>
                    <Badge className={`${getStatusColor(evento.status)} border`}>
                      {evento.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>{evento.data}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>{evento.hora}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>{evento.participantes} participantes</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>{evento.local}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="hover:bg-indigo-50">
                  Editar
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Agenda;
