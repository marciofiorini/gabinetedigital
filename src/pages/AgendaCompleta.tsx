
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Plus, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { format, addHours, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  data_hora: string;
  tipo: string;
  user_id: string;
  google_event_id: string | null;
  sincronizado: boolean;
  created_at: string;
  updated_at: string;
}

export default function AgendaCompleta() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_hora: '',
    tipo: 'reuniao'
  });

  const fetchEventos = async (date?: Date) => {
    if (!user) return;

    try {
      setLoading(true);
      const targetDate = date || selectedDate;
      const startDate = startOfDay(targetDate);
      const endDate = endOfDay(targetDate);

      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('user_id', user.id)
        .gte('data_hora', startDate.toISOString())
        .lte('data_hora', endDate.toISOString())
        .order('data_hora', { ascending: true });

      if (error) throw error;
      setEventos(data || []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingEvent) {
        // Atualizar evento existente
        const { error } = await supabase
          .from('eventos')
          .update({
            titulo: formData.titulo,
            descricao: formData.descricao,
            data_hora: formData.data_hora,
            tipo: formData.tipo,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id);

        if (error) throw error;

        toast({
          title: 'Evento atualizado',
          description: 'O evento foi atualizado com sucesso.'
        });
      } else {
        // Criar novo evento
        const { error } = await supabase
          .from('eventos')
          .insert({
            titulo: formData.titulo,
            descricao: formData.descricao,
            data_hora: formData.data_hora,
            tipo: formData.tipo,
            user_id: user.id
          });

        if (error) throw error;

        toast({
          title: 'Evento criado',
          description: 'O evento foi criado com sucesso.'
        });
      }

      // Reset form and close dialog
      setFormData({ titulo: '', descricao: '', data_hora: '', tipo: 'reuniao' });
      setEditingEvent(null);
      setIsDialogOpen(false);
      fetchEventos();
    } catch (error: any) {
      console.error('Erro ao salvar evento:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar o evento.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (evento: Evento) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', evento.id);

      if (error) throw error;

      toast({
        title: 'Evento excluído',
        description: 'O evento foi excluído com sucesso.'
      });

      fetchEventos();
    } catch (error: any) {
      console.error('Erro ao excluir evento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o evento.',
        variant: 'destructive'
      });
    }
  };

  const openEditDialog = (evento: Evento) => {
    setEditingEvent(evento);
    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao || '',
      data_hora: evento.data_hora,
      tipo: evento.tipo
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingEvent(null);
    setFormData({
      titulo: '',
      descricao: '',
      data_hora: format(addHours(selectedDate, 9), "yyyy-MM-dd'T'HH:mm"),
      tipo: 'reuniao'
    });
    setIsDialogOpen(true);
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'reuniao': return 'bg-blue-100 text-blue-800';
      case 'evento': return 'bg-green-100 text-green-800';
      case 'tarefa': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'reuniao': return 'Reunião';
      case 'evento': return 'Evento';
      case 'tarefa': return 'Tarefa';
      default: return tipo;
    }
  };

  useEffect(() => {
    if (user) {
      fetchEventos();
    }
  }, [user, selectedDate]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-gray-600">Gerencie seus eventos e compromissos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Editar Evento' : 'Novo Evento'}
              </DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Atualize as informações do evento.' : 'Crie um novo evento na sua agenda.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título do evento"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição opcional"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_hora">Data e Hora *</Label>
                <Input
                  id="data_hora"
                  type="datetime-local"
                  value={formData.data_hora}
                  onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="tarefa">Tarefa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Atualizar' : 'Criar'} Evento
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Lista de Eventos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Eventos - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
              </CardTitle>
              <CardDescription>
                {eventos.length === 0 
                  ? 'Nenhum evento agendado para este dia'
                  : `${eventos.length} evento(s) agendado(s)`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Carregando eventos...</p>
                </div>
              ) : eventos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum evento para este dia</p>
                  <Button variant="outline" className="mt-4" onClick={openNewDialog}>
                    Criar primeiro evento
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {eventos.map((evento) => (
                    <div key={evento.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{evento.titulo}</h3>
                            <Badge className={getTipoColor(evento.tipo)}>
                              {getTipoLabel(evento.tipo)}
                            </Badge>
                            {evento.sincronizado && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Sincronizado
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(evento.data_hora), 'HH:mm', { locale: ptBR })}
                            </div>
                          </div>
                          {evento.descricao && (
                            <p className="text-sm text-gray-600">{evento.descricao}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(evento)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(evento)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
