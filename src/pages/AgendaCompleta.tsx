
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, Plus, Filter, Search, Edit, Trash2 } from "lucide-react";
import { useEventos, type Evento } from "@/hooks/useEventos";
import { useToast } from "@/hooks/use-toast";

const AgendaCompleta = () => {
  const { eventos, loading, createEvento, updateEvento, deleteEvento } = useEventos();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data_hora: "",
    tipo: "reuniao"
  });

  const filteredEventos = eventos.filter(evento =>
    evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.data_hora) {
      toast({
        title: "Erro",
        description: "Título e data/hora são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingEvento) {
        await updateEvento(editingEvento.id, formData);
        toast({
          title: "Sucesso",
          description: "Evento atualizado com sucesso!"
        });
      } else {
        await createEvento(formData);
        toast({
          title: "Sucesso",
          description: "Evento criado com sucesso!"
        });
      }
      
      setIsDialogOpen(false);
      setEditingEvento(null);
      setFormData({
        titulo: "",
        descricao: "",
        data_hora: "",
        tipo: "reuniao"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar evento",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento);
    const dataHora = new Date(evento.data_hora);
    const formattedDateTime = new Date(dataHora.getTime() - dataHora.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    
    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao || "",
      data_hora: formattedDateTime,
      tipo: evento.tipo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este evento?")) {
      const success = await deleteEvento(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Evento deletado com sucesso!"
        });
      }
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "reuniao": return "bg-blue-100 text-blue-800 border-blue-200";
      case "visita": return "bg-purple-100 text-purple-800 border-purple-200";
      case "audiencia": return "bg-orange-100 text-orange-800 border-orange-200";
      case "evento": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const eventosHoje = eventos.filter(evento => {
    const hoje = new Date().toDateString();
    const eventoDate = new Date(evento.data_hora).toDateString();
    return hoje === eventoDate;
  });

  const proximosEventos = eventos.filter(evento => {
    const hoje = new Date();
    const eventoDate = new Date(evento.data_hora);
    return eventoDate > hoje;
  }).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Agenda
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus compromissos e eventos políticos
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingEvento(null);
              setFormData({
                titulo: "",
                descricao: "",
                data_hora: "",
                tipo: "reuniao"
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingEvento ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
              <DialogDescription>
                {editingEvento ? 'Edite as informações do evento' : 'Adicione um novo evento à sua agenda'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data_hora">Data e Hora *</Label>
                  <Input
                    id="data_hora"
                    type="datetime-local"
                    value={formData.data_hora}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_hora: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reuniao">Reunião</SelectItem>
                      <SelectItem value="visita">Visita</SelectItem>
                      <SelectItem value="audiencia">Audiência</SelectItem>
                      <SelectItem value="evento">Evento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingEvento ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center mr-4">
                <Calendar className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Eventos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{eventos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-4">
                <Clock className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Eventos Hoje</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{eventosHoje.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                <Users className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Próximos Eventos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{proximosEventos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Eventos */}
      <div className="grid gap-6">
        {filteredEventos.map((evento) => {
          const { date, time } = formatDateTime(evento.data_hora);
          
          return (
            <Card key={evento.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{evento.titulo}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={`${getTipoColor(evento.tipo)} border`}>
                        {evento.tipo}
                      </Badge>
                    </div>
                    {evento.descricao && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{evento.descricao}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(evento)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(evento.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>{time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEventos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Nenhum evento encontrado com este termo de busca.' : 'Nenhum evento cadastrado ainda.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgendaCompleta;
