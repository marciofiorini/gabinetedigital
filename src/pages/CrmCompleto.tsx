
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLeads, LeadStatus } from '@/hooks/useLeads';
import { 
  Target, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  User
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function CrmCompleto() {
  const { leads, loading, createLead, updateLead, deleteLead } = useLeads();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [novoLead, setNovoLead] = useState({
    nome: '',
    email: '',
    telefone: '',
    status: 'novo' as LeadStatus,
    fonte: '',
    interesse: '',
    observacoes: ''
  });

  const handleCreateLead = async () => {
    try {
      await createLead(novoLead);
      setIsDialogOpen(false);
      setNovoLead({
        nome: '',
        email: '',
        telefone: '',
        status: 'novo',
        fonte: '',
        interesse: '',
        observacoes: ''
      });
      toast({
        title: "Sucesso",
        description: "Lead adicionado com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-800';
      case 'contatado': return 'bg-yellow-100 text-yellow-800';
      case 'interesse': return 'bg-purple-100 text-purple-800';
      case 'proposta': return 'bg-orange-100 text-orange-800';
      case 'fechado': return 'bg-green-100 text-green-800';
      case 'perdido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.fonte?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Completo</h1>
          <p className="text-gray-600">Gerencie todos os seus leads e relacionamentos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={novoLead.nome}
                  onChange={(e) => setNovoLead(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={novoLead.email}
                  onChange={(e) => setNovoLead(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={novoLead.telefone}
                  onChange={(e) => setNovoLead(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={novoLead.status} onValueChange={(value: LeadStatus) => setNovoLead(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="contatado">Contatado</SelectItem>
                    <SelectItem value="interesse">Com Interesse</SelectItem>
                    <SelectItem value="proposta">Proposta Enviada</SelectItem>
                    <SelectItem value="fechado">Fechado</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fonte</Label>
                <Input
                  value={novoLead.fonte}
                  onChange={(e) => setNovoLead(prev => ({ ...prev, fonte: e.target.value }))}
                  placeholder="Ex: Site, Indicação, Evento"
                />
              </div>
              <div>
                <Label>Interesse</Label>
                <Input
                  value={novoLead.interesse}
                  onChange={(e) => setNovoLead(prev => ({ ...prev, interesse: e.target.value }))}
                  placeholder="Área de interesse"
                />
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={novoLead.observacoes}
                  onChange={(e) => setNovoLead(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações sobre o lead"
                />
              </div>
              <Button onClick={handleCreateLead} className="w-full">
                Adicionar Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Todos os Leads
          </CardTitle>
          <CardDescription>
            {leads.length} lead(s) cadastrado(s)
          </CardDescription>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar leads..."
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
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <h3 className="font-semibold">{lead.nome}</h3>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                        {lead.fonte && (
                          <Badge variant="outline">{lead.fonte}</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {lead.email && (
                          <p className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </p>
                        )}
                        {lead.telefone && (
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.telefone}
                          </p>
                        )}
                        {lead.interesse && (
                          <p className="text-gray-500">
                            <strong>Interesse:</strong> {lead.interesse}
                          </p>
                        )}
                      </div>
                      {lead.observacoes && (
                        <p className="text-sm text-gray-500 mt-2">{lead.observacoes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteLead(lead.id)}
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
