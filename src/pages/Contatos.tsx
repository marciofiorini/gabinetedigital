
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useContatos } from '@/hooks/useContatos';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Contatos() {
  const { contatos, loading, createContato, updateContato, deleteContato } = useContatos();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [novoContato, setNovoContato] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    zona: '',
    data_nascimento: '',
    observacoes: '',
    tags: [] as string[]
  });

  const handleCreateContato = async () => {
    try {
      await createContato(novoContato);
      setIsDialogOpen(false);
      setNovoContato({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        zona: '',
        data_nascimento: '',
        observacoes: '',
        tags: []
      });
      toast({
        title: "Sucesso",
        description: "Contato adicionado com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredContatos = contatos.filter(contato => 
    contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.zona?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contatos</h1>
          <p className="text-gray-600">Gerencie sua rede de contatos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Contato</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={novoContato.nome}
                  onChange={(e) => setNovoContato(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={novoContato.email}
                  onChange={(e) => setNovoContato(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={novoContato.telefone}
                  onChange={(e) => setNovoContato(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label>Zona Eleitoral</Label>
                <Input
                  value={novoContato.zona}
                  onChange={(e) => setNovoContato(prev => ({ ...prev, zona: e.target.value }))}
                  placeholder="Ex: Zona Norte"
                />
              </div>
              <div>
                <Label>Data de Nascimento</Label>
                <Input
                  type="date"
                  value={novoContato.data_nascimento}
                  onChange={(e) => setNovoContato(prev => ({ ...prev, data_nascimento: e.target.value }))}
                />
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={novoContato.observacoes}
                  onChange={(e) => setNovoContato(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações sobre o contato"
                />
              </div>
              <Button onClick={handleCreateContato} className="w-full">
                Adicionar Contato
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lista de Contatos
          </CardTitle>
          <CardDescription>
            {contatos.length} contato(s) cadastrado(s)
          </CardDescription>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar contatos..."
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
              {filteredContatos.map((contato) => (
                <div key={contato.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{contato.nome}</h3>
                        {contato.zona && (
                          <Badge variant="outline">{contato.zona}</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {contato.email && (
                          <p className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {contato.email}
                          </p>
                        )}
                        {contato.telefone && (
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contato.telefone}
                          </p>
                        )}
                        {contato.endereco && (
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {contato.endereco}
                          </p>
                        )}
                        {contato.data_nascimento && (
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(contato.data_nascimento).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                      {contato.observacoes && (
                        <p className="text-sm text-gray-500 mt-2">{contato.observacoes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteContato(contato.id)}
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
