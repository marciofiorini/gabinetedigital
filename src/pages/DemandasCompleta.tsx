
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDemandas, DemandaStatus, DemandaPrioridade } from '@/hooks/useDemandas';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function DemandasCompleta() {
  const { demandas, loading, createDemanda, updateDemanda, deleteDemanda } = useDemandas();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [novaDemanda, setNovaDemanda] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    prioridade: 'media' as DemandaPrioridade,
    status: 'pendente' as DemandaStatus,
    solicitante: '',
    zona: '',
    data_limite: ''
  });

  const handleCreateDemanda = async () => {
    try {
      await createDemanda(novaDemanda);
      setIsDialogOpen(false);
      setNovaDemanda({
        titulo: '',
        descricao: '',
        categoria: '',
        prioridade: 'media',
        status: 'pendente',
        solicitante: '',
        zona: '',
        data_limite: ''
      });
      toast({
        title: "Sucesso",
        description: "Demanda adicionada com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getPrioridadeColor = (prioridade: DemandaPrioridade) => {
    switch (prioridade) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: DemandaStatus) => {
    switch (status) {
      case 'pendente': return 'bg-gray-100 text-gray-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDemandas = demandas.filter(demanda => 
    demanda.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.solicitante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.zona?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandas Completa</h1>
          <p className="text-gray-600">Gerencie todas as demandas e solicitações</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Demanda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Demanda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={novaDemanda.titulo}
                  onChange={(e) => setNovaDemanda(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Título da demanda"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={novaDemanda.descricao}
                  onChange={(e) => setNovaDemanda(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descrição detalhada"
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <Input
                  value={novaDemanda.categoria}
                  onChange={(e) => setNovaDemanda(prev => ({ ...prev, categoria: e.target.value }))}
                  placeholder="Ex: Saúde, Educação, Infraestrutura"
                />
              </div>
              <div>
                <Label>Prioridade</Label>
                <Select value={novaDemanda.prioridade} onValueChange={(value: DemandaPrioridade) => setNovaDemanda(prev => ({ ...prev, prioridade: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={novaDemanda.status} onValueChange={(value: DemandaStatus) => setNovaDemanda(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Solicitante</Label>
                <Input
                  value={novaDemanda.solicitante}
                  onChange={(e) => setNovaDemanda(prev => ({ ...prev, solicitante: e.target.value }))}
                  placeholder="Nome do solicitante"
                />
              </div>
              <div>
                <Label>Zona</Label>
                <Input
                  value={novaDemanda.zona}
                  onChange={(e) => setNovaDemanda(prev => ({ ...prev, zona: e.target.value }))}
                  placeholder="Ex: Zona Norte"
                />
              </div>
              <div>
                <Label>Data Limite</Label>
                <Input
                  type="date"
                  value={novaDemanda.data_limite}
                  onChange={(e) => setNovaDemanda(prev => ({ ...prev, data_limite: e.target.value }))}
                />
              </div>
              <Button onClick={handleCreateDemanda} className="w-full">
                Adicionar Demanda
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Todas as Demandas
          </CardTitle>
          <CardDescription>
            {demandas.length} demanda(s) cadastrada(s)
          </CardDescription>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar demandas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <div className="space-y-4">
              {filteredDemandas.map((demanda) => (
                <div key={demanda.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{demanda.titulo}</h3>
                        <Badge className={getPrioridadeColor(demanda.prioridade)}>
                          {demanda.prioridade}
                        </Badge>
                        <Badge className={getStatusColor(demanda.status)}>
                          {demanda.status}
                        </Badge>
                        {demanda.categoria && (
                          <Badge variant="outline">{demanda.categoria}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{demanda.descricao}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        {demanda.solicitante && (
                          <p className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {demanda.solicitante}
                          </p>
                        )}
                        {demanda.zona && (
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {demanda.zona}
                          </p>
                        )}
                        {demanda.data_limite && (
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Prazo: {new Date(demanda.data_limite).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteDemanda(demanda.id)}
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
  );
}
