
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    tags: ""
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
        tags: contato.tags ? contato.tags.join(", ") : ""
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Contato</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="zona">Zona</Label>
              <Input
                id="zona"
                value={formData.zona}
                onChange={(e) => setFormData(prev => ({ ...prev, zona: e.target.value }))}
                placeholder="Centro, Zona Norte, etc."
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              placeholder="Rua, número, bairro"
            />
          </div>
          
          <div>
            <Label htmlFor="data-nascimento">Data de Nascimento</Label>
            <Input
              id="data-nascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={(e) => setFormData(prev => ({ ...prev, dataNascimento: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="eleitor, apoiador, líder (separadas por vírgula)"
            />
          </div>
          
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Informações adicionais sobre o contato"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
