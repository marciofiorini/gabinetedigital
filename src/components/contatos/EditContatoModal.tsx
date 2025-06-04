
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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

interface EditContatoModalProps {
  contato: Contato | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Contato>) => Promise<void>;
}

export const EditContatoModal = ({ contato, isOpen, onClose, onSave }: EditContatoModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    zona: "",
    observacoes: "",
    dataNascimento: "",
    tags: "",
    profissao: "",
    empresa: "",
    faixaRenda: "",
    escolaridade: "",
    estadoCivil: "",
    numeroFilhos: "",
    interessePrincipal: "",
    origemLead: "",
    whatsapp: "",
    instagram: ""
  });

  useEffect(() => {
    if (contato) {
      setFormData({
        nome: contato.nome || "",
        email: contato.email || "",
        telefone: contato.telefone || "",
        endereco: contato.endereco || "",
        zona: contato.zona || "",
        observacoes: contato.observacoes || "",
        dataNascimento: contato.data_nascimento || "",
        tags: contato.tags ? contato.tags.join(", ") : "",
        profissao: "",
        empresa: "",
        faixaRenda: "",
        escolaridade: "",
        estadoCivil: "",
        numeroFilhos: "",
        interessePrincipal: "Infraestrutura",
        origemLead: "Evento",
        whatsapp: contato.telefone || "",
        instagram: ""
      });
    }
  }, [contato]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contato || !formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      await onSave(contato.id, {
        nome: formData.nome,
        email: formData.email || undefined,
        telefone: formData.telefone || undefined,
        endereco: formData.endereco || undefined,
        zona: formData.zona || undefined,
        observacoes: formData.observacoes || undefined,
        data_nascimento: formData.dataNascimento || undefined,
        tags: tagsArray
      });

      toast({
        title: "Sucesso",
        description: "Contato atualizado com sucesso!"
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar contato",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!contato) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Lead: {contato.nome}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <Select defaultValue="Lead">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Líder">Líder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="@usuario"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <Label htmlFor="zona">Região/Zona</Label>
                <Select value={formData.zona} onValueChange={(value) => setFormData(prev => ({ ...prev, zona: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zona Norte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Centro">Centro</SelectItem>
                    <SelectItem value="Zona Norte">Zona Norte</SelectItem>
                    <SelectItem value="Zona Sul">Zona Sul</SelectItem>
                    <SelectItem value="Zona Leste">Zona Leste</SelectItem>
                    <SelectItem value="Zona Oeste">Zona Oeste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="data-aniversario">Data de Aniversário</Label>
                <Input
                  id="data-aniversario"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataNascimento: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações Profissionais */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações Profissionais</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formData.profissao}
                  onChange={(e) => setFormData(prev => ({ ...prev, profissao: e.target.value }))}
                  placeholder="Ex: Enfermeira"
                />
              </div>
              <div>
                <Label htmlFor="empresa">Empresa/Local de Trabalho</Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                  placeholder="Ex: Hospital Municipal"
                />
              </div>
              
              <div>
                <Label htmlFor="faixa-renda">Faixa de Renda</Label>
                <Select value={formData.faixaRenda} onValueChange={(value) => setFormData(prev => ({ ...prev, faixaRenda: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ate-2sm">Até 2 SM</SelectItem>
                    <SelectItem value="2-5sm">2 a 5 SM</SelectItem>
                    <SelectItem value="5-10sm">5 a 10 SM</SelectItem>
                    <SelectItem value="acima-10sm">Acima de 10 SM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="escolaridade">Escolaridade</Label>
                <Select value={formData.escolaridade} onValueChange={(value) => setFormData(prev => ({ ...prev, escolaridade: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                    <SelectItem value="medio">Ensino Médio</SelectItem>
                    <SelectItem value="superior">Ensino Superior</SelectItem>
                    <SelectItem value="pos">Pós-graduação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="estado-civil">Estado Civil</Label>
                <Select value={formData.estadoCivil} onValueChange={(value) => setFormData(prev => ({ ...prev, estadoCivil: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="numero-filhos">Número de Filhos</Label>
                <Select value={formData.numeroFilhos} onValueChange={(value) => setFormData(prev => ({ ...prev, numeroFilhos: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Nenhum</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4+">4 ou mais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações Políticas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações Políticas</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="interesse-principal">Interesse Principal</Label>
                <Select value={formData.interessePrincipal} onValueChange={(value) => setFormData(prev => ({ ...prev, interessePrincipal: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Saúde">Saúde</SelectItem>
                    <SelectItem value="Educação">Educação</SelectItem>
                    <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="Segurança">Segurança</SelectItem>
                    <SelectItem value="Meio Ambiente">Meio Ambiente</SelectItem>
                    <SelectItem value="Transporte">Transporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="origem-lead">Origem do Lead</Label>
                <Select value={formData.origemLead} onValueChange={(value) => setFormData(prev => ({ ...prev, origemLead: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Evento">Evento</SelectItem>
                    <SelectItem value="Redes Sociais">Redes Sociais</SelectItem>
                    <SelectItem value="Indicação">Indicação</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Panfletagem">Panfletagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Anotações importantes sobre o lead..."
                rows={4}
              />
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center gap-2 mb-2">
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Nova tag..."
                className="flex-1"
              />
              <Button type="button" size="sm" className="px-4">
                +
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">VIP ×</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
