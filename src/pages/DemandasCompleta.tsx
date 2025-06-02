
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  MapPin,
  Calendar,
  FileText,
  Edit,
  Trash2
} from "lucide-react";
import { useDemandas, type Demanda } from "@/hooks/useDemandas";
import { useToast } from "@/hooks/use-toast";

const DemandasCompleta = () => {
  const { demandas, loading, createDemanda, updateDemanda, deleteDemanda } = useDemandas();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDemanda, setEditingDemanda] = useState<Demanda | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    prioridade: "media",
    status: "pendente",
    solicitante: "",
    zona: "",
    data_limite: ""
  });

  const filteredDemandas = demandas.filter(demanda =>
    demanda.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.solicitante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingDemanda) {
        await updateDemanda(editingDemanda.id, formData);
        toast({
          title: "Sucesso",
          description: "Demanda atualizada com sucesso!"
        });
      } else {
        await createDemanda(formData);
        toast({
          title: "Sucesso",
          description: "Demanda criada com sucesso!"
        });
      }
      
      setIsDialogOpen(false);
      setEditingDemanda(null);
      setFormData({
        titulo: "",
        descricao: "",
        categoria: "",
        prioridade: "media",
        status: "pendente",
        solicitante: "",
        zona: "",
        data_limite: ""
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar demanda",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (demanda: Demanda) => {
    setEditingDemanda(demanda);
    setFormData({
      titulo: demanda.titulo,
      descricao: demanda.descricao || "",
      categoria: demanda.categoria || "",
      prioridade: demanda.prioridade,
      status: demanda.status,
      solicitante: demanda.solicitante || "",
      zona: demanda.zona || "",
      data_limite: demanda.data_limite || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta demanda?")) {
      const success = await deleteDemanda(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Demanda deletada com sucesso!"
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "em_andamento": return "bg-blue-100 text-blue-800 border-blue-200";
      case "concluida": return "bg-green-100 text-green-800 border-green-200";
      case "cancelada": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-800 border-red-200";
      case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente": return <Clock className="w-4 h-4" />;
      case "em_andamento": return <AlertCircle className="w-4 h-4" />;
      case "concluida": return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Demandas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie solicitações e demandas da comunidade
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingDemanda(null);
              setFormData({
                titulo: "",
                descricao: "",
                categoria: "",
                prioridade: "media",
                status: "pendente",
                solicitante: "",
                zona: "",
                data_limite: ""
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Demanda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDemanda ? 'Editar Demanda' : 'Nova Demanda'}</DialogTitle>
              <DialogDescription>
                {editingDemanda ? 'Edite as informações da demanda' : 'Adicione uma nova demanda'}
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
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select value={formData.prioridade} onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
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
                
                <div className="space-y-2">
                  <Label htmlFor="zona">Zona</Label>
                  <Input
                    id="zona"
                    value={formData.zona}
                    onChange={(e) => setFormData(prev => ({ ...prev, zona: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="solicitante">Solicitante</Label>
                  <Input
                    id="solicitante"
                    value={formData.solicitante}
                    onChange={(e) => setFormData(prev => ({ ...prev, solicitante: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data_limite">Data Limite</Label>
                  <Input
                    id="data_limite"
                    type="date"
                    value={formData.data_limite}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_limite: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingDemanda ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="lista" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Demandas</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar demandas..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                label: "Total", 
                valor: demandas.length.toString(), 
                cor: "from-indigo-500 to-indigo-600", 
                icon: FileText 
              },
              { 
                label: "Pendentes", 
                valor: demandas.filter(d => d.status === 'pendente').length.toString(), 
                cor: "from-yellow-500 to-yellow-600", 
                icon: Clock 
              },
              { 
                label: "Em Andamento", 
                valor: demandas.filter(d => d.status === 'em_andamento').length.toString(), 
                cor: "from-blue-500 to-blue-600", 
                icon: AlertCircle 
              },
              { 
                label: "Concluídas", 
                valor: demandas.filter(d => d.status === 'concluida').length.toString(), 
                cor: "from-green-500 to-green-600", 
                icon: CheckCircle 
              }
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                      <stat.icon className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.valor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabela de Demandas */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Demandas</CardTitle>
              <CardDescription>
                Acompanhe todas as demandas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Demanda</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDemandas.map((demanda) => (
                    <TableRow key={demanda.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{demanda.titulo}</p>
                          {demanda.descricao && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">{demanda.descricao}</p>
                          )}
                          {demanda.zona && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {demanda.zona}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {demanda.solicitante ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{demanda.solicitante}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(demanda.status)} border flex items-center gap-1 w-fit`}>
                          {getStatusIcon(demanda.status)}
                          {demanda.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPrioridadeColor(demanda.prioridade)} border`}>
                          {demanda.prioridade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{demanda.categoria || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(demanda.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(demanda)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(demanda.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas">
          <Card>
            <CardContent className="p-6">
              <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Gráficos de estatísticas serão implementados aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredDemandas.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Nenhuma demanda encontrada com este termo de busca.' : 'Nenhuma demanda cadastrada ainda.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DemandasCompleta;
