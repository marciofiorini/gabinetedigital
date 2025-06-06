
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTicketsAtendimento } from "@/hooks/useTicketsAtendimento";
import { Plus, Search, Filter, MessageSquare, Clock, User, AlertCircle } from "lucide-react";
import { NovoTicketModal } from "./NovoTicketModal";
import { TicketDetailsModal } from "./TicketDetailsModal";

export const CentralAtendimento = () => {
  const { tickets, loading } = useTicketsAtendimento();
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [ticketSelecionado, setTicketSelecionado] = useState<any>(null);

  const ticketsFiltrados = tickets.filter(ticket => {
    const matchesFiltro = ticket.assunto.toLowerCase().includes(filtro.toLowerCase()) ||
                         ticket.numero_ticket.toLowerCase().includes(filtro.toLowerCase());
    const matchesStatus = statusFiltro === "todos" || ticket.status === statusFiltro;
    return matchesFiltro && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return "bg-blue-100 text-blue-800";
      case 'em_andamento': return "bg-yellow-100 text-yellow-800";
      case 'aguardando_resposta': return "bg-orange-100 text-orange-800";
      case 'resolvido': return "bg-green-100 text-green-800";
      case 'fechado': return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return "text-red-600";
      case 'alta': return "text-orange-600";
      case 'media': return "text-yellow-600";
      case 'baixa': return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getStatusStats = () => {
    return {
      total: tickets.length,
      abertos: tickets.filter(t => t.status === 'aberto').length,
      em_andamento: tickets.filter(t => t.status === 'em_andamento').length,
      resolvidos: tickets.filter(t => t.status === 'resolvido').length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Central de Atendimento</h2>
          <p className="text-gray-600">Gerencie tickets e solicitações de suporte</p>
        </div>
        <Button onClick={() => setModalNovoAberto(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Abertos</p>
                <p className="text-2xl font-bold text-red-600">{stats.abertos}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.em_andamento}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolvidos</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvidos}</p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por assunto ou número do ticket..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="todos">Todos os Status</option>
          <option value="aberto">Aberto</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="aguardando_resposta">Aguardando Resposta</option>
          <option value="resolvido">Resolvido</option>
          <option value="fechado">Fechado</option>
        </select>
      </div>

      {/* Lista de Tickets */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {ticketsFiltrados.map((ticket) => (
            <Card 
              key={ticket.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setTicketSelecionado(ticket)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{ticket.assunto}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <span className={`text-sm font-medium ${getPrioridadeColor(ticket.prioridade)}`}>
                        {ticket.prioridade}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>#{ticket.numero_ticket}</span>
                      <span>{ticket.categoria}</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {ticket.canal}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {ticketsFiltrados.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum ticket encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {filtro ? "Tente ajustar seus filtros" : "Comece criando seu primeiro ticket"}
            </p>
            <Button onClick={() => setModalNovoAberto(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Ticket
            </Button>
          </CardContent>
        </Card>
      )}

      <NovoTicketModal 
        isOpen={modalNovoAberto} 
        onClose={() => setModalNovoAberto(false)} 
      />

      {ticketSelecionado && (
        <TicketDetailsModal 
          ticket={ticketSelecionado}
          isOpen={!!ticketSelecionado}
          onClose={() => setTicketSelecionado(null)}
        />
      )}
    </div>
  );
};
