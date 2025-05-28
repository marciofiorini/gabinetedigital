
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NovaDemandaModal } from '@/components/NovaDemandaModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Demanda {
  id: string;
  titulo: string;
  descricao: string;
  zona: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  categoria: string;
  solicitante: string;
  data_limite: string;
  created_at: string;
}

export default function Demandas() {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDemandas();
  }, [statusFilter, priorityFilter]);

  const fetchDemandas = async () => {
    try {
      let query = supabase
        .from('demandas')
        .select('*')
        .ilike('titulo', `%${search}%`);

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (priorityFilter && priorityFilter !== 'all') {
        query = query.eq('prioridade', priorityFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar demandas:', error);
        toast({
          title: 'Erro ao buscar demandas',
          description: 'Ocorreu um erro ao carregar as demandas.',
          variant: 'destructive',
        });
        return;
      }

      // Type assertion to ensure compatibility with our Demanda interface
      const typedDemandas = (data || []).map(item => ({
        ...item,
        prioridade: item.prioridade as 'baixa' | 'media' | 'alta' | 'urgente',
        status: item.status as 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'
      }));

      setDemandas(typedDemandas);
    } catch (error) {
      console.error('Erro ao buscar demandas:', error);
      toast({
        title: 'Erro ao buscar demandas',
        description: 'Ocorreu um erro ao carregar as demandas.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('demandas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar demanda:', error);
        toast({
          title: 'Erro ao deletar demanda',
          description: 'Ocorreu um erro ao deletar a demanda.',
          variant: 'destructive',
        });
        return;
      }

      setDemandas(demandas.filter((demanda) => demanda.id !== id));
      toast({
        title: 'Demanda deletada',
        description: 'A demanda foi deletada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao deletar demanda:', error);
      toast({
        title: 'Erro ao deletar demanda',
        description: 'Ocorreu um erro ao deletar a demanda.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Demandas</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Demanda
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="search"
          placeholder="Buscar demanda..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchDemandas();
          }}
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Prioridades</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demandas.map((demanda) => (
          <Card key={demanda.id}>
            <CardHeader>
              <CardTitle>{demanda.titulo}</CardTitle>
              <CardDescription>{demanda.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Zona: {demanda.zona}</span>
                <Badge>{demanda.prioridade}</Badge>
              </div>
              <span>Status: {demanda.status}</span>
              <span>Solicitante: {demanda.solicitante}</span>
              <span>Data Limite: {demanda.data_limite}</span>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(demanda.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NovaDemandaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
