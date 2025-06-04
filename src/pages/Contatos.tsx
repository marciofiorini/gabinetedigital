
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Users, MapPin, Phone, Mail, Calendar, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContatosFicticios } from '@/hooks/useContatosFicticios';

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

const Contatos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { adicionandoDados } = useContatosFicticios();
  
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroZona, setFiltroZona] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [zona, setZona] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (user) {
      fetchContatos();
    }
  }, [user]);

  const fetchContatos = async () => {
    try {
      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContatos(data || []);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar contatos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
      
      const { data, error } = await supabase
        .from('contatos')
        .insert([{
          nome,
          email: email || null,
          telefone: telefone || null,
          endereco: endereco || null,
          zona: zona || null,
          observacoes: observacoes || null,
          data_nascimento: dataNascimento || null,
          tags: tagsArray,
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      setContatos(prev => [data, ...prev]);
      
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

  const contatosFiltrados = contatos.filter(contato => {
    const matchesSearch = contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contato.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contato.telefone?.includes(searchTerm);
    
    const matchesZona = filtroZona === 'todos' || contato.zona === filtroZona;
    
    return matchesSearch && matchesZona;
  });

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
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
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

      {/* Lista de Contatos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos ({contatosFiltrados.length})</CardTitle>
          <CardDescription>
            {searchTerm && `Resultados para "${searchTerm}"`}
            {filtroZona !== 'todos' && ` • Zona: ${filtroZona}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contatosFiltrados.map((contato) => (
              <div key={contato.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{contato.nome}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {contato.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contato.email}
                        </span>
                      )}
                      {contato.telefone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contato.telefone}
                        </span>
                      )}
                      {contato.zona && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {contato.zona}
                        </span>
                      )}
                    </div>
                    {contato.tags && contato.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {contato.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {contato.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{contato.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {contatosFiltrados.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum contato encontrado</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? `Não encontramos contatos que correspondam à sua busca "${searchTerm}"`
                    : 'Comece adicionando seu primeiro contato'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contatos;
