import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search, Users, MapPin, Phone, Mail, Calendar, Eye, Edit, MessageCircle, Star, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContatosFicticios } from '@/hooks/useContatosFicticios';
import { useContatos } from '@/hooks/useContatos';
import { ContatoDetailsModalOriginal } from '@/components/contatos/ContatoDetailsModalOriginal';
import { EditContatoModal } from '@/components/contatos/EditContatoModal';

interface Contato {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  zona?: string;
  observacoes?: string;
  tags?: string[];
  data_nascimento?: string;
  created_at: string;
  updated_at?: string;
}

type SortField = 'nome' | 'score' | 'zona' | 'engajamento' | 'regiao';
type SortDirection = 'asc' | 'desc' | null;

const Contatos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { adicionandoDados } = useContatosFicticios();
  const { contatos, loading, createContato, updateContato, deleteContato } = useContatos();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroZona, setFiltroZona] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [contatoToDelete, setContatoToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const itemsPerPage = 20;
  
  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [zona, setZona] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tags, setTags] = useState('');

  const calcularLeadScore = (contato: Contato): number => {
    let score = 0;
    if (contato.email) score += 30;
    if (contato.telefone) score += 25;
    if (contato.endereco) score += 15;
    if (contato.tags && contato.tags.length > 0) score += 20;
    if (contato.observacoes) score += 10;
    return Math.min(score, 100);
  };

  const getEngajamento = (score: number): string => {
    if (score >= 90) return "Muito Alto";
    if (score >= 70) return "Alto";
    if (score >= 50) return "Médio";
    return "Baixo";
  };

  const getEngajamentoColor = (engajamento: string): string => {
    switch (engajamento) {
      case "Muito Alto": return "text-red-600";
      case "Alto": return "text-orange-600"; 
      case "Médio": return "text-yellow-600";
      default: return "text-green-600";
    }
  };

  const getTipoContato = (contato: Contato): string => {
    const score = calcularLeadScore(contato);
    if (score >= 80) return "Líder";
    return "Lead";
  };

  const getTipoColor = (tipo: string): string => {
    return tipo === "Líder" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      await createContato({
        nome,
        email: email || undefined,
        telefone: telefone || undefined,
        endereco: endereco || undefined,
        zona: zona || undefined,
        observacoes: observacoes || undefined,
        data_nascimento: dataNascimento || undefined,
        tags: tagsArray
      });
      
      // Reset form
      setNome('');
      setEmail('');
      setTelefone('');
      setEndereco('');
      setZona('');
      setObservacoes('');
      setDataNascimento('');
      setTags('');
      setIsDialogOpen(false);

      toast({
        title: "Sucesso",
        description: "Contato adicionado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar contato",
        variant: "destructive"
      });
    }
  };

  const handleView = (contato: Contato) => {
    setSelectedContato(contato);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (contato: Contato) => {
    setSelectedContato(contato);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: string, updates: Partial<Contato>) => {
    await updateContato(id, updates);
  };

  const handleDeleteClick = (id: string) => {
    setContatoToDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (contatoToDelete) {
      const success = await deleteContato(contatoToDelete);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Contato removido com sucesso!"
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao remover contato",
          variant: "destructive"
        });
      }
      setContatoToDelete(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else if (sortDirection === 'asc') {
        setSortDirection(null);
        setSortField('score');
      } else {
        setSortDirection('desc');
      }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="w-4 h-4 text-indigo-600" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 text-indigo-600" />;
    }
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  };

  // Filtrar e ordenar contatos
  const contatosFiltrados = contatos
    .filter(contato => {
      const matchesSearch = contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contato.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contato.telefone?.includes(searchTerm);
      
      const matchesZona = filtroZona === 'todos' || contato.zona === filtroZona;
      const tipo = getTipoContato(contato);
      const matchesTipo = filtroTipo === 'todos' || tipo === filtroTipo;
      
      return matchesSearch && matchesZona && matchesTipo;
    })
    .sort((a, b) => {
      if (!sortDirection) return calcularLeadScore(b) - calcularLeadScore(a);
      
      let aValue: any;
      let bValue: any;
      
      switch (sortField) {
        case 'nome':
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case 'score':
          aValue = calcularLeadScore(a);
          bValue = calcularLeadScore(b);
          break;
        case 'zona':
        case 'regiao':
          aValue = a.zona?.toLowerCase() || '';
          bValue = b.zona?.toLowerCase() || '';
          break;
        case 'engajamento':
          aValue = calcularLeadScore(a);
          bValue = calcularLeadScore(b);
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

  // Paginação
  const totalPages = Math.ceil(contatosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContatos = contatosFiltrados.slice(startIndex, endIndex);

  const zonas = [...new Set(contatos.map(c => c.zona).filter(Boolean))];

  const estatisticas = {
    total: contatos.length,
    comEmail: contatos.filter(c => c.email).length,
    comTelefone: contatos.filter(c => c.telefone).length,
    aniversariantesHoje: contatos.filter(c => {
      if (!c.data_nascimento) return false;
      const hoje = new Date();
      const nascimento = new Date(c.data_nascimento);
      return nascimento.getMonth() === hoje.getMonth() && 
             nascimento.getDate() === hoje.getDate();
    }).length
  };

  if (loading || adicionandoDados) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {adicionandoDados ? 'Preparando dados de exemplo...' : 'Carregando contatos...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contatos</h1>
          <p className="text-gray-600">Gerencie sua base de contatos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Contato</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo contato
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="zona">Zona</Label>
                  <Input
                    id="zona"
                    value={zona}
                    onChange={(e) => setZona(e.target.value)}
                    placeholder="Centro, Zona Norte, etc."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, número, bairro"
                />
              </div>
              
              <div>
                <Label htmlFor="data-nascimento">Data de Nascimento</Label>
                <Input
                  id="data-nascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="eleitor, apoiador, líder (separadas por vírgula)"
                />
              </div>
              
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Informações adicionais sobre o contato"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Adicionar Contato
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.total}</p>
                <p className="text-sm text-gray-600">Total de Contatos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.comEmail}</p>
                <p className="text-sm text-gray-600">Com Email</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Phone className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.comTelefone}</p>
                <p className="text-sm text-gray-600">Com Telefone</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.aniversariantesHoje}</p>
                <p className="text-sm text-gray-600">Aniversariantes Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar contatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Líder">Líder</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filtroZona} onValueChange={setFiltroZona}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por zona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as zonas</SelectItem>
                {zonas.map(zona => (
                  <SelectItem key={zona} value={zona!}>{zona}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Contatos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-indigo-600">
            Ranking de Contatos
          </CardTitle>
          <CardDescription>
            Mostrando {currentContatos.length} de {contatosFiltrados.length} contatos (Página {currentPage} de {totalPages})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-gray-50 transition-colors min-w-[200px]"
                  onClick={() => handleSort('nome')}
                >
                  <div className="flex items-center gap-2">
                    Contato
                    {getSortIcon('nome')}
                  </div>
                </TableHead>
                <TableHead className="w-32">WhatsApp</TableHead>
                <TableHead className="w-20">Tipo</TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-gray-50 transition-colors w-20"
                  onClick={() => handleSort('score')}
                >
                  <div className="flex items-center gap-2">
                    Score
                    {getSortIcon('score')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-gray-50 transition-colors w-28"
                  onClick={() => handleSort('engajamento')}
                >
                  <div className="flex items-center gap-2">
                    Engajamento
                    {getSortIcon('engajamento')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-gray-50 transition-colors w-28"
                  onClick={() => handleSort('regiao')}
                >
                  <div className="flex items-center gap-2">
                    Região
                    {getSortIcon('regiao')}
                  </div>
                </TableHead>
                <TableHead className="w-28">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentContatos.map((contato, index) => {
                const globalIndex = startIndex + index;
                const leadScore = calcularLeadScore(contato);
                const engajamento = getEngajamento(leadScore);
                const tipo = getTipoContato(contato);
                
                return (
                  <TableRow key={contato.id} className="hover:bg-indigo-50/50">
                    <TableCell className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-600">#{globalIndex + 1}</span>
                        {globalIndex < 3 && (
                          <div className={`w-2 h-2 rounded-full ${
                            globalIndex === 0 ? 'bg-yellow-500' : 
                            globalIndex === 1 ? 'bg-gray-400' : 'bg-orange-600'
                          }`} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {contato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p 
                            className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors text-sm"
                            onClick={() => handleView(contato)}
                          >
                            {contato.nome}
                          </p>
                          <p className="text-xs text-gray-600">{contato.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <MessageCircle className="w-3 h-3" />
                        {contato.telefone || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Badge className={`${getTipoColor(tipo)} border text-xs`}>
                        {tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="font-semibold text-sm">{leadScore}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <span className={`text-xs font-medium ${getEngajamentoColor(engajamento)}`}>
                        {engajamento}
                      </span>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {contato.zona || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-indigo-50 text-xs h-7 px-2"
                          onClick={() => handleView(contato)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-yellow-50 h-7 w-7 p-0"
                          onClick={() => handleEdit(contato)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <ContatoDetailsModalOriginal
        contato={selectedContato}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedContato(null);
        }}
        onEdit={handleEdit}
      />

      <EditContatoModal
        contato={selectedContato}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedContato(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!contatoToDelete} onOpenChange={() => setContatoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este contato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Contatos;
